import "./Hero.css";

export default function Hero({ title, subtitle, tag = "Caixa Mágica" }) {
  return (
    <section className="hero">
      <div className="hero-decoration hero-star">★</div>
      <div className="hero-decoration hero-plane">➤</div>
      <div className="hero-decoration hero-heart">♡</div>
      <div className="hero-box">
        <span className="hero-tag">{tag}</span>
        <h1>{title}</h1>
        {subtitle && <p className="slogan">{subtitle}</p>}
      </div>
    </section>
  );
}
