import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Hero from "@/shared/components/Hero";
import { getCategories, getProductById } from "@/features/products/api/productsApi";
import { notifyError, notifySuccess } from "@/shared/utils/toastUtils";
import AdminSectionTabs from "../components/AdminSectionTabs";
import ProductForm from "../components/ProductForm";
import { createAdminCategory, createAdminProduct, deleteAdminProduct, updateAdminProduct, updateAdminProductStatus, uploadAdminProductImage } from "../api/adminApi";
import "../styles/AdminProductsPage.css";

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [categoriesResponse, productResponse] = await Promise.all([
          getCategories(),
          isEditing ? getProductById(id) : Promise.resolve(null),
        ]);

        if (!active) return;

        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);
        setProduct(productResponse);
      } catch (err) {
        if (active) {
          const message = err.message || "Nao foi possivel carregar o formulario do produto.";
          setError(message);
          notifyError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  async function handleSubmit(payload) {
    setSaving(true);
    try {
      if (isEditing) {
        await updateAdminProduct(id, payload);
        notifySuccess("Produto atualizado com sucesso.");
      } else {
        await createAdminProduct(payload);
        notifySuccess("Produto criado com sucesso.");
      }

      navigate("/admin/produtos");
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateCategory(payload) {
    const category = await createAdminCategory(payload);

    setCategories((current) => {
      const next = [...current, category];
      next.sort((a, b) => a.name.localeCompare(b.name));
      return next;
    });

    notifySuccess("Categoria criada com sucesso.");

    return category;
  }

  async function handleUploadImage(file) {
    return await uploadAdminProductImage(file);
  }

  async function handleToggleStatus() {
    if (!product) {
      return;
    }

    try {
      setChangingStatus(true);
      const updatedProduct = await updateAdminProductStatus(product.id, {
        ativo: !product.is_active,
      });
      setProduct(updatedProduct);
      notifySuccess(`Produto ${product.is_active ? "desativado" : "ativado"} com sucesso.`);
    } catch (err) {
      const message = err.message || "Nao foi possivel atualizar o status do produto.";
      setError(message);
      notifyError(message);
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleDelete() {
    if (!product || !window.confirm("Deseja realmente excluir este produto?")) {
      return;
    }

    try {
      setDeleting(true);
      await deleteAdminProduct(product.id);
      notifySuccess("Produto excluido com sucesso.");
      navigate("/admin/produtos");
    } catch (err) {
      const message = err.message || "Nao foi possivel excluir o produto.";
      setError(message);
      notifyError(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-products-page">
      <div className="admin-container">
        <AdminSectionTabs />
        <Hero
          title={isEditing ? "Edicao de produto" : "Cadastro de produto"}
          subtitle="Cadastre e atualize produtos do catalogo administrativo com as regras ja integradas ao backend."
        />

        <div className="admin-form-shell">
          <div className="admin-form-shell__back">
            <Link to="/admin/produtos">Voltar para produtos</Link>
          </div>

          {loading ? (
            <div className="admin-products-list__empty">Carregando formulario...</div>
          ) : error ? (
            <div className="admin-feedback error">{error}</div>
          ) : (
            <>
              {isEditing ? (
                <div className="admin-product-form__toolbar">
                  <button
                    type="button"
                    className="admin-product-form__status-button"
                    onClick={handleToggleStatus}
                    disabled={changingStatus || deleting || saving}
                  >
                    {changingStatus ? "Atualizando..." : product?.is_active ? "Desativar" : "Ativar"}
                  </button>

                  <button
                    type="button"
                    className="admin-product-form__delete-button"
                    onClick={handleDelete}
                    disabled={deleting || changingStatus || saving}
                  >
                    {deleting ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              ) : null}

              <ProductForm
                categories={categories}
                initialValues={product}
                loading={saving}
                onCreateCategory={handleCreateCategory}
                onUploadImage={handleUploadImage}
                submitLabel={isEditing ? "Salvar alteracoes" : "Salvar produto"}
                onSubmit={handleSubmit}
                title={isEditing ? product?.name || "Editar produto" : "Novo produto"}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
