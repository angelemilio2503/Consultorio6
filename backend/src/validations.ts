import Joi from "joi";

// Validación para registro de usuario
export const registerValidation = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  usuario: Joi.string().alphanum().min(3).max(50).required(),
  contrasena: Joi.string().min(6).max(30).required(),
  rol: Joi.string().valid("Admin", "Doctor").required(),
});

// Validación para iniciar sesión
export const loginValidation = Joi.object({
  usuario: Joi.string().required(),
  contrasena: Joi.string().required(),
  rol: Joi.string().valid("Admin", "Doctor").required(),
});
