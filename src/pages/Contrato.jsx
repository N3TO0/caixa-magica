import "./Contrato.css";
import Hero from "../shared/components/Hero";

export default function Contrato() {
  return (
    <>
           {/* HERO */}
          <Hero
            title="Contrato"
            subtitle="Condições de locação organizadas para consulta clara e transparente."
          />
    <main className="contrato-container">

      <section>
        <h2>Do Objetivo do Contrato</h2>

        <p>
          <strong>Cláusula 1ª –</strong> A Caixa Mágica, definida como LOCADOR,
          detentora e responsável pelo site
          https://caixa-magica.lojaintegrada.com.br, e o LOCATÁRIO, identificado
          no cadastro do site, acordam o presente contrato para a locação de
          qualquer item apresentado no site.
        </p>

        <p>
          <strong>Cláusula 2ª –</strong> Todos os produtos disponíveis para
          locação são de propriedade da Caixa Mágica, podendo ser locados por
          períodos de 15 ou 30 dias, com possibilidade de renovação.
        </p>

        <p>
          <strong>Cláusula 3ª –</strong> O usuário e senha são pessoais e não
          devem ser utilizados por terceiros.
        </p>

        <p>
          <strong>Cláusula 4ª –</strong> O LOCATÁRIO afirma a veracidade dos
          dados cadastrados, estando ciente do Art. 299 do Código Penal.
        </p>

        <p className="paragrafo">
          Parágrafo único: O LOCATÁRIO se compromete a manter seus dados
          atualizados.
        </p>

        <p>
          <strong>Cláusula 5ª –</strong> A Caixa Mágica não utilizará os dados
          do LOCATÁRIO para fins diferentes dos descritos neste contrato.
        </p>

        <p>
          <strong>Cláusula 6ª –</strong> Após a finalização do pedido, o
          LOCADOR terá até 3 dias úteis para contato e agendamento da entrega.
        </p>
      </section>

      <section>
        <h2>Do Uso</h2>

        <p>
          <strong>Cláusula 7ª –</strong> O LOCATÁRIO é responsável pelo uso e
          preservação do item alugado até sua devolução.
        </p>

        <p>
          <strong>Cláusula 8ª –</strong> O item deve ser utilizado conforme o
          manual do fabricante.
        </p>

        <p>
          <strong>Cláusula 9ª –</strong> O LOCATÁRIO declara ter recebido todas
          as orientações necessárias para o uso correto do produto.
        </p>

        <p className="paragrafo">
          Parágrafo único: O LOCADOR não se responsabiliza por acidentes ou
          danos ocorridos durante o uso.
        </p>
      </section>

      <section>
        <h2>Em Caso de Danos, Perda ou Roubo</h2>

        <p>
          <strong>Cláusula 12ª –</strong> Em caso de dano irreversível, perda
          ou roubo, o LOCATÁRIO deverá pagar 80% do valor do item.
        </p>

        <p>
          <strong>Cláusula 14ª –</strong> Em danos que não inviabilizem o uso,
          mas impeçam nova locação, o valor será de 50% do item.
        </p>
      </section>

      <section>
        <h2>Da Devolução</h2>

        <p>
          <strong>Cláusula 15ª –</strong> A devolução do item é obrigação do
          LOCATÁRIO.
        </p>

        <p>
          <strong>Cláusula 16ª –</strong> O LOCADOR poderá buscar o item por
          taxa de R$ 20,00 dentro de Aracaju.
        </p>

        <p>
          <strong>Cláusula 20ª –</strong> A não devolução na data prevista
          implicará cobrança de dias adicionais e multa.
        </p>
      </section>

      <section>
        <h2>Disposições Finais</h2>

        <p>
          <strong>Cláusula 24ª –</strong> O envio de fotos autoriza o uso de
          imagem para divulgação.
        </p>

        <p>
          <strong>Cláusula 26ª –</strong> O LOCADOR poderá alterar este
          contrato a qualquer tempo.
        </p>

        <p>
          <strong>Cláusula 27ª –</strong> Fica eleito o foro da comarca de
          Aracaju/SE.
        </p>
      </section>
    </main>
     </>
  );
}
