import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Hero from "@/shared/components/Hero";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { schema } from "./schema";
import { apiMockUpdateAccount } from "./apiMock";

import "../styles/EditAccountPage.css";

export default function EditAccountPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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

      child_name: user?.child_name || "",
      child_birthdate: user?.child_birthdate || "",

      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    try {
      setLoading(true);
      setSuccess("");

      await apiMockUpdateAccount({
        ...data,
        profile_photo: preview,
      });

      setSuccess("Cadastro atualizado com sucesso!");

      setTimeout(() => {
        navigate("/minha-conta");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cadastro.");
    } finally {
      setLoading(false);
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
              <h2>Dados da Criança (Opcional)</h2>

              <div className="grid">

                <Field
                  label="Nome da Criança"
                  error={errors.child_name}
                >
                  <input
                    {...register("child_name")}
                    placeholder="Nome da criança"
                  />
                </Field>

                <Field
                  label="Data de Nascimento"
                  error={errors.child_birthdate}
                >
                  <input
                    type="date"
                    {...register("child_birthdate")}
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

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="form-actions">
  <button
    type="button"
    className="cancel-button"
    onClick={() => navigate("/minha-conta")}
    disabled={loading}
  >
    Cancelar
  </button>

  <button
    type="submit"
    className="save-button"
    disabled={loading}
  >
    {loading
      ? "Salvando alterações..."
      : "Salvar Alterações"}
  </button>
</div>
          </form>

        </div>
      </section>
    </>
  );
}

