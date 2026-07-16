import { useEffect, useMemo, useState } from "react";
import { notifyError } from "@/shared/utils/toastUtils";

const PRICING_DAYS = [7, 15, 30];

const PRODUCT_TYPES = [
  { value: "rental", label: "Locacao" },
  { value: "sale", label: "Venda" },
  { value: "kit", label: "Kit" },
  { value: "gift", label: "Vale presente" },
];

const AGE_RANGE_OPTIONS = [
  "0 - 6 meses",
  "6 - 12 meses",
  "1 - 2 anos",
  "2 - 4 anos",
  "4+ anos",
];

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildInitialState(initialValues) {
  return {
    name: initialValues?.name || "",
    slug: initialValues?.slug || "",
    description: initialValues?.description || "",
    image_url: initialValues?.images?.[0]?.url || "",
    image_file: null,
    type: initialValues?.type || "rental",
    age_range: initialValues?.age_range || "",
    total_units: String(initialValues?.total_units || 1),
    sale_price: initialValues?.sale_price?.toString() || "",
    rental_rules: initialValues?.rental_rules || "",
    is_featured: Boolean(initialValues?.is_featured),
    category_id: initialValues?.categories?.[0]?.id ? String(initialValues.categories[0].id) : "",
    pricing_7: initialValues?.pricing?.find((item) => item.days === 7)?.price?.toString() || "",
    pricing_15: initialValues?.pricing?.find((item) => item.days === 15)?.price?.toString() || "",
    pricing_30: initialValues?.pricing?.find((item) => item.days === 30)?.price?.toString() || "",
  };
}

function buildCategoryState() {
  return {
    name: "",
    slug: "",
  };
}

