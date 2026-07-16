import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Hero from "@/shared/components/Hero";
import LoadingState from "@/shared/components/LoadingState";
import { formatAvailableUnits } from "@/shared/utils/availabilityUtils";
import { addDays, getTodayISO } from "@/shared/utils/dateUtils";
import { formatCurrency } from "@/shared/utils/moneyUtils";
import { useCart } from "@/features/cart/hooks/useCart";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useSaleCart } from "@/features/saleCart/hooks/useSaleCart";
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
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState(null);

  const { addToCart } = useCart();
  const { addSaleItem } = useSaleCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!loading && !error && !product) {
      navigate("/produtos", { replace: true });
    }
  }, [error, loading, navigate, product]);

  const activePricing = product?.pricing?.filter((item) => item.is_active) || [];
  const selectedPricing = activePricing.find((item) => item.days === Number(days));
  const endDate = useMemo(() => addDays(startDate, days), [days, startDate]);
  const categoryLabel = product?.categories?.map((category) => category.name).join(" • ") || product?.age_range;
  const favoriteActive = product ? isFavorite(product.id) : false;
  const isSale = product?.type === "sale";

  useEffect(() => {
    if (activePricing.length > 0 && !selectedPricing) {
      setDays(activePricing[0].days);
    }
  }, [activePricing, selectedPricing]);

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      if (!product || isSale || !startDate || !endDate) {
        return;
      }

      try {
        if (active) {
          setAvailabilityLoading(true);
        }

        const response = await checkProductAvailability(product.id, {
          startDate,
          endDate,
        });

        if (active) {
          setAvailabilityInfo(response.data || null);
        }
      } catch {
        if (active) {
          setAvailabilityInfo(null);
        }
      } finally {
        if (active) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      active = false;
    };
  }, [endDate, isSale, product, startDate]);

  const availabilityLabel = useMemo(() => {
    if (availabilityLoading) {
      return "Verificando disponibilidade para o periodo selecionado...";
    }

    if (isSale) {
      return "Produto disponivel para venda";
    }

    if (!availabilityInfo) {
      return `${formatAvailableUnits(product?.available_units)} para hoje`;
    }

    if (!availabilityInfo.disponivel) {
      return "Indisponivel para o periodo selecionado";
    }

    const units = Number(availabilityInfo.unidades_livres || 0);
    return `${units} ${units === 1 ? "unidade livre" : "unidades livres"} para este periodo`;
  }, [availabilityInfo, availabilityLoading, isSale, product?.available_units]);

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

    setAvailabilityInfo(response.data || null);

    if (!response.data?.disponivel) {
      setFormError("Produto indisponivel para o periodo selecionado. Escolha outra data ou outro prazo.");
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

    if (isSale) {
      setFormError("Produtos de venda nao usam o fluxo de aluguel.");
      return false;
    }

    if (!selectedPricing) {
      setFormError("Este produto nao possui preco ativo para o prazo selecionado.");
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
      setFormError(err.message || "Nao foi possivel verificar a disponibilidade.");
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

  function handleBuyNow() {
    addSaleItem({
      product_id: product.id,
      name: product.name,
      image_url: product.images?.[0]?.url,
      quantity: 1,
      sale_price: Number(product.sale_price || 0),
      type: "sale",
    });
    navigate("/checkout-compra");
  }

  if (loading) return <LoadingState message="Carregando produto..." />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!product) return null;

  return (
    <>
      <Hero title={product.name} subtitle={isSale ? "Confira os detalhes e o valor de venda deste produto." : "Escolha o prazo ideal e adicione o item ao seu carrinho."} />
      <main className="produto-page">
        <div className="produto-topo">
          <div className="galeria">
            <img src={product.images?.[0]?.url || "https://via.placeholder.com/600x400?text=Caixa+Magica"} alt={product.name} />
          </div>

          <div className="info">
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <div className="avaliacao">{categoryLabel}</div>

            <div className="produto-disponibilidade-detalhe">{availabilityLabel}</div>

            {!isSale ? (
            <div className="produto-locacao-layout">
              <div className="produto-locacao-config">
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
                  {activePricing.map((price) => (
                    <button
                      key={price.id}
                      type="button"
                      className={Number(days) === price.days ? "ativo" : ""}
                      onClick={() => setDays(price.days)}
                    >
                      {price.days} dias
                    </button>
                  ))}
                </div>
              </div>

              <div className="produto-resumo-locacao">
                <p className="produto-resumo-locacao__eyebrow">Resumo da locacao</p>

                <div className="produto-resumo-locacao__grid">
                  <div>
                    <span>Prazo</span>
                    <strong>{days} dias</strong>
                  </div>
                  <div>
                    <span>Data inicial</span>
                    <strong>{startDate}</strong>
                  </div>
                  <div>
                    <span>Devolucao prevista</span>
                    <strong>{endDate}</strong>
                  </div>
                  <div>
                    <span>Disponibilidade</span>
                    <strong>{availabilityLabel}</strong>
                  </div>
                </div>

                <div className="produto-resumo-locacao__price">
                  <span>Valor do periodo</span>
                  <h2>{formatCurrency(selectedPricing?.price)}</h2>
                </div>
              </div>
            </div>
            ) : (
              <div className="produto-resumo-locacao produto-resumo-locacao--sale">
                <p className="produto-resumo-locacao__eyebrow">Resumo da venda</p>
                <div className="produto-resumo-locacao__grid produto-resumo-locacao__grid--single">
                  <div>
                    <span>Disponibilidade</span>
                    <strong>{availabilityLabel}</strong>
                  </div>
                  <div>
                    <span>Valor unico</span>
                    <strong>{formatCurrency(Number(product.sale_price || 0))}</strong>
                  </div>
                </div>
              </div>
            )}

            {formError && <p className="produto-form-error">{formError}</p>}

            <div className="acoes">
              {!isSale ? (
                <>
                  <button
                    type="button"
                    className="acoes__primaria"
                    onClick={handleAddToCart}
                    disabled={checkingAvailability || availabilityLoading || availabilityInfo?.disponivel === false}
                  >
                    {checkingAvailability ? "Verificando..." : "Adicionar ao carrinho"}
                  </button>
                  <button
                    type="button"
                    className="acoes__secundaria"
                    onClick={handleRentNow}
                    disabled={checkingAvailability || availabilityLoading || availabilityInfo?.disponivel === false}
                  >
                    Alugar agora
                  </button>
                </>
              ) : (
                <button type="button" className="acoes__primaria" onClick={handleBuyNow}>
                  Comprar
                </button>
              )}
              <button
                type="button"
                className={`acoes__terciaria${favoriteActive ? " acoes__terciaria--active" : ""}`}
                onClick={() => toggleFavorite(product)}
              >
                {favoriteActive ? "Favoritado" : "Favoritar"}
              </button>
            </div>

            <div className="produto-apoio">
              <span>Retirada na loja ou entrega sob consulta.</span>
              <span>A confirmacao final acontece apos a analise do pedido pela equipe.</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductDetailPage;
