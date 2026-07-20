import * as yup from "yup";

function optionalTrimmedString(max, message) {
  let validator = yup
    .string()
    .transform((value) => {
      if (typeof value !== "string") return value;

      const trimmed = value.trim();
      return trimmed === "" ? "" : trimmed;
    });

  if (max) {
    validator = validator.max(max, message);
  }

  return validator.notRequired();
}

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

  profile_photo: yup
    .string()
    .nullable(),

  zip_code: yup
    .string()
    .test(
      "zip-code-format",
      "Use o formato 00000-000",
      (value) => !value || /^\d{5}-\d{3}$/.test(value)
    )
    .notRequired(),

  street: optionalTrimmedString(120, "Máximo 120 caracteres"),

  number: optionalTrimmedString(20, "Número inválido"),

  complement: optionalTrimmedString(100, "Máximo 100 caracteres"),

  neighborhood: optionalTrimmedString(100, "Máximo 100 caracteres"),

  city: optionalTrimmedString(100, "Máximo 100 caracteres"),

  state: yup
    .string()
    .transform((value) => {
      if (typeof value !== "string") return value;

      const trimmed = value.trim().toUpperCase();
      return trimmed === "" ? "" : trimmed;
    })
    .max(2, "Use a sigla do estado")
    .notRequired(),

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
