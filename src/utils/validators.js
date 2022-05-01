export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
/////////////////////////////////////////////////////////////////////////////////
export const required = (value) => (value ? undefined : "Обязательное поле")

const maxLength = (max) => (value) => ((value.length > max) ? `Больше ${max} символов!` : undefined);
const minLength = (min) => (value) => ((value.length <= min) ? `Меньше ${min} символов!` : undefined);
export const mustBe00Numbers = (to) => (value) => ((value.replace(/[^0-9]/g,'').length !== to) ? `Должно быть ${to} цифр!` : undefined);

export const maxLength50 = maxLength(50)
export const minLength11 = minLength(11)
export const mustBe12Numbers = mustBe00Numbers(12)
export const mustBe9Numbers = mustBe00Numbers(12)
export const mustBe13Numbers = mustBe00Numbers(12)
export const mustBe20Numbers = mustBe00Numbers(12)

export const mustBeNumber = (value) => (isNaN(value) ? "Только цифры" : undefined);