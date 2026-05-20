import { Link } from "react-router-dom";
import React from "react";
import banner from "../img/images/banner-home.png";
import alugar from "../img/images/comoalugar-banner.png";
import "./Home.css";
import { 
  FaPuzzlePiece, 
  FaTruck, 
  FaBroom, 
  FaLeaf, 
  FaPiggyBank 
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="home">

      {/* BANNER */}
      <section className="home-banner">
        <img
          src={banner}
          alt="Imagem da página inicial"
          className="banner-img"
        />
      </section>

      <section className="comoalugar-banner">
        <img
          src={alugar}
          alt="Descrição de como alugar"
          className="banner-img"
        />
      </section>

      {/* APRESENTAÇÃO */}
      <section className="apresentacao">
        <h2>
          CONFIRA OS PRODUTOS EM DESTAQUES:
        </h2>

      </section>


     <section className="apresentacao-vantagens">
       <div className="conteudo-vantagens">

    <div className="texto-vantagens">
  <h2>VANTAGENS EM ALUGAR:</h2>

  <p>
    Alugar é sempre mais fácil e prático! Além da diversão compartilhada com outras famílias,
    você e seu filho contribuem para a sustentabilidade do planeta.
  </p>
  </div>

<section className="vantagens">
  <div className="vantagens-cards">
<span>
      <FaPuzzlePiece className="icone-vantagem" />
      </span>

      <h3>Diversidade de brinquedos</h3>
      <p>
        Seu filho terá uma gama muito maior de itens disponíveis no mercado,
        todos cuidadosamente selecionados e aprovados.
      </p>
    </div>

    <div className="vantagens-cards">
      <span>
      <FaTruck className="icone-vantagem" />
      </span>
      <h3>Comodidade e ganho de tempo</h3>
      <p>
        Entrega e retirada dos brinquedos em sua casa ou na loja física,
        com total praticidade.
      </p>
    </div>

    <div className="vantagens-cards">
      <span>
      <FaBroom className="icone-vantagem" />
      </span>
      <h3>Eliminação da bagunça</h3>
      <p>
        Mais espaço em casa, menos acúmulo de brinquedos sem uso.
      </p>
    </div>

    <div className="vantagens-cards">
      <span>
      <FaLeaf className="icone-vantagem" />
      </span>
      <h3>Sustentabilidade</h3>
      <p>
        Incentivo ao consumo consciente e redução de impacto ambiental.
      </p>
    </div>

    <div className="vantagens-cards">
      <span>
      <FaPiggyBank className="icone-vantagem" />
      </span>
      <h3>Economia</h3>
      <p>
        Economia de até 70% pagando apenas pelo período de uso.
      </p>
    </div>

</section>
  </div>
</section>


      {/* CHAMADA PARA AÇÃO */}
      <section className="cta">
        <h3>PRONTO PARA ALUGAR?</h3>
        <p>
          Escolha os produtos ideais para o seu momento especial.
        </p>

    <Link to="/produtos">
        <button className="cta-button">
          Ver todos os produtos
        </button>
    </Link>
      </section>

    </main>
  );
}