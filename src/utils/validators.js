import {parseAllNumbers} from './parsers';

export const composeValidators = (...validators) => (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined);


/////////////////////////////////////////////////////////////////////////////////
export const required = (value) => ( value ? undefined : "Обязательное поле" )

export const mustBeNumber = (value) => ( isNaN(value) ? "Только цифры" : undefined );
export const maxLength = (max) => (value) => ( ( value && ( value.length > max ) ) ? `Больше ${ max } символов!` : undefined );
export const minLength = (min) => (value) => ( ( value.length <= min ) ? `Меньше ${ min } символов!` : undefined );
export const maxRangeNumber = (max) => (value) => ( ( +value > max ) ? `Значение не должно превышать ${ max }!` : undefined );
export const maxNumbers = (max) => (value = undefined) => ( ( parseAllNumbers(value).length > max ) ? `Больше ${ max } цифр!` : undefined );
export const mustBe00Numbers = (to) => (value) => ( value && ( parseAllNumbers(value).length !== to ) ? `Должно быть ${ to } цифр!` : undefined )
export const mustNotBeOnlyNull = (value) => ( value && ( +parseAllNumbers(value) === 0 ) ? `Здесь только нули!` : undefined )
export const mustBe0_0Numbers = (from) => (to) => (value) => (
    ( parseAllNumbers(value).length !== from && parseAllNumbers(value).length !== to ) ? `Должно быть ${ from } или ${ to } цифр!` : undefined );
export const mustBeMail = (value) => value ? value.match(/^\S+@\S+\.\S+$/) ? undefined : 'Введите email корректно' : undefined
export const includesTitleValidator = (list, include) => list.includes(include) ? 'Такой заголовок уже существует. Измените его' : undefined

export const syncValidators = {
    required,
    justTenNumbers: composeValidators(maxNumbers(10), mustNotBeOnlyNull),
    // рекомендовано максимум 50 символов
    textReqMin: composeValidators(required, maxLength(50)),
    // рекомендовано максимум 120 символов
    textReqMiddle: composeValidators(required, maxLength(120)),
    // рекомендовано максимум 300 символов
    textReqMax: composeValidators(maxLength(300)),
    // ИНН (юр/физ)
    inn: composeValidators(required, mustBe0_0Numbers(10)(12)),
    // ОГРН 13,15 символов
    ogrn: composeValidators(required, mustBe0_0Numbers(13)(15)),
    // KPP 9 символов
    kpp: composeValidators(mustBe00Numbers(9)),
    // ОКПО
    okpo: composeValidators(required, mustBe0_0Numbers(8)(10)),
    // телефон
    phone: composeValidators(required, mustBe00Numbers(11), mustNotBeOnlyNull),
    // SMS код
    sms: composeValidators(required, mustBe00Numbers(4)),
    // серия номер паспорта
    passport: composeValidators(required, mustBe00Numbers(10), mustNotBeOnlyNull),
    // водительские права
    drivingLicence: composeValidators(required, maxLength(20)),
    // категории прав
    drivingCategory: composeValidators(required, maxLength(20)),
    // номер машины/прицепа
    trailerTransportNumber: composeValidators(required, maxLength(20)),
    // название, модель машины/прицепа
    trailerTransportModel: composeValidators(required, maxLength(30)),
    // ПТС
    pts: composeValidators(required, maxLength(14)),
    // ДОПОГ
    dopog: composeValidators(required, maxLength(10)),
    // максимальный вес груза
    cargoWeight: composeValidators(maxRangeNumber(50)),
    // почта
    email: composeValidators(required, mustBeMail),
    // БИК банка
    bikBank: composeValidators(required, mustBe00Numbers(9)),
    // номер счёта
    account: composeValidators(required, mustBe00Numbers(20)),
    // максимальная сумма за тн.км
    responseStavka: composeValidators(required, maxRangeNumber(3000)),
}
