import "./QuemSomos.css";
import Hero from "../components/Hero/Hero";

export default function QuemSomos() {
  return (
       <>
       {/* HERO */}
      <Hero
        title="Quem Somos"
        subtitle="Transformamos o brincar em um futuro melhor para as crianças e para o planeta."
      />
       
      <main className="quem-somos">
         
      <section className="quem-somos-intro">
        <h2 className="section-title">Brincar, compartilhar e aprender para um futuro melhor.</h2>
      </section>  

      <section className="quem-somos-conteudo">
        <p>
          Nossa missão é ajudar os pais na difícil tarefa de educar e
          conscientizar os pequenos sobre os benefícios de consumir de maneira
          compartilhada e inteligente.
        </p>

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

      <section className="quem-somos-cards">
        <article className="quem-somos-card mission-card">
          <div className="card-icon">🎯</div>
          <div>
            <h3>Missão</h3>
            <p>
              Incentivar o consumo consciente desde a infância, promovendo o
              compartilhamento, a educação sustentável e o desenvolvimento
              saudável das crianças.
            </p>
          </div>
        </article>

        <article className="quem-somos-card vision-card">
          <div className="card-icon">🌍</div>
          <div>
            <h3>Visão</h3>
            <p>
              Construir um futuro onde as crianças cresçam entendendo que
              compartilhar é mais valioso do que possuir, cuidando melhor do
              planeta.
            </p>
          </div>
        </article>

        <article className="quem-somos-card values-card">
          <div className="card-icon">❤️</div>
          <div>
            <h3>Valores</h3>
            <p>
              Sustentabilidade, educação, empatia, responsabilidade social e
              respeito ao desenvolvimento infantil.
            </p>
          </div>
        </article>
      </section>
    </main>
     </>
  );
}
