import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="mb-5">Halaman tidak ditemukan</h1>
      <p>Kamu akan diarahkan kembali dalam waktu 3 detik...</p>
    </div>
  );
};

export default NotFound;
