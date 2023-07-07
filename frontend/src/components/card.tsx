export default function Card({ src, name }: { src?: string; name: string }) {
  return (
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
            <p>Visi & Misi</p>
          </div>
          <div className="flex justify-center">
            <button className="px-5 py-2 xl:mx-2 mx-1 bg-blue-700 hover:bg-blue-800 rounded cursor-pointer shadow font-medium">
              <p>Pilih</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
