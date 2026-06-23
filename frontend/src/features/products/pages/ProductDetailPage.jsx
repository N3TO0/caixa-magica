import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import { addDays, getTodayISO } from "@/shared/utils/dateUtils";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { useCart } from "@/features/cart/hooks/useCart";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { checkProductAvailability } from "@/features/checkout/api/availabilityApi";
import { useProductDetail } from "../hooks/useProductDetail";
import "../styles/ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetail(id);

  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState(getTodayISO());
  const [formError, setFormError] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!loading && !error && !product) {
      navigate("/produtos", { replace: true });
    }
  }, [error, loading, navigate, product]);

  const activePricing = product?.pricing?.filter(item => item.is_active) || [];
  const selectedPricing = activePricing.find(item => item.days === Number(days));
  const endDate = useMemo(() => addDays(startDate, days), [days, startDate]);

  useEffect(() => {
    if (activePricing.length > 0 && !selectedPricing) {
      setDays(activePricing[0].days);
    }
  }, [activePricing, selectedPricing]);

  function buildCartItem() {
    return {
      product_id: product.id,
      name: product.name,
      image_url: product.images?.[0]?.url,
      quantity: 1,
      days: Number(days),
      start_date: startDate,
      end_date: endDate,
      price_snapshot: selectedPricing.price,
    };
  }

  async function validateAvailability() {
    const response = await checkProductAvailability(product.id, {
      startDate,
      endDate,
    });

    if (!response.data?.disponivel) {
      setFormError("Produto indisponível para o período selecionado.");
      return false;
    }

    return true;
  }

  async function handleAddToCart() {
    setFormError("");

    if (!startDate) {
      setFormError("Escolha a data inicial do aluguel.");
      return false;
    }

    if (!selectedPricing) {
      setFormError("Este produto não possui preço ativo para o prazo selecionado.");
      return false;
    }

    try {
      setCheckingAvailability(true);

      if (!(await validateAvailability())) {
        return false;
      }

      addToCart(buildCartItem());
      return true;
    } catch (err) {
      setFormError(err.message || "Não foi possível verificar a disponibilidade.");
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  }

  async function handleRentNow() {
    if (await handleAddToCart()) {
      navigate("/checkout");
    }
  }

  if (loading) return <LoadingState message="Carregando produto..." />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!product) return null;

  return (
    <>
    <Hero title={product.name} subtitle="Escolha o prazo ideal e adicione o item ao seu carrinho." />
    <main className="produto-page">

      <div className="produto-topo">

        <div className="galeria">
          <img src={product.images?.[0]?.url || "https://via.placeholder.com/600x400?text=Caixa+Magica"} alt={product.name} />
        </div>

        <div className="info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="avaliacao">
            {product.categories?.map(category => category.name).join(" • ") || product.age_range}
          </div>

          <label className="rental-field">
            Data inicial
            <input
              type="date"
              min={getTodayISO()}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <div className="planos">
            {activePricing.map(price => (
              <button 
                key={price.id}
                className={Number(days) === price.days ? "ativo" : ""}
                onClick={() => setDays(price.days)}
              >
                {price.days} dias
              </button>
            ))}
          </div>

          <div className="rental-summary">
            <span>Devolução prevista</span>
            <strong>{endDate}</strong>
          </div>

          <h2>{formatCurrency(selectedPricing?.price)}</h2>
          {formError && <p className="produto-form-error">{formError}</p>}

          <div className="acoes">
            <button onClick={handleAddToCart} disabled={checkingAvailability}>
              {checkingAvailability ? "Verificando..." : "Carrinho"}
            </button>
            <button onClick={() => toggleFavorite(product)}>Favorito</button>
            <button onClick={handleRentNow} disabled={checkingAvailability}>Alugar</button>
          </div>

        </div>
      </div>

    </main>
    </>
  );
}

export default ProductDetailPage;
