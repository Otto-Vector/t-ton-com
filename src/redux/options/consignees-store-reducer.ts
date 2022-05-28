import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ConsigneesCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'


const initialState = {
    currentId: 0,

    label: {
        title: 'Название грузополучателя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        consigneesFio: 'ФИО получателя',
        consigneesTel: 'Телефон получателя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
    } as ConsigneesCardType,

    maskOn: {
        title: undefined,
        innNumber: '############', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 12 цифр
        address: undefined, // понятно. просто адрес
        consigneesFio: undefined, //
        consigneesTel: '+7 (###) ###-##-##', //
        description: undefined, // много букав
        coordinates: undefined,
    } as ConsigneesCardType,

    initialValues: {
        title: undefined,
        innNumber: undefined,
        organizationName: undefined,
        kpp: undefined,
        ogrn: undefined,
        address: undefined,
        consigneesFio: undefined,
        consigneesTel: undefined,
        description: undefined,
        coordinates: undefined,
    } as ConsigneesCardType,

    validators: {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(12)),
        address: composeValidators(required),
        consigneesFio: composeValidators(required),
        consigneesTel: composeValidators(required, mustBe00Numbers(11)),
        description: undefined,
        coordinates: composeValidators(required),
    } as ConsigneesCardType<ValidateType>,

    content: [
        {
            id: 12, title: 'Хранители попкорна',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Казань, Мира ул., д. 9 кв.21',
            consigneesFio: 'Молчанов Юстиниан Борисович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Казань',
        },
        {
            id: 13, title: 'Б и Ко',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Йошкар-Ола, Дачная ул., д. 20 кв.191',
            consigneesFio: 'Бобров Федор Протасьевич',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Йошкар-Ола',
        },
        {
            id: 14, title: 'Южный Мак',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Астрахань, Мира ул., д. 7 кв.83',
            consigneesFio: 'Савельев Даниил Вадимович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Астрахань',
        },
        {
            id: 15, title: 'Ретир загубыч',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Москва, Севернаяул., д. 11 кв.119',
            consigneesFio: 'Веселов Альфред Тимофеевич',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Москва',
        },
        {
            id: 16, title: 'Загребущие тараканы',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Новошахтинск, Садовая ул., д. 11 кв.134',
            consigneesFio: 'Зуев Мартин Павлович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Новошахтинск',
        },
        {
            id: 17, title: 'Насекомоядные',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Владимир, Советская ул., д. 19 кв.31',
            consigneesFio: 'Уваров Владлен Артемович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Усолье-Сибирское',
        },
        {
            id: 18, title: 'Растительные жиры',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Северск, Набережная ул., д. 3 кв.59',
            consigneesFio: 'Пестов Рудольф Валерьевич',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Северск',
        },
        {
            id: 19, title: 'Собаки гавкающие',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '606369470',
            ogrn: '8179195353032',
            address: 'Россия, г. Рубцовск, Полесская ул., д. 7 кв.112',
            consigneesFio: 'Суворов Корнелий Богуславович',
            consigneesTel: '+7 (955) 890-24-98',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Рубцовск',
        },
        {
            id: 20, title: 'Собаки лающие',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Реутов, Партизанская ул., д. 4 кв.138',
            consigneesFio: 'Волков Влас Михаилович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Нижний Реутов',
        },
        {
            id: 21, title: 'Собаки кусающие',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Чебоксары, ЯнкиКупалы ул., д. 4 кв.32',
            consigneesFio: 'Сафонов Вольдемар Пётрович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Чебоксары',
        },
        {
            id: 22, title: 'Рыба, плавающая очень глубоко, пока никого нет',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Новокуйбышевск, 3 Марта ул., д. 21 кв.157',
            consigneesFio: 'Трофимов Алексей Альбертович',
            consigneesTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Новокуйбышевск',
        },
        {
            id: 23, title: 'Кит',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Калининград, Трудовая ул., д. 7 кв.104',
            consigneesFio: 'Савин Моисей Александрович',
            consigneesTel: '+7 (997) 365-88-66',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
            city: 'Калининград',
        },
    ] as ConsigneesCardType[],
}

export type ConsigneesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof consigneesStoreActions>

export const consigneesStoreReducer = ( state = initialState, action: ActionsType ): ConsigneesStoreReducerStateType => {

    switch (action.type) {

        case 'consignees-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'consignees-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'consignees-store-reducer/SET-SHIPPERS': {
            return {
                ...state,
                content: [
                    ...action.consignees,
                ],
            }
        }
        case 'consignees-store-reducer/ADD-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.consignee,
                ],
            }

        }
        case 'consignees-store-reducer/CHANGE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.map(( val ) => ( +( val.id || 0 ) !== action.id ) ? val : action.consignee),
                ],
            }
        }
        case 'consignees-store-reducer/DELETE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { id } ) => +( id || 1 ) !== action.id),
                ],
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const consigneesStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: ( initialValues: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/SET-VALUES',
        initialValues,
    } as const ),
    setInitialValues: ( initialValues: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setCurrentId: ( currentId: number ) => ( {
        type: 'consignees-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    setConsignees: ( consignees: ConsigneesCardType[] ) => ( {
        type: 'consignees-store-reducer/SET-SHIPPERS',
        consignees,
    } as const ),
    addConsignee: ( consignee: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/ADD-SHIPPER',
        consignee,
    } as const ),
    changeConsignee: ( id: number, consignee: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/CHANGE-SHIPPER',
        id,
        consignee,
    } as const ),
    deleteConsignee: ( id: number ) => ( {
        type: 'consignees-store-reducer/DELETE-SHIPPER',
        id,
    } as const ),
}

/* САНКИ */

export type ConsigneesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): ConsigneesStoreReducerThunkActionType =>
//     async ( dispatch ) => {
//         // dispatch( requestFormActions.setIcons( null ) )
//         try {
//             const response = await getIconsFromApi( { domain } )
//             dispatch( baseStoreActions.setIcons( domain, response ) )
//         } catch (e) {
//             alert( e )
//             // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
//         }
//
//     }

