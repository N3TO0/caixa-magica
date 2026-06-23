import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Hero from "@/shared/components/Hero";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { updateProfile } from "../api/accountApi";

import { schema } from "../schemas/accountSchema";

import "../styles/EditAccountPage.css";

export default function EditAccountPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [preview, setPreview] = useState(
    user?.profile_photo || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",

    defaultValues: {
      customer_name: user?.customer_name || "",
      customer_cpf: user?.customer_cpf || "",
      customer_email: user?.customer_email || "",
      customer_phone: user?.customer_phone || "",
      customer_birthdate: user?.customer_birthdate || "",

      zip_code: user?.zip_code || "",
      street: user?.street || "",
      number: user?.number || "",
      neighborhood: user?.neighborhood || "",
      city: user?.city || "",
      state: user?.state || "",

      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData) {
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        name: formData.customer_name,
        email: formData.customer_email,
        phone: formData.customer_phone,
        cpf: formData.customer_cpf,
        birthdate: formData.customer_birthdate || null,
        ...(formData.password ? { password: formData.password } : {}),
        zip_code: formData.zip_code,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      };

      await updateProfile(payload);
      await refreshUser();
      navigate("/minha-conta");
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  const Field = ({ label, error, children }) => (
    <div className="field">
      <label>{label}</label>

      {children}

      {error?.message && (
        <span className="error">
          {error.message}
        </span>
      )}
    </div>
  );

  return (
    <>
      <Hero
        title="Editar Cadastro"
        subtitle="Mantenha seus dados sempre atualizados."
      />

      <section className="edit-account-page">
        <div className="edit-account-card">

          <form onSubmit={handleSubmit(onSubmit)}>

            <section className="form-section">
              <h2>Foto de Perfil</h2>

              <div className="profile-upload">

                <div className="profile-preview">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Perfil"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      Sem Foto
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Dados Pessoais</h2>

              <div className="grid">

                <Field
                  label="Nome Completo"
                  error={errors.customer_name}
                >
                  <input
                    {...register("customer_name")}
                    placeholder="Digite seu nome completo"
                    maxLength={120}
                  />
                </Field>

                <Field
                  label="CPF"
                  error={errors.customer_cpf}
                >
                   <input
    {...register("customer_cpf")}
    placeholder="000.000.000-00"
    maxLength={14}
  />

                </Field>

                <Field
                  label="E-mail"
                  error={errors.customer_email}
                >
                  <input
                    type="email"
                    {...register("customer_email")}
                    placeholder="cliente@email.com"
                  />
                </Field>

                <Field
                  label="Telefone"
                  error={errors.customer_phone}
                >
                  <input
    {...register("customer_phone")}
    placeholder="(11) 99999-9999"
    maxLength={15}
  />
                </Field>

                <Field
                  label="Data de Nascimento"
                  error={errors.customer_birthdate}
                >
                  <input
                    type="date"
                    {...register("customer_birthdate")}
                  />
                </Field>

              </div>
            </section>

            <section className="form-section">
              <h2>Endereço</h2>

              <div className="grid">

                <Field
                  label="CEP"
                  error={errors.zip_code}
                >
                  <input
    {...register("zip_code")}
    placeholder="00000-000"
    maxLength={9}
  />
                </Field>

                <Field
                  label="Rua"
                  error={errors.street}
                >
                  <input
                    {...register("street")}
                    placeholder="Rua ou Avenida"
                  />
                </Field>

                <Field
                  label="Número"
                  error={errors.number}
                >
                  <input
                    {...register("number")}
                    placeholder="123"
                  />
                </Field>

                <Field
                  label="Bairro"
                  error={errors.neighborhood}
                >
                  <input
                    {...register("neighborhood")}
                    placeholder="Seu bairro"
                  />
                </Field>

                <Field
                  label="Cidade"
                  error={errors.city}
                >
                  <input
                    {...register("city")}
                    placeholder="Sua cidade"
                  />
                </Field>

                <Field
                  label="Estado"
                  error={errors.state}
                >
                  <input
                    {...register("state")}
                    placeholder="BA"
                    maxLength={2}
                  />
                </Field>

              </div>
            </section>

            <section className="form-section">
              <h2>Segurança</h2>

              <div className="grid">

                <Field
                  label="Nova Senha"
                  error={errors.password}
                >
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Mínimo 8 caracteres"
                  />
                </Field>

                <Field
                  label="Confirmar Senha"
                  error={errors.confirmPassword}
                >
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Repita a senha"
                  />
                </Field>

              </div>
            </section>

            {feedback && (
              <div className={`feedback ${feedback.type}`}>
                {feedback.message}
              </div>
            )}

            <div className="form-actions">
  <button
    type="button"
    className="cancel-button"
    onClick={() => navigate("/minha-conta")}
  >
    Cancelar
  </button>

  <button
    type="submit"
    className="save-button"
    disabled={saving}
  >
    {saving ? "Salvando..." : "Salvar Alterações"}
  </button>
</div>
          </form>

        </div>
      </section>
    </>
  );
}

