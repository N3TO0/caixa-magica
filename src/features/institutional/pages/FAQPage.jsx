import { useState } from "react";
import Hero from "@/shared/components/Hero";
import "../styles/FAQPage.css";

export default function FAQPage() {

  const [novaPergunta, setNovaPergunta] = useState("");
  const [listaPerguntas, setListaPerguntas] = useState([]);
  const [aberta, setAberta] = useState(null);

const enviarPergunta = () => {
  if (!novaPergunta.trim()) {
    alert("Digite uma pergunta.");
    return;
  }

  if (novaPergunta.length > 300) {
    alert("A pergunta deve ter no máximo 300 caracteres.");
    return;
  }

  setListaPerguntas((prev) => [...prev, {
    texto: novaPergunta.trim(),
    data: new Date().toLocaleString()
  }]);

  setNovaPergunta("");
};

  const toggle = (index) => {
    setAberta(aberta === index ? null : index);
  };

  const perguntas = [
    {
      pergunta: "MEU FILHO NÃO GOSTOU DOS BRINQUEDOS, POSSO DEVOLVER ANTES DO PRAZO?",
      resposta: (
        <>
          <p>
            Sim! Caso a criança não tenha demonstrado interesse de imediato,
            tente incentivá-lo aos poucos em outros dias, pois às vezes eles
            demoram um pouco mais para se interessarem pelo brinquedo.
          </p>
          <p>
            Se ainda assim quiser devolver o produto, temos duas opções:
          </p>
          <ul>
            <li>Entrega do brinquedo em nosso estoque (sem taxa).</li>
            <li>Busca no endereço do solicitante (taxa de R$ 30,00).</li>
          </ul>
          <p>
            Em ambos os casos, o solicitante recebe crédito proporcional ao
            período restante para alugar qualquer outro item, a qualquer tempo.
          </p>
        </>
      ),
    },
    {
      pergunta:
        "O QUE ACONTECE SE MEU FILHO PERDER ALGUMA PEÇA OU DANIFICAR O BRINQUEDO?",
      resposta: (
        <>
          <p>
            Trabalhamos com brinquedos duráveis e entendemos o desgaste natural
            do uso. Pequenos riscos ou manchas não são um problema.
          </p>
          <p>
            Porém, se houver dano ou perda de componente que inviabilize a
            locação do brinquedo, será cobrado 50% do valor do produto.
          </p>
          <p>
            Caso o dano inviabilize totalmente o uso, será cobrado o valor de
            mercado com desconto de 20%, e você poderá ficar com o brinquedo.
          </p>
        </>
      ),
    },
    {
      pergunta: "OS BRINQUEDOS JÁ VÊM COM PILHA?",
      resposta: (
        <p>
          Sim! Todos os brinquedos eletrônicos são entregues com pilhas
          recarregáveis, sempre carregadas. Elas devem ser devolvidas junto com
          o brinquedo. Não é necessário recarregá-las.
        </p>
      ),
    },
    {
      pergunta: "COMO OS BRINQUEDOS SÃO LIMPOS?",
      resposta: (
        <>
          <p>
            Todos os brinquedos são limpos e desinfetados antes e depois de cada
            locação.
          </p>
          <p>
            A maioria é higienizada com água e sabão neutro e desinfetada com
            álcool 70%. Os brinquedos de tecido são lavados e secos ao sol.
          </p>
        </>
      ),
    },
    {
      pergunta: "O QUE ACONTECE AO FINAL DO PRAZO DO ALUGUEL?",
      resposta: (
        <>
          <p>
            Nos últimos 5 dias do prazo do aluguel, entraremos em contato para
            informar as opções disponíveis:
          </p>
          <ul>
            <li>Troca do brinquedo/produto</li>
            <li>Renovação do prazo</li>
            <li>Devolução</li>
          </ul>
          <p>
            Caso opte pela troca, basta realizar o pedido no site. Na entrega,
            recolheremos os brinquedos com prazo expirado.
          </p>
          <p>
            Se houver apenas renovação, não será cobrado frete. Caso não haja
            resposta, entenderemos que a opção será pela devolução.
          </p>
        </>
      ),
    },
  ];

  return (
     <>
       {/* HERO */}
      <Hero
        title="Perguntas Frequentes"
        subtitle="Tire suas principais dúvidas sobre aluguel, devolução, limpeza e renovação."
      />
    <main className="faq-container">
  
      {perguntas.map((item, index) => (
        <div className="faq-item" key={index}>
          <button
            className={`faq-pergunta ${aberta === index ? "ativa" : ""}`}
            onClick={() => toggle(index)}
          >
            {item.pergunta}
            <span>{aberta === index ? "−" : "+"}</span>
          </button>

          {aberta === index && (
            <div className="faq-resposta">{item.resposta}</div>
          )}
        </div>
      ))}
    </main>

    <section className="caixa-duvidas">
  <h3>Não encontrou sua dúvida?</h3>
  <p>Envie sua pergunta para nossa equipe:</p>

  <textarea
    value={novaPergunta}
    onChange={(e) => setNovaPergunta(e.target.value)}
    placeholder="Digite sua dúvida aqui..."
  />

  <button onClick={enviarPergunta}>Enviar dúvida</button>

  <div className="lista-duvidas">
    {listaPerguntas.map((p, index) => (
      <p key={index}>{p.texto}</p>
    ))}
  </div>
</section>

    </>
  );
}
