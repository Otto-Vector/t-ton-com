import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ShippersCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'
import {initialShippersContent} from '../initials-test-data';


const initialState = {
    currentId: 0,
    label: {
        // id: undefined,
        title: 'Название грузоотправителя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        shipperFio: 'ФИО отправителя',
        shipperTel: 'Телефон отправителя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
        city: undefined,
    } as ShippersCardType,

    maskOn: {
        // id: undefined,
        title: undefined,
        innNumber: '############', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 12 цифр
        address: undefined, // понятно. просто адрес
        shipperFio: undefined, //
        shipperTel: '+7 (###) ###-##-##', // 11 цифр
        description: undefined, // много букав
        coordinates: undefined,
        city: undefined,
    } as ShippersCardType,

    initialValues: {
        // id: undefined,
        title: undefined,
        innNumber: undefined,
        organizationName: undefined,
        kpp: undefined,
        ogrn: undefined,
        address: undefined,
        shipperFio: undefined,
        shipperTel: undefined,
        description: undefined,
        coordinates: undefined,
        city: undefined,
    } as ShippersCardType,

    validators: {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(12)),
        address: composeValidators(required),
        shipperFio: composeValidators(required),
        shipperTel: composeValidators(required, mustBe00Numbers(11)),
        description: undefined,
        coordinates: composeValidators(required),
    } as ShippersCardType<ValidateType>,

    content: [] as ShippersCardType[],
}

export type ShippersStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof shippersStoreActions>

export const shippersStoreReducer = ( state = initialState, action: ActionsType ): ShippersStoreReducerStateType => {

    switch (action.type) {

        case 'shippers-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'shippers-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'shippers-store-reducer/SET-SHIPPERS-CONTENT': {
            return {
                ...state,
                content: [
                    ...action.shippers,
                ],
            }
        }
        case 'shippers-store-reducer/ADD-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.shipper,
                ],
            }

        }
        case 'shippers-store-reducer/CHANGE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.map(( val ) => ( +(val.id||0) !== action.id ) ? val : action.shipper),
                ],
            }
        }
        case 'shippers-store-reducer/DELETE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { id } ) => +(id||1) !== action.id),
                ],
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const shippersStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setInitialValues: ( initialValues: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setCurrentId: ( currentId: number ) => ( {
        type: 'shippers-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    setShippersContent: ( shippers: ShippersCardType[] ) => ( {
        type: 'shippers-store-reducer/SET-SHIPPERS-CONTENT',
        shippers,
    } as const ),
    addShipper: ( shipper: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/ADD-SHIPPER',
        shipper,
    } as const ),
    changeShipper: ( id: number, shipper: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/CHANGE-SHIPPER',
        id,
        shipper,
    } as const ),
    deleteShipper: ( id: number ) => ( {
        type: 'shippers-store-reducer/DELETE-SHIPPER',
        id,
    } as const ),
}

/* САНКИ */

export type ShippersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllShippersAPI = ( { innID }: { innID: number } ): ShippersStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = initialShippersContent
            await dispatch(shippersStoreActions.setShippersContent(response))
        } catch (e) {
            alert(e)
        }

    }

