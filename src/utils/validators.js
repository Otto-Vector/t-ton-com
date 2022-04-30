export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
/////////////////////////////////////////////////////////////////////////////////
export const required = (value) => (value ? undefined : "Обязательное поле")

const maxLength = (max) => (value) => ((value.length > max) ? `Больше ${max} символов!` : undefined);
const minLength = (min) => (value) => ((value.length <= min) ? `Меньше ${min} символов!` : undefined);

export const maxLength50 = maxLength(50)
export const maxLength11 = minLength(11)

export const mustBeNumber = (value) => (isNaN(value) ? "Только цифры" : undefined);


