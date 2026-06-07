import * as yup from "yup";

export const schema = yup.object({
  customer_name: yup
    .string()
    .trim()
    .min(3, "Digite seu nome completo")
    .max(120, "Máximo de 120 caracteres")
    .required("Nome obrigatório"),

  customer_cpf: yup
    .string()
    .matches(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "Use o formato 000.000.000-00"
    )
    .required("CPF obrigatório"),

  customer_email: yup
    .string()
    .email("Digite um e-mail válido")
    .required("E-mail obrigatório"),

  customer_phone: yup
    .string()
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Use o formato (11) 99999-9999"
    )
    .required("Telefone obrigatório"),

  customer_birthdate: yup
  .date()
  .transform((value, originalValue) => {
    return originalValue === "" ? null : value;
  })
  .nullable()
  .typeError("Data de nascimento obrigatória")
  .required("Data de nascimento obrigatória")
  .max(new Date(), "Data inválida"),

  child_name: yup
    .string()
    .nullable()
    .transform((value) => value || ""),

  child_birthdate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr)),

  zip_code: yup
    .string()
    .matches(
      /^\d{5}-\d{3}$/,
      "Use o formato 00000-000"
    )
    .required("CEP obrigatório"),

  street: yup
    .string()
    .max(120, "Máximo 120 caracteres")
    .required("Rua obrigatória"),

  number: yup
    .string()
    .max(20, "Número inválido")
    .required("Número obrigatório"),

  neighborhood: yup
    .string()
    .max(100)
    .required("Bairro obrigatório"),

  city: yup
    .string()
    .max(100)
    .required("Cidade obrigatória"),

  state: yup
    .string()
    .max(2, "Use a sigla do estado")
    .required("Estado obrigatório"),

  password: yup
    .string()
    .test(
      "password-validation",
      "A senha deve possuir no mínimo 8 caracteres",
      (value) => !value || value.length >= 8
    ),

  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), ""],
      "As senhas não coincidem"
    ),
});