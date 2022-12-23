import {daDataStoreActions, getOrganizationsByInn} from '../redux/api/dadata-response-reducer';
import {parseAllNumbers} from '../utils/parsers';
import {syncValidators} from '../utils/validators';
import {Dispatch} from 'react';


// синхронно/асинхронный валидатор на поле ИНН
export const useInnPlusApiValidator = <R extends { innNumber: string }>(
    dispatch: Dispatch<any>,
    setInitValues: any,
    blankFields: R,
    isSetInitDispatch?: boolean ) =>
    ( preValues: R ) => async ( currentValue?: string ) => {

        // асинхронный валидатор ИНН через АПИ
        const innValidate = async ( inn: number ) => await dispatch(getOrganizationsByInn({ inn }))
        // убираем маски перед сравнением
        const [ prev, current ] = [ preValues.innNumber, currentValue ].map(parseAllNumbers)
        const [ validCurrent, validPrev ] = [ current || '', prev || '' ].map(syncValidators.inn)

        // проверяем, чтобы лишний раз не сработало
        if (prev !== current) {
            // console.log ('prev: ',prev, 'current: ', current)
            // debugger
            console.log(validCurrent, validPrev)
            // зачистка авто-полей при невалидном поле, если до этого оно изменилось с валидного,
            // а также при нажатии кнопки зачистки поля

            // if (( current && validCurrent && !validPrev ) || !current) {
            //     const resetValues = { ...preValues, ...blankFields, innNumber: current }
            //     isSetInitDispatch
            //         ? dispatch(setInitValues(resetValues))
            //         : setInitValues(resetValues)
            //     dispatch(daDataStoreActions.setSuggectionsValues([]))
            // }

            // запускаем асинхронную валидацию только после синхронной
            // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
            return validCurrent || await innValidate(+current)
        } else {
            return validCurrent
        }
    }