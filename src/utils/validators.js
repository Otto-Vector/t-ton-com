import {parseAllNumbers} from './parsers';

export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
/////////////////////////////////////////////////////////////////////////////////
export const required = (value) => (value ? undefined : "Обязательное поле")

export const mustBeNumber = (value) => (isNaN(value) ? "Только цифры" : undefined);
export const maxLength = (max) => (value) => ((value.length > max) ? `Больше ${max} символов!` : undefined);
export const minLength = (min) => (value) => ((value.length <= min) ? `Меньше ${min} символов!` : undefined);
export const mustBe00Numbers = (to) => (value) => ((parseAllNumbers(value).length !== to) ? `Должно быть ${to} цифр!` : undefined);
export const mustBe0_0Numbers = (from) => (to) => (value) => (
  (parseAllNumbers(value).length !== from && parseAllNumbers(value).length !== to) ? `Должно быть ${from} или ${to} цифр!` : undefined);
export const mustBeMail = (value) => value ? value.match(/^\S+@\S+\.\S+$/) ? undefined : 'Введите email корректно' : undefined

