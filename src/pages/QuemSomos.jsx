import "./QuemSomos.css";
import Hero from "../components/Hero/Hero";

export default function QuemSomos() {
  return (
       <>
       {/* HERO */}
      <Hero
        title="Quem Somos"
      />
      
      <main className="quem-somos">
        
      <section>
        <h2>Nós queremos um futuro melhor para o seu filho.</h2>
      </section>  
      {/* TEXTO */}
      <section className="quem-somos-conteudo">

        <div className="quem-somos-texto" >
        <p>
          Nossa missão é ajudar os pais na difícil tarefa de educar e
          conscientizar os pequenos sobre os benefícios de consumir de maneira
          compartilhada e inteligente.
        </p>
        </div>

        <p>
          Acreditamos que seu filho deve aprender desde cedo a se divertir sem a
          presença do sentimento de posse. Preservar, conservar e compartilhar
          são essenciais para um desenvolvimento sustentável.
        </p>

        <p>
          Assim, sua família economiza e pode investir em outras áreas da
          educação, enquanto seu filho aproveita brinquedos adequados para cada
          fase.
        </p>
      </section>

      {/* CARDS */}
      <section className="quem-somos-cards">
        <div className="card">
          <div className="card-icon">🎯</div>
          <h3>Missão</h3>
          <p>
            Incentivar o consumo consciente desde a infância, promovendo o
            compartilhamento, a educação sustentável e o desenvolvimento
            saudável das crianças.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">🌍</div>
          <h3>Visão</h3>
          <p>
            Construir um futuro onde as crianças cresçam entendendo que
            compartilhar é mais valioso do que possuir, cuidando melhor do
            planeta.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">❤️</div>
          <h3>Valores</h3>
          <p>
            Sustentabilidade, educação, empatia, responsabilidade social e
            respeito ao desenvolvimento infantil.
          </p>
        </div>
      </section>
    </main>
     </>
  );
}
