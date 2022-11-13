import {daDataStoreActions, getOrganizationsByInn} from '../redux/api/dadata-response-reducer';
import {parseAllNumbers} from '../utils/parsers';
import {syncValidators} from '../utils/validators';
import {Dispatch} from 'react';


// синхронно/асинхронный валидатор на поле ИНН
export const useInnPlusApiValidator =
    <R extends { innNumber: string }>(
        dispatch: Dispatch<any>,
        setInitValues: any,
        blankFields: R,
        isSetInitDispatch?: boolean ) =>
        ( preValues: R ) => ( currentValue?: string ) => {

            // асинхронный валидатор ИНН через АПИ
            const innValidate = async ( inn: string ) => dispatch(getOrganizationsByInn({ inn: +parseAllNumbers(inn) }))
            // убираем маски перед сравнением
            const [ prev, current ] = [ preValues.innNumber, currentValue ].map(parseAllNumbers)

            // проверяем, чтобы лишний раз не сработало
            if (prev !== current) {
                const [ validPrev, validCurrent ] = [ current, prev ].map(syncValidators.inn)
                // зачистка авто-полей при невалидном поле, если до этого оно изменилось с валидного,
                // а также при нажатии кнопки зачистки поля
                if (( current && validCurrent && !validPrev ) || !current) {
                    isSetInitDispatch
                        ? dispatch(setInitValues({ ...preValues, ...blankFields, innNumber: current }))
                        : setInitValues({ ...preValues, ...blankFields, innNumber: current })
                    dispatch(daDataStoreActions.setSuggectionsValues([]))
                }
                // запускаем асинхронную валидацию только после синхронной
                // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
                return validCurrent || current ? innValidate(current) : undefined
            } else return undefined
        }