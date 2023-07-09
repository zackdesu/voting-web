import { forwardRef, ForwardedRef, useEffect, useState } from "react";
import Card from "../components/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Vote = forwardRef((_props, ref: ForwardedRef<HTMLDivElement>) => {
  const [part, setPart] = useState<any[]>([]);
  const navigate = useNavigate();

  const URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCAL_API_URL
      : import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(URL + "/part", { withCredentials: true })
      .then((res) => setPart(res.data))
      .catch(() => navigate("/"));
  }, []);

  return (
    <>
      <div className="flex flex-col items-center relative p-5" ref={ref}>
        <div className="text-center">
          <h1>Vote</h1>
          <p>- Dukunglah pilihanmu -</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center lg:w-[738px] lg:h-[544px] sm:w-[600px] sm:h-[480px]">
          {part.map((e, i) => (
            <Card name={e.name} src={e.image} key={i} />
          ))}
        </div>
      </div>
    </>
  );
});

export default Vote;
