import {parseAllNumbers} from './parsers';

export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
/////////////////////////////////////////////////////////////////////////////////
export const required = (value) => (value ? undefined : "Обязательное поле")

const maxLength = (max) => (value) => ((value.length > max) ? `Больше ${max} символов!` : undefined);
const minLength = (min) => (value) => ((value.length <= min) ? `Меньше ${min} символов!` : undefined);
export const mustBe00Numbers = (to) => (value) => ((parseAllNumbers(value).length !== to) ? `Должно быть ${to} цифр!` : undefined);
export const mustBe0_0Numbers = (from) => (to) => (value) => (
  (parseAllNumbers(value).length !== from && parseAllNumbers(value).length !== to) ? `Должно быть ${from} или ${to} цифр!` : undefined);

export const maxLength50 = maxLength(50)
export const minLength11 = minLength(11)
export const mustBeNumbers = mustBe00Numbers(12)
export const mustBe9Numbers = mustBe00Numbers(12)
export const mustBe13Numbers = mustBe00Numbers(12)
export const mustBe20Numbers = mustBe00Numbers(12)

export const mustBeNumber = (value) => (isNaN(value) ? "Только цифры" : undefined);