export default function ProductForm({
  categories,
  initialValues,
  loading,
  onCreateCategory,
  onUploadImage,
  submitLabel,
  onSubmit,
  title,
}) {
  const [form, setForm] = useState(() => buildInitialState(initialValues));
  const [categoryForm, setCategoryForm] = useState(() => buildCategoryState());
  const [categoryError, setCategoryError] = useState("");
  const [showCategoryCreator, setShowCategoryCreator] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(buildInitialState(initialValues));
  }, [initialValues]);

  const previewSlug = useMemo(
    () => form.slug.trim() || slugify(form.name),
    [form.name, form.slug]
  );

  const previewCategorySlug = useMemo(
    () => categoryForm.slug.trim() || slugify(categoryForm.name),
    [categoryForm.name, categoryForm.slug]
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageFileChange(event) {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      image_file: file,
      image_url: file ? URL.createObjectURL(file) : prev.image_url,
    }));
  }

  function updateCategoryField(field, value) {
    setCategoryForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleToggleCategoryCreator() {
    setShowCategoryCreator((current) => !current);
    setCategoryError("");
    setCategoryForm(buildCategoryState());
  }

  async function handleCreateCategory(event) {
    event.preventDefault();

    if (!onCreateCategory) {
      return;
    }

    setCategoryError("");

    const name = categoryForm.name.trim();
    const slug = previewCategorySlug;

    if (!name) {
      setCategoryError("Informe o nome da categoria.");
      return;
    }

    if (!slug) {
      setCategoryError("Nao foi possivel gerar o slug da categoria.");
      return;
    }

    setCreatingCategory(true);

    try {
      const createdCategory = await onCreateCategory({
        name,
        slug,
        description: null,
        parent_id: null,
        is_active: true,
      });

      updateField("category_id", String(createdCategory.id));
      setCategoryForm(buildCategoryState());
      setShowCategoryCreator(false);
    } catch (err) {
      const message = err.message || "Nao foi possivel criar a categoria.";
      setCategoryError(message);
      notifyError(message);
    } finally {
      setCreatingCategory(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.category_id) {
      setError("Selecione uma categoria para o produto.");
      return;
    }

    const isSale = form.type === "sale";
    const pricing = isSale
      ? []
      : PRICING_DAYS.map((days) => ({
          days,
          price: Number(String(form[`pricing_${days}`]).replace(",", ".")),
        }));

    if (!isSale && pricing.some((item) => Number.isNaN(item.price) || item.price <= 0)) {
      setError("Preencha os precos de 7, 15 e 30 dias com valores validos.");
      return;
    }

    const salePrice = Number(String(form.sale_price).replace(",", "."));
    if (isSale && (Number.isNaN(salePrice) || salePrice <= 0)) {
      setError("Informe um valor unico de venda valido.");
      return;
    }

    try {
      let imageUrl = form.image_url.trim();

      if (form.image_file && onUploadImage) {
        const uploadResponse = await onUploadImage(form.image_file);
        imageUrl = uploadResponse.url;
      }

      await onSubmit({
        name: form.name.trim(),
        slug: previewSlug,
        description: form.description.trim() || null,
        images: imageUrl
          ? [{ url: imageUrl, display_order: 0 }]
          : [],
        type: form.type,
        age_range: form.age_range || null,
        total_units: Number(form.total_units),
        sale_price: isSale ? salePrice : null,
        rental_rules: form.rental_rules.trim() || null,
        is_featured: form.is_featured,
        categories: [Number(form.category_id)],
        pricing,
      });
    } catch (err) {
      const message = err.message || "Nao foi possivel salvar o produto.";
      setError(message);
      notifyError(message);
    }
  }

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="admin-product-form__header">
        <div>
          <p className="admin-product-form__eyebrow">Caixa Magica</p>
          <h2>{title}</h2>
        </div>
        <div className="admin-product-form__slug">Slug: <strong>{previewSlug || "-"}</strong></div>
      </div>

      <div className="admin-product-form__grid">
        <label>
          Nome do produto
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </label>

        <label>
          Slug
          <input
            type="text"
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="Gerado automaticamente se vazio"
          />
        </label>

        <label>
          Foto do produto
          <input
            type="url"
            value={form.image_url}
            onChange={(event) => updateField("image_url", event.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </label>

        <label>
          Selecionar imagem do dispositivo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
        </label>

        <label>
          Tipo
          <select
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
          >
            {PRODUCT_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Faixa etaria
          <select
            value={form.age_range}
            onChange={(event) => updateField("age_range", event.target.value)}
          >
            <option value="">Selecione</option>
            {AGE_RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label>
            Categoria
            <div className="admin-product-form__category-row">
              <select
                value={form.category_id}
                onChange={(event) => updateField("category_id", event.target.value)}
                required
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="admin-product-form__category-add"
                onClick={handleToggleCategoryCreator}
                aria-label="Criar nova categoria"
                title="Criar nova categoria"
              >
                +
              </button>
            </div>
          </label>

          {showCategoryCreator ? (
            <div className="admin-product-form__category-creator">
              <div className="admin-product-form__category-creator-grid">
                <label>
                  Nome da categoria
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(event) => updateCategoryField("name", event.target.value)}
                    placeholder="Ex.: Brinquedos sensoriais"
                  />
                </label>

                <label>
                  Slug
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(event) => updateCategoryField("slug", event.target.value)}
                    placeholder="Gerado automaticamente se vazio"
                  />
                </label>
              </div>

              <p className="admin-product-form__category-slug">
                Slug da categoria: <strong>{previewCategorySlug || "-"}</strong>
              </p>

              {categoryError ? (
                <p className="admin-product-form__error">{categoryError}</p>
              ) : null}

              <div className="admin-product-form__category-actions">
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                >
                  {creatingCategory ? "Criando..." : "Criar categoria"}
                </button>

                <button
                  type="button"
                  className="admin-product-form__secondary-button"
                  onClick={handleToggleCategoryCreator}
                  disabled={creatingCategory}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <label>
          Estoque
          <input
            type="number"
            min="1"
            value={form.total_units}
            onChange={(event) => updateField("total_units", event.target.value)}
            required
          />
        </label>

        <label className="admin-product-form__full">
          Descricao
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        {form.type === "sale" ? (
          <label>
            Valor de venda
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.sale_price}
              onChange={(event) => updateField("sale_price", event.target.value)}
              required
            />
          </label>
        ) : null}

        {form.image_url.trim() ? (
          <div className="admin-product-form__full admin-product-form__image-preview">
            <span>Previa da foto</span>
            <img src={form.image_url.trim()} alt="Previa do produto" />
          </div>
        ) : null}

        <label className="admin-product-form__full">
          Regras de locacao
          <textarea
            rows="4"
            value={form.rental_rules}
            onChange={(event) => updateField("rental_rules", event.target.value)}
          />
        </label>
      </div>

      {form.type !== "sale" ? (
        <div className="admin-product-form__pricing">
          <h3>Precos por periodo</h3>
          <div className="admin-product-form__pricing-grid">
            {PRICING_DAYS.map((days) => (
              <label key={days}>
                {days} dias
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form[`pricing_${days}`]}
                  onChange={(event) => updateField(`pricing_${days}`, event.target.value)}
                  required
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <label className="admin-product-form__checkbox">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(event) => updateField("is_featured", event.target.checked)}
        />
        Destacar produto na vitrine
      </label>

      {error && <p className="admin-product-form__error">{error}</p>}

      <div className="admin-product-form__actions">
        <button type="submit" className="admin-primary-button" disabled={loading}>
          {loading ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
