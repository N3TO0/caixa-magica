import "./ComoAlugar.css";
import Hero from "../components/Hero/Hero";
import {
  FaUserPlus,
  FaShoppingCart,
  FaEnvelopeOpenText,
  FaMoneyBillWave,
  FaTruck,
  FaUndoAlt,
  FaSyncAlt
} from "react-icons/fa";

export default function ComoAlugar() {
  const etapas = [
    {
      titulo: "FAÇA O SEU CADASTRO NO SITE",
      texto:
        "É simples e rápido, ao concluir o seu cadastro você fica por dentro das novidades em primeira mão.",
      icon: <FaUserPlus />
    },
    {
      titulo: "REALIZE O SEU PEDIDO",
      texto:
        "Acesse o seu login e escolha o produto que deseja. Pode optar pela retirada na loja ou receber em casa com a contratação do nosso motorista.",
      icon: <FaShoppingCart />
    },
    {
      titulo: "RECEBA A CONFIRMAÇÃO",
      texto:
        "Após concluir o pedido um email automático é enviado com o número do seu atendimento. Em seguida, fazemos contato através do seu número de celular ou email para informar sobre a retirada do item ou agendamento da entrega.",
      icon: <FaEnvelopeOpenText />
    },
    {
      titulo: "EFETUE O PAGAMENTO",
      texto:
        "Nas retiradas em loja o pagamento é presencial no ato, optando pela entrega/envio é necessário o pagamento antecipado do valor integral via link ou PIX.",
      icon: <FaMoneyBillWave />
    },
    {
      titulo: "DIA DA ENTREGA",
      texto:
        "Quando chegar na loja seu pedido já estará separado aguardando a vistoria e daremos orientações quanto ao uso. Os pedidos com entrega/envio são feitos conforme data agendada, nosso motorista manterá contato caso seja necessário.",
      icon: <FaTruck />
    },
    {
      titulo: "ENCERRAMENTO DE PRAZO - DEVOLUÇÃO",
      texto:
        "Faltando cerca de 5 dias para o vencimento do seu contrato de aluguel entraremos em contato para perguntar se deseja renovar ou devolver o item.",
      icon: <FaUndoAlt />
    },
    {
      titulo: "RENOVAÇÃO DO CONTRATO",
      texto:
        "O processo de renovação é todo on-line, com instruções enviadas logo após o nosso contato. Você terá até o dia do vencimento do contrato anterior para regularização da nova contratação.",
      icon: <FaSyncAlt />
    }
  ];

  return (
    <>
      <Hero
        title="Como Alugar"
        subtitle="Veja como é simples escolher, receber e renovar seus brinquedos favoritos."
      />

      <main className="como-alugar-container">
        <section>
        <h2 className="section-title">Aluguel simples, seguro e acompanhado de perto.</h2>
      </section> 

        <div className="etapas-grid">
          {etapas.map((etapa, index) => (
            <div className="etapa-card fade-in" key={index}>
              <span className="numero">{index + 1}</span>
              <div className="icone">{etapa.icon}</div>
              <h3>{etapa.titulo.toLowerCase()}</h3>
              <p>{etapa.texto}</p>
            </div>
          ))}
          
  {/* CARD DO BOTÃO */}
  <div className="etapa-card botao-card">
    <h3>Pronto para começar?</h3>
    <button className="btn-alugar">Quero alugar</button>
  </div>
</div>
      </main>
    </>
  );
}
