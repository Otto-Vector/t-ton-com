import {daDataStoreActions, getOrganizationsByInn} from '../redux/api/dadata-response-reducer';
import {parseAllNumbers} from '../utils/parsers';
import {syncValidators} from '../utils/validators';
import {Dispatch} from 'react';


// синхронно/асинхронный валидатор на поле ИНН
export const useInnPlusApiValidator = <R extends { innNumber: string }>(
    // диспатч обязателно передаётся через компоненту (пока так)
    dispatch: Dispatch<any>,
    // экшон, который устанавливает значения в init
    setInitValuesAction: any,
    // поля, которые надо зачистить и их значения
    blankFields: R,
    ) =>
    // все поля/данные из формы
    ( preValues: R ) =>
        // значения ИНН в конкретный момент в поле ввода
        async ( currentValue?: string ) => {

        // асинхронный валидатор ИНН через АПИ
        const innValidate = async ( inn: number ) => await dispatch(getOrganizationsByInn({ inn }))
        // убираем маски перед сравнением
        const [ prev, current ] = [ preValues.innNumber, currentValue ].map(parseAllNumbers)
        const [ validCurrent, validPrev ] = [ current || '', prev || '' ].map(syncValidators.inn)
        const [ isValidCurrent, isValidPrev ] = [ validCurrent === undefined, validPrev === undefined ]

        // проверяем, чтобы лишний раз не сработало
        if (prev !== current) {
            // зачистка авто-полей при невалидном поле, если до этого оно изменилось с валидного,
            // а также срабатывает при нажатии кнопки зачистки поля
            if (!isValidCurrent && isValidPrev) {
                const resetValues = { ...preValues, ...blankFields, innNumber: current }
                // debugger
                // зачищаем необходимые поля
                dispatch(setInitValuesAction(resetValues))
                // зачищаем селектор
                dispatch(daDataStoreActions.setSuggectionsValues([]))
            }

            // запускаем асинхронную валидацию только после синхронной
            return validCurrent || await innValidate(+current)
        } else {
            return validCurrent
        }
    }