import { useParams } from "react-router-dom";

export default function Pesquisa() {
  const { termo } = useParams();

  return (
    <div>
      <h1>Resultados da pesquisa</h1>
      <p>Você pesquisou por: <strong>{termo}</strong></p>
    </div>
  );
}