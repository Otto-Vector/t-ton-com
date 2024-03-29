import {parseAllNumbers, toNumber} from './parsers'

export const composeValidators = ( ...validators: ( ( val: string ) => string | undefined )[] ) => ( value: string ): string | undefined =>
    validators.reduce(( error, validator ) => error || validator(value), undefined as string | undefined)


/////////////////////////////////////////////////////////////////////////////////
export const required = ( value: string ) => value ? undefined : 'Обязательное поле'

export const mustBeNumber = ( value: string ) => isNaN(Number(value)) ? 'Должны быть только цифры' : undefined
export const maxLength = ( max: number ) => ( value: string ) => ( value && value.length > max ) ? `Больше ${ max } символов!` : undefined
export const minLength = ( min: number ) => ( value: string ) => value.length <= min ? `Меньше ${ min } символов!` : undefined
export const maxRangeNumber = ( max: number ) => ( value: string ) => toNumber(value) > max ? `Значение не должно превышать ${ max }!` : undefined
export const maxNumbers = ( max: number ) => ( value: string ) => parseAllNumbers(value).length > max ? `Больше ${ max } цифр!` : undefined
export const minNumbers = ( min: number ) => ( value: string ) => parseAllNumbers(value).length < min ? `Должно быть не менее ${ min } цифр!` : undefined
export const mustBe00Numbers = ( exact: number ) => ( value: string ) => ( value && parseAllNumbers(value).length !== exact ) ? `Должно быть ${ exact } цифр!` : undefined
export const mustNotBeOnlyNull = ( value: string ) => ( value && toNumber(parseAllNumbers(value)) === 0 ) ? `Здесь только нули!` : undefined
export const mustBe0_0Numbers = ( exactMin: number ) => ( exactMax: number ) => ( value: string ) =>
    ![ exactMin, exactMax ].includes(parseAllNumbers(value).length) ? `Должно быть ${ exactMin } или ${ exactMax } цифр!` : undefined

export const mustBeMail = ( value: string ) => value ? value.match(/^\S+@\S+\.\S+$/) ? undefined : 'Введите email корректно' : undefined

export const includesTitleValidator = ( list: string[], include: string ) => list.includes(include) ? 'Такой заголовок уже существует. Измените его' : undefined

export const syncValidators = {
    required,
    // только 10 цифр
    justTenNumbers: composeValidators(maxNumbers(10)),
    // рекомендовано максимум 20 символов
    textReqMicro: composeValidators(required, maxLength(20)),
    // рекомендовано максимум 50 символов
    textReqMin: composeValidators(required, maxLength(50)),
    // максимум 50 символов
    textMin: composeValidators(maxLength(50)),
    // рекомендовано максимум 120 символов
    textReqMiddle: composeValidators(required, maxLength(120)),
    // максимум 120 символов
    textMiddle: composeValidators(maxLength(120)),
    // рекомендовано максимум 300 символов
    textReqMax: composeValidators(required, maxLength(300)),
    // максимум 300 символов
    textMax: composeValidators(maxLength(300)),
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
    sms: composeValidators(required, mustBeNumber, mustBe00Numbers(4)),
    // серия номер паспорта
    passport: composeValidators(required, mustBe00Numbers(10), mustNotBeOnlyNull),
    // водительские права
    drivingLicence: composeValidators(required, mustBe0_0Numbers(8)(10)),
    // категории прав максимальная
    drivingCategory: composeValidators(required, maxLength(20)),
    // номер машины
    transportNumber: composeValidators(required, minNumbers(5)),
    // номер прицепа
    trailerNumber: composeValidators(required, minNumbers(6)),
    // название, модель машины/прицепа
    trailerTransportModel: composeValidators(required, maxLength(30)),
    // ПТС
    pts: composeValidators(required, mustBe00Numbers(8)),
    // ДОПОГ
    dopog: composeValidators(required, maxLength(10)),
    // максимальный вес груза
    cargoWeightTransport: composeValidators(maxRangeNumber(50)),
    // максимальный вес груза
    cargoWeightTrailer: composeValidators(required, mustNotBeOnlyNull, maxRangeNumber(50)),
    // фактический вес груза при погрузке
    cargoWeightInModal: ( weight: number ) => composeValidators(required, mustNotBeOnlyNull, maxRangeNumber(weight)),
    // почта
    email: composeValidators(required, mustBeMail),
    // БИК банка
    bikBank: composeValidators(required, mustBe00Numbers(9)),
    // номер счёта
    account: composeValidators(required, mustBe00Numbers(20)),
    // максимальная сумма за тн.км
    responseStavka: composeValidators(required, maxRangeNumber(3000)),
}
