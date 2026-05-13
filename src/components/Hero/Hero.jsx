import "./Hero.css";

export default function Hero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="hero-box">
        <h1>{title}</h1>
        <p className="slogan">{subtitle}</p>
      </div>
    </section>
  );
}