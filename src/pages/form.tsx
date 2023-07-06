import { Link } from "react-router-dom";
import { useState } from "react";

export default function Form() {
  const key = 8888;

  const [id, setId] = useState(0);

  return (
    <form className="flex flex-col items-center justify-center h-[100%] form">
      <div className="bg-blue-950 md:px-32 md:py-28 sm:px-20 sm:py-16 px-12 py-8 flex flex-col items-center rounded border border-blue-900 shadow-lg">
        <div className="flex flex-col items-center">
          <label htmlFor="id">
            <h2 className="tracking-[.2em] mb-2 font-Belanosima">LOGIN</h2>
          </label>
          <p>Gunakan ID mu untuk masuk</p>
        </div>
        <input
          type="number"
          id="id"
          name="id"
          className="outline-none rounded p-3 bg-blue-900 my-5 font-medium focus:ring-2 ring-yellow-300 focus:border border-yellow-500 w-full"
          onChange={(e) => setId(parseInt(e.target.value))}
        />
        <Link to={"/vote"} className="w-full">
          <button
            type="submit"
            className="w-full px-5 py-2 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] font-medium disabled:bg-blue-900"
            disabled={id !== key}
          >
            Masuk
          </button>
        </Link>
      </div>
    </form>
  );
}
