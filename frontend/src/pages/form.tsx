// import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../components/api";

export default function Form() {
  const [name, setName] = useState("");
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    api
      .post(
        "/login",
        { userId: id, name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => navigate("/vote"))
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center h-[100%] form"
      >
        <div className="bg-blue-950 md:px-32 md:py-20 sm:px-20 sm:py-14 px-12 py-6 flex flex-col items-center rounded border border-yellow-900 shadow-inner">
          <div className="flex flex-col items-center">
            <h2 className="tracking-[.2em] mb-5 font-Belanosima">LOGIN</h2>
          </div>
          <label htmlFor="name" className="w-full">
            <p>Nama</p>
          </label>
          <input
            type="text"
            id="id"
            name="id"
            className="outline-none rounded p-3 bg-blue-900 mt-2 mb-3 font-medium focus:ring-2 ring-yellow-300 focus:border border-yellow-500 w-full"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <label htmlFor="id" className="w-full">
            <p>User ID</p>
          </label>
          <input
            type="number"
            id="id"
            name="name"
            className="outline-none rounded p-3 bg-blue-900 mt-2 mb-5 font-medium focus:ring-2 ring-yellow-300 focus:border border-yellow-500 w-full"
            onChange={(e) => setId(parseInt(e.target.value))}
            autoComplete="off"
          />
          <button
            type="submit"
            className="w-full px-5 py-2 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] font-medium disabled:bg-blue-900"
          >
            Masuk
          </button>
        </div>
      </form>
    </>
  );
}
