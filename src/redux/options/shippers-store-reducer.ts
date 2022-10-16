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
import {getOrganizationsByInn} from '../api/dadata-response-reducer';
import {shippersApi} from '../../api/options/shippers.api';
import {GetAvtodispetcherRouteType, getRouteFromAvtodispetcherApi} from '../../api/avtodispetcher.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';


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
    shippersIsFetching: false,
    currentId: '' as string | null,

    label: {
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
        title: undefined,
        innNumber: '########## ##', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############# ##', // 13,15 цифр
        address: undefined, // просто адрес
        shipperFio: undefined, //
        shipperTel: '+7 (###) ###-##-##', // 11 цифр
        description: undefined, // много букав
        coordinates: undefined,
        city: undefined,
    } as ShippersCardType,

    initialValues: {
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
        kpp: composeValidators(required),
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

    content: [] as ShippersCardType<string>[],
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
        case 'shippers-store-reducer/TOGGLE-SHIPPER-IS-FETCHING': {
            return {
                ...state,
                shippersIsFetching: action.shippersIsFetching,
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
        case 'shippers-store-reducer/SET-DEFAULT-INITIAL-VALUES': {
            return {
                ...state,
                currentId: null,
                initialValues: {} as ShippersCardType,
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
    setShippersContent: ( shippers: ShippersCardType<string>[] ) => ( {
        type: 'shippers-store-reducer/SET-SHIPPERS-CONTENT',
        shippers,
    } as const ),
    toggleShipperIsFetching: ( shippersIsFetching: boolean ) => ( {
        type: 'shippers-store-reducer/TOGGLE-SHIPPER-IS-FETCHING',
        shippersIsFetching,
    } as const ),

}

/* САНКИ */

export type ShippersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// запрос на всех Грузоотправителей данного пользователя
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

        const response = ( kppNumber !== '-' )
            ? getState().daDataStoreReducer.suggestions.filter(( { data: { kpp } } ) => kpp === kppNumber)[0]
            : getState().daDataStoreReducer.suggestions[0]

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
        } else {
            // alert('Фильтр КПП локально не сработал!')
            dispatch(globalModalStoreActions.setTextMessage('Фильтр КПП локально не сработал!'))
        }
    }

// добавить одну запись ГРУЗООТПРАВИТЕЛЯ через АПИ
export const newShipperSaveToAPI = ( values: ShippersCardType<string> ): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.createOneShipper({ idUser, ...values })
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage('Ошибка запроса на название города\n' + JSON.stringify(e.response.data.failed)))
        }
        await dispatch(getAllShippersAPI())
    }

// изменить одну запись ГРУЗООТПРАВИТЕЛЯ через АПИ
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
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e.response.data)))
        }
        await dispatch(getAllShippersAPI())
    }

// удалить одну запись ГРУЗООТПРАВИТЕЛЯ через АПИ
export const oneShipperDeleteToAPI = ( idSender: string | null ): ShippersStoreReducerThunkActionType =>
    async ( dispatch ) => {

        try {
            if (idSender) {
                const response = await shippersApi.deleteOneShipper({ idSender })
                if (response.message) console.log(response.message)
            }
        } catch (e) {
            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e.response.data)))
        }
        await dispatch(getAllShippersAPI())
    }

// геолокируем (вытаскиваем) название города из запроса автодиспетчера
export const getCityFromDispetcherAPI = ( {
                                              from,
                                              to,
                                          }: GetAvtodispetcherRouteType ): ShippersStoreReducerThunkActionType<{ coordinates?: string, city?: string } | null> =>
    async () => {
        try {
            const response = await getRouteFromAvtodispetcherApi({ from, to })

            if (response.segments.length > 0) {
                return ( { city: response.segments[0].start.name } )
            }

        } catch (e) {
            // dispatch(globalModalStoreActions.setTextMessage('Ошибка запроса на название города'))
            return ( { coordinates: 'Ошибка запроса на название города, измените координаты' } )
        }

        return null
    }