import { useParams } from "react-router-dom";
import Hero from "../components/Hero/Hero";
import "./Pesquisa.css";

export default function Pesquisa() {
  const { termo } = useParams();

  return (
    <>
      <Hero title="Resultados da pesquisa" subtitle="Veja o termo pesquisado e continue explorando nossos produtos." />
      <main className="pesquisa-page">
        <p>Você pesquisou por: <strong>{termo}</strong></p>
      </main>
    </>
  );
}
