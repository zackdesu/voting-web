import Card from "../components/card";

export default function Vote() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center">
        <h1>Vote</h1>
        <p>- Dukunglah pilihanmu -</p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center lg:w-[738px] lg:h-[544px] sm:w-[600px] sm:h-[480px]">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
