import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">caixa mágica</div>
          <p>
            Brinquedos que encantam, histórias que transformam e um futuro que a gente constrói juntos.
          </p>
          <div className="footer-social" aria-label="Redes sociais">
            <a href="https://www.instagram.com/caixamagica_" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/5579998112997" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>CAIXA MÁGICA</h4>
          <Link to="/quem-somos">Quem somos</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/higienizacao">Higienização dos itens</Link>
          <Link to="/privacidade">Política de privacidade e LGPD</Link>
        </div>

        <div className="footer-column">
          <h4>ALUGAR</h4>
          <Link to="/como-alugar">Como alugar</Link>
          <Link to="/duvidas">Perguntas frequentes</Link>
          <Link to="/contrato">Contrato</Link>
        </div>

        <div className="footer-column">
          <h4>ÁREA DO CLIENTE</h4>
          <Link to="/meus-pedidos">Meus pedidos</Link>
          <Link to="/carrinho">Meu carrinho</Link>
          <Link to="/cadastro">Cadastro</Link>
        </div>

        <div className="footer-column">
          <h4>ENDEREÇO</h4>
          <span>Rua Urbano Neto</span>
          <span>Galeria da Pousada do Farol, Loja 04</span>
          <span>Atalaia, Aracaju - SE</span>
          <span>CEP: 49035-190</span>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          Caixa Mágica • CNPJ: 42.257.401/0001-71 •  
          © Todos os direitos reservados • 2025
        </p>
      </div>
    </footer>
  );
}

export default Footer;
