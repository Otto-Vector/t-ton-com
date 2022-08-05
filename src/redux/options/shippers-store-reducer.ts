import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, ShippersCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'
import {
    composeParsers,
    coordsToString,
    parseAllCoords,
    parseFIO,
    parseNoFirstSpaces,
    parseOnlyOneComma,
    parseOnlyOneDash,
    parseOnlyOneDot,
    parseOnlyOneSpace,
} from '../../utils/parsers';
import {GetOrganizationByInnDaDataType} from '../../api/dadata.api';
import {getOrganizationsByInn} from '../dadata-response-reducer';
import {shippersApi} from '../../api/options/shippers.api';


const defaultInitialValues = {
    idSender: '',
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
} as ShippersCardType

const initialState = {
    shipperIsFetching: false,
    currentId: '',
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
    } as ShippersCardType<string | undefined>,

    maskOn: {
        // id: undefined,
        title: undefined,
        innNumber: '########## ##', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############# ##', // 13,15 цифр
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
        organizationName: composeValidators(required, maxLength(100)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe0_0Numbers(13)(15)),
        address: composeValidators(required, maxLength(150)),
        shipperFio: composeValidators(required),
        shipperTel: composeValidators(required, mustBe00Numbers(11)),
        description: composeValidators(maxLength(300)),
        coordinates: composeValidators(required),
    } as ShippersCardType<ValidateType>,

    parsers: {
        title: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        innNumber: undefined,
        organizationName: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        kpp: undefined,
        ogrn: undefined,
        address: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        shipperFio: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        shipperTel: undefined,
        description: undefined,
        coordinates: composeParsers(parseAllCoords, parseOnlyOneSpace, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma),
        city: undefined,
    } as ShippersCardType<ParserType>,

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
        case 'shippers-store-reducer/TOGGLE-SHIPPER-IS-FETSHING': {
            return {
                ...state,
                shipperIsFetching: action.shipperIsFetching,
            }

        }
        case 'shippers-store-reducer/SET-COORDINATES': {
            return {
                ...state,
                initialValues: {
                    ...action.payload.formValue,
                    coordinates: coordsToString(action.payload.coordinates),
                },
            }
        }
        case 'shippers-store-reducer/SET-ORGANIZATION-VALUES': {
            return {
                ...state,
                initialValues: { ...state.initialValues, ...action.payload },
            }
        }
        case 'shippers-store-reducer/SET-DEFAULT-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: defaultInitialValues,
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
    setDefaultInitialValues: () => ( {
        type: 'shippers-store-reducer/SET-DEFAULT-INITIAL-VALUES',
    } as const ),
    setCurrentId: ( currentId: string ) => ( {
        type: 'shippers-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    // подгрузка во временный стейт координат
    setCoordinates: ( payload: { formValue: ShippersCardType, coordinates: [ number, number ] } ) => ( {
        type: 'shippers-store-reducer/SET-COORDINATES',
        payload,
    } as const ),
    // подгрузка во временный стейт данных организации
    setOrganizationValues: ( payload: { organizationName: string, ogrn: string, address: string, kpp: string } ) => ( {
        type: 'shippers-store-reducer/SET-ORGANIZATION-VALUES',
        payload,
    } as const ),
    setShippersContent: ( shippers: ShippersCardType[] ) => ( {
        type: 'shippers-store-reducer/SET-SHIPPERS-CONTENT',
        shippers,
    } as const ),
    toggleShipperIsFetching: ( shipperIsFetching: boolean ) => ( {
        type: 'shippers-store-reducer/TOGGLE-SHIPPER-IS-FETSHING',
        shipperIsFetching,
    } as const ),

}

/* САНКИ */

export type ShippersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllShippersAPI = (): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(shippersStoreActions.toggleShipperIsFetching(true))
        try {

            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.getAllShippersByUserId({ idUser })
            dispatch(shippersStoreActions.setShippersContent(response.map(( { idUser, ...values } ) => values)))

            if (!response.length) console.log('Пока ни одного Грузоотправителя')

        } catch (e) {
            alert(e)
        }
        dispatch(shippersStoreActions.toggleShipperIsFetching(false))
    }

// запрос параметров организации из DaData
export const getOrganizationByInnShipper = ( { inn }: GetOrganizationByInnDaDataType ):
    ShippersStoreReducerThunkActionType<string | null> =>
    async ( dispatch, getState ) => {

        const { innNumber } = getState().shippersStoreReducer.initialValues
        const booleanMemo = ( +( innNumber || 0 ) !== inn )
        const response = booleanMemo
            ? await dispatch<any>(getOrganizationsByInn({ inn }))
            : null

        if (response !== null) {
            return response
        } else return null

    }

// сохранение параметров организации из ранее загруженного списка DaData
export const setOrganizationByInnKppShippers = ( {
                                                     kppNumber,
                                                     formValue,
                                                 }: { kppNumber: string, formValue: ShippersCardType } ):
    ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        const response = getState().daDataStoreReducer.suggestions.filter(( { data: { kpp } } ) => kpp === kppNumber)[0]

        if (response !== undefined) {
            const { data } = response
            dispatch(shippersStoreActions.setInitialValues({
                ...formValue,
                innNumber: data.inn,
                kpp: data.kpp,
                organizationName: response.value,
                ogrn: data.ogrn,
                address: data.address.value,
            }))
        } else alert('Фильтр КПП локально не сработал!')

    }


export const newShipperSaveToAPI = ( values: ShippersCardType<string> ): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.createOneShipper({ idUser, ...values })
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(e.response.data.failed)
        }
        await dispatch(getAllShippersAPI())
    }
export const modifyOneShipperToAPI = ( values: ShippersCardType<string> ): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.modifyOneShipper({
                idUser, ...values,
                // toDo: убрать заглушку после того как настрою https
                description: values.description || '-',
                city: values.city || '-',
            })
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllShippersAPI())
    }


export const oneShipperDeleteToAPI = ( idSender: string ): ShippersStoreReducerThunkActionType =>
    async ( dispatch ) => {

        try {
            const response = await shippersApi.deleteOneShipper({ idSender })
            if (response.message) console.log(response.message)
        } catch (e) {
            // @ts-ignore
            alert(e.response.data.error)
        }
        await dispatch(getAllShippersAPI())
    }
