import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Card({
  src,
  name,
  id,
  visi,
  misi,
}: {
  src?: string;
  name: string;
  id: string;
  visi?: Array<string>;
  misi?: Array<string>;
}) {
  const [isConfirmOpen, setisConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = (id: string) => {
    api
      .post(`/selection/${id}`)
      .then((res) => {
        setisConfirmOpen(false);
        return toast.success(res.data.message);
      })
      .catch((res) => {
        if (res.response.data.message === "Session expired, please login!") {
          toast.error(res.response.data.message);
          return navigate("/");
        }
        toast.error(res.response.data.message);
      });
  };

  const ConfirmModal = () => {
    return (
      <>
        <div className="bg-[rgba(0,0,0,.5)] fixed top-0 right-0 left-0 bottom-0"></div>
        <div className="fixed top-1/4 bottom-1/4 flex items-center justify-center lg:w-3/4">
          <div className="h-1/2 lg:w-1/2 bg-yellow-50 rounded-lg flex flex-col justify-between z-20 py-3 md:py-2 px-3 shadow-lg max-sm:m-3">
            <div className="flex flex-col">
              <h4 className="text-blue-950 mt-2">
                Apakah anda yakin dengan pilihan anda?
              </h4>
              <p className="text-blue-950 opacity-70 text-[.55rem] sm:text-[.6rem] md:text-xs mt-1">
                Setelah anda memilih, anda tidak bisa memilih peserta yang
                lainnya.
              </p>
            </div>
            <div className="flex justify-end mb-1">
              <button
                className="px-5 py-2 xl:mx-2 mx-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-500 hover:text-zinc-600 rounded-full cursor-pointer shadow font-medium"
                onClick={() => setisConfirmOpen(false)}
              >
                <p className="text-[.55rem] sm:text-[.6rem] md:text-xs">
                  Tidak
                </p>
              </button>
              <button
                className="px-3 md:px-5 py-2 xl:mx-2 mx-1 bg-blue-700 hover:bg-blue-800 text-yellow-50 hover:text-yellow-100 rounded-full cursor-pointer shadow font-medium"
                onClick={() => handleConfirm(id)}
              >
                <p className="text-[.55rem] sm:text-[.6rem] md:text-xs">
                  Ya, saya yakin.
                </p>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const DetailModal = ({
    name,
    visi,
    misi,
  }: {
    name: string;
    visi?: Array<string>;
    misi?: Array<string>;
  }) => {
    return (
      <>
        <div className="bg-[rgba(0,0,0,.5)] fixed top-0 right-0 left-0 bottom-0"></div>
        <div className="fixed top-1/4 bottom-1/4 flex items-center justify-center w-3/4">
          <div className="h-fit w-3/4 bg-yellow-50 rounded-lg flex flex-col justify-between z-20 py-3 md:py-2 px-3 shadow-lg max-sm:m-3">
            <div className="flex flex-col">
              <h4 className="text-blue-950 my-2 text-center">{name}</h4>
              <div className="flex flex-col max-h-60 overflow-y-auto minimal">
                <p className="text-center mb-2">- Visi -</p>
                <ol
                  type="1"
                  start={1}
                  className="text-blue-950 opacity-70 text-[.55rem] sm:text-[.6rem] md:text-xs my-1 list-decimal mx-auto"
                >
                  {visi
                    ? visi?.map((e, i) => (
                        <li className="cursor-default pl-10" key={i}>
                          {e}
                        </li>
                      ))
                    : "Tidak ada"}
                </ol>
                <p className="text-center mb-2">- Misi -</p>
                <ol
                  type="1"
                  start={1}
                  className="text-blue-950 opacity-70 text-[.55rem] sm:text-[.6rem] md:text-xs my-1 list-decimal mx-auto"
                >
                  {misi
                    ? misi?.map((e, i) => (
                        <li className="cursor-default pl-10" key={i}>
                          {e}
                        </li>
                      ))
                    : "Tidak ada"}
                </ol>
              </div>
            </div>
            <div className="flex justify-end mb-1">
              <button
                className="px-5 py-2 xl:mx-2 mx-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-500 hover:text-zinc-600 rounded-full cursor-pointer shadow font-medium"
                onClick={() => setIsDetailOpen(false)}
              >
                <p className="text-[.55rem] sm:text-[.6rem] md:text-xs">
                  Tutup
                </p>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="m-2 max-[319px]:m-1">
        <div className="lg:w-48 lg:h-64 sm:w-[10.5rem] sm:h-[14rem] w-[9rem] h-[12rem] flex flex-col items-center bg-blue-950 p-2 rounded justify-between sm:pb-5">
          <div className="w-full h-1/2">
            <img src={src} className="object-cover w-full h-full" alt={name} />
          </div>
          <div className="flex flex-col items-center h-1/2 w-full justify-evenly">
            <div className="text-center">
              <p>
                <b>{name}</b>
              </p>
              <p
                className="hover:underline underline-offset-1 cursor-pointer"
                onClick={() => setIsDetailOpen(true)}
              >
                Visi & Misi
              </p>
            </div>
            <div className="flex justify-center">
              <button
                className="px-5 py-2 xl:mx-2 mx-1 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow font-medium"
                onClick={() => setisConfirmOpen(true)}
              >
                <p>Pilih</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isDetailOpen && <DetailModal name={name} visi={visi} misi={misi} />}
      {isConfirmOpen && <ConfirmModal />}
    </>
  );
}
