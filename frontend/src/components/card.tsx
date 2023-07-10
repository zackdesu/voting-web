import { useState } from "react";
import { PiWarningCircleBold } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { api } from "./api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Card({
  src,
  name,
  id,
}: {
  src?: string;
  name: string;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = (id: string) => {
    api
      .post(`/selection/${id}`)
      .then((res) => {
        setIsOpen(false);
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

  const Modal = () => {
    return (
      <>
        <div className="bg-[rgba(0,0,0,.5)] fixed top-0 right-0 left-0 bottom-0"></div>
        <div className="fixed top-1/4 bottom-1/4 w-10/12 sm:w-3/4 md:w-1/2 lg:w-5/12 bg-yellow-300 rounded flex flex-col items-center justify-around z-20 p-5">
          <button
            className="absolute -right-3 -top-5 bg-yellow-400 ring-1 ring-blue-600 rounded-full p-2 text-blue-700 font-bold"
            onClick={() => setIsOpen(false)}
          >
            <AiOutlineClose size={20} />
          </button>
          <div className="flex flex-col items-center">
            <div>
              <PiWarningCircleBold size={70} className="text-red-600 mb-3" />
            </div>
            <h3 className="text-blue-700 mt-3">Apakah kamu yakin?</h3>
          </div>
          <div>
            <button
              className="px-5 py-2 xl:mx-2 mx-1 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow font-medium"
              onClick={() => handleConfirm(id)}
            >
              Ya
            </button>
            <button
              className="px-5 py-2 xl:mx-2 mx-1 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow font-medium"
              onClick={() => setIsOpen(false)}
            >
              Tidak
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mx-2 my-2">
        <div className="lg:w-48 lg:h-64 sm:w-[10.5rem] sm:h-[14rem] w-[7.5rem] h-[10rem] flex flex-col items-center bg-blue-950 p-2 rounded justify-between sm:pb-5">
          <div className="w-full h-1/2">
            <img src={src} className="object-cover w-full h-full" alt={name} />
          </div>
          <div className="flex flex-col items-center h-1/2 w-full justify-evenly">
            <div className="text-center">
              <p>
                <b>{name}</b>
              </p>
              <p className="hover:underline underline-offset-1 cursor-pointer">
                Visi & Misi
              </p>
            </div>
            <div className="flex justify-center">
              <button
                className="px-5 py-2 xl:mx-2 mx-1 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow font-medium"
                onClick={() => setIsOpen(true)}
              >
                <p>Pilih</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <Modal />}
    </>
  );
}
