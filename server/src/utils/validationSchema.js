import * as yup from "yup";

export const newUserSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email or password")
    .required("Email is required"),
  password: yup.string().required("Invalid email or password"),
});

export const serviceValidator = yup.object().shape({
  name: yup.string().required("Name is required"),
  duration: yup
    .number()
    .required("Duration is required")
    .positive("Duration must be greater than 0"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be greater than 0"),
  shortcut: yup.string().required("Shortcut is required"),
});

export const barberValidator = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\d{9}$/, "Phone number must be exactly 9 digits")
    .transform((value) => (value ? value.replace(/\D/g, "") : null)),
});

export async function yupValidate(schema, data) {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (error) {
    throw { name: "ValidationError", errors: error.inner };
  }
}
