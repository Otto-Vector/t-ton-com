export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);
/////////////////////////////////////////////////////////////////////////////////
export const required = (value) => (value ? undefined : "Required")

const maxLength = (max) => (value) => ((value.length > max) ? `Больше ${max} символов!` : undefined);
const minLength = (min) => (value) => ((value.length <= min) ? `Меньше ${min} symbols!` : undefined);

export const maxLength50 = maxLength(50)
export const minLength10 = minLength(10)

export const mustBeNumber = (value) => (isNaN(value) ? "Must be a number" : undefined);


