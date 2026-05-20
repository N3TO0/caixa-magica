import { Link } from "react-router-dom";
import banner from "../assets/images/banner-home.png";
import alugar from "../assets/images/comoalugar-banner.png";
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
      <section className="home-hero">
        <div className="home-hero-text">
          <span>Caixa Mágica</span>
          <h1>Brinquedos para cada fase, sem acumular em casa.</h1>
          <p>
            Alugue itens infantis selecionados, higienizados e prontos para criar novas histórias em família.
          </p>
          <Link to="/produtos" className="primary-button">Ver produtos</Link>
        </div>
        <div className="home-hero-image">
          <img src={banner} alt="Imagem da página inicial" />
        </div>
      </section>

      <section className="comoalugar-banner">
        <img
          src={alugar}
          alt="Descrição de como alugar"
          className="banner-img"
        />
      </section>

      <section className="apresentacao">
        <h2 className="section-title">Confira os produtos em destaque</h2>
        <p className="section-lead">Escolha brinquedos e acessórios adequados para o momento da sua criança.</p>
      </section>

      <section className="apresentacao-vantagens">
        <div className="conteudo-vantagens">

    <div className="texto-vantagens">
  <h2>Vantagens em alugar</h2>

  <p>
    Alugar é sempre mais fácil e prático! Além da diversão compartilhada com outras famílias,
    você e seu filho contribuem para a sustentabilidade do planeta.
  </p>
  </div>

<section className="vantagens">
    <article className="vantagens-cards">
<span>
      <FaPuzzlePiece className="icone-vantagem" />
      </span>

      <h3>Diversidade de brinquedos</h3>
      <p>
        Seu filho terá uma gama muito maior de itens disponíveis no mercado,
        todos cuidadosamente selecionados e aprovados.
      </p>
    </article>

    <article className="vantagens-cards">
      <span>
      <FaTruck className="icone-vantagem" />
      </span>
      <h3>Comodidade e ganho de tempo</h3>
      <p>
        Entrega e retirada dos brinquedos em sua casa ou na loja física,
        com total praticidade.
      </p>
    </article>

    <article className="vantagens-cards">
      <span>
      <FaBroom className="icone-vantagem" />
      </span>
      <h3>Eliminação da bagunça</h3>
      <p>
        Mais espaço em casa, menos acúmulo de brinquedos sem uso.
      </p>
    </article>

    <article className="vantagens-cards">
      <span>
      <FaLeaf className="icone-vantagem" />
      </span>
      <h3>Sustentabilidade</h3>
      <p>
        Incentivo ao consumo consciente e redução de impacto ambiental.
      </p>
    </article>

    <article className="vantagens-cards">
      <span>
      <FaPiggyBank className="icone-vantagem" />
      </span>
      <h3>Economia</h3>
      <p>
        Economia de até 70% pagando apenas pelo período de uso.
      </p>
    </article>

</section>
  </div>
</section>


      <section className="cta">
        <h3>PRONTO PARA ALUGAR?</h3>
        <p>
          Escolha os produtos ideais para o seu momento especial.
        </p>

        <Link to="/produtos" className="primary-button">Ver todos os produtos</Link>
      </section>

    </main>
  );
}
