import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { updateAdminOrderStatus } from "../api/adminApi";
import { getOrderDetail } from "@/features/account/api/accountApi";
import "../styles/AdminPedidoPage.css";

const TRANSICOES = {
  pendente: ["confirmado", "cancelado"],
  confirmado: ["em_uso", "cancelado"],
  em_uso: ["devolvido", "atrasado"],
  atrasado: ["devolvido"],
  devolvido: ["finalizado"],
  finalizado: [],
  cancelado: [],
};

export default function AdminOrderStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [statusAtual, setStatusAtual] = useState("pendente");

  const [novoStatus, setNovoStatus] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let active = true;

    async function carregarPedido() {
      try {
        const response = await getOrderDetail(id);
        if (active && response.data?.status) {
          setStatusAtual(response.data.status);
        }
      } catch (error) {
        if (active) setErro(error.message || "Não foi possível carregar o pedido.");
      }
    }

    carregarPedido();

    return () => {
      active = false;
    };
  }, [id]);

  async function atualizarStatus() {
    try {
      setLoading(true);
      setErro("");
      setSucesso("");

      const response = await updateAdminOrderStatus(id, {
        novo_status: novoStatus,
        observacao,
      });

      setStatusAtual(response.data?.status || novoStatus);
      setNovoStatus("");

      setSucesso(
        `Status atualizado para "${novoStatus}" com sucesso!`
      );

      setTimeout(() => {
        navigate("/admin/pedidos");
      }, 1500);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Hero
        title="Atualizar Status"
        subtitle={`Pedido #${id}`}
      />

      <div className="admin-status-page">
        <div className="status-card">
          <div className="campo">
            <label>Status Atual</label>

            <div className="status-atual">
              {statusAtual}
            </div>
          </div>

          <div className="campo">
            <label>Novo Status</label>

            <select
              value={novoStatus}
              onChange={(e) =>
                setNovoStatus(e.target.value)
              }
            >
              <option value="">
                Selecione um status
              </option>

              {TRANSICOES[statusAtual]?.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

            {TRANSICOES[statusAtual]?.length === 0 && (
              <small className="sem-transicao">
                Este pedido não possui mais
                transições disponíveis.
              </small>
            )}
          </div>

          <div className="campo">
            <label>Observação</label>

            <textarea
              rows="4"
              value={observacao}
              onChange={(e) =>
                setObservacao(e.target.value)
              }
              placeholder="Ex.: Confirmado via WhatsApp"
            />
          </div>

          {erro && (
            <div className="mensagem erro">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="mensagem sucesso">
              {sucesso}
            </div>
          )}

          <div className="acoes">
            <button
              className="btn-voltar"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>

            <button
              className="btn-salvar"
              type="button"
              onClick={atualizarStatus}
              disabled={
                !novoStatus ||
                loading ||
                TRANSICOES[statusAtual]?.length === 0
              }
            >
              {loading
                ? "Atualizando..."
                : "Atualizar Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
