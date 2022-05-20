import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {
    composeValidators,
    maxLength,
    maxNumbers,
    mustBe00Numbers,
    mustNotBeOnlyNull,
    required,
} from '../../utils/validators'
import {EmployeesCardType, ValidateType} from '../../types/form-types'

const initialState = {
    label: {
        employeeFIO: 'ФИО сотрудника',
        employeePhoneNumber: 'Телефон сотрудника',
        passportSerial: 'Серия, № паспорта',
        passportImage: ' cкан паспорта',
        passportFMS: 'Кем выдан паспорт',
        passportDate: 'Когда выдан',
        drivingLicenseNumber: 'Номер водительского удостоверения',
        drivingLicenseImage: ' cкан водительского удостоверения',
        drivingCategory: 'Водительские категории',
        personnelNumber: 'Табельный номер',
        garageNumber: 'Гаражный номер',
        mechanicFIO: 'ФИО механика',
        dispatcherFIO: 'ФИО диспетчера',
        photoFace: 'Добавить фотографию сотрудника',
        rating: 'Рейтинг:',
    } as EmployeesCardType,
    maskOn: {
        employeeFIO: undefined, // просто текст
        employeePhoneNumber: '+7 (###) ###-##-##', // 11 цифр
        passportSerial: '## ## ### ###', // 10 цифр
        passportImage: undefined, // путь к файлу изображения
        passportFMS: undefined, // просто текст
        passportDate: undefined, // режим ввода даты
        drivingLicenseNumber: '## ## ######', // 10 цифр
        drivingLicenseImage: undefined, // путь к файлу изображения
        drivingCategory: undefined, // просто текст же?
        personnelNumber: '##### #####', // поставим ДО 10 цифр
        garageNumber: '##### #####', // поставим ДО 10 цифр
        mechanicFIO: undefined, // просто текст
        dispatcherFIO: undefined, // просто текст
        photoFace: undefined, // путь к файлу изображения
        rating: '##', // чило ДО 2-х цифр
    } as EmployeesCardType,
    initialValues: {
        employeeFIO: undefined,
        employeePhoneNumber: undefined,
        passportSerial: undefined,
        passportImage: undefined,
        passportFMS: undefined,
        passportDate: undefined,
        drivingLicenseNumber: undefined,
        drivingLicenseImage: undefined,
        drivingCategory: undefined,
        personnelNumber: undefined,
        garageNumber: undefined,
        mechanicFIO: undefined,
        dispatcherFIO: undefined,
        photoFace: undefined,
        rating: undefined,
    } as EmployeesCardType,
    validators: {
        employeeFIO: composeValidators( required, maxLength( 50 ) ),
        employeePhoneNumber: composeValidators( required, mustBe00Numbers( 11 ) ),
        passportSerial: composeValidators( mustBe00Numbers( 10 ), mustNotBeOnlyNull ),
        passportImage: undefined,
        passportFMS: undefined,
        passportDate: undefined,
        drivingLicenseNumber: composeValidators( mustBe00Numbers( 10 ), mustNotBeOnlyNull ),
        drivingLicenseImage: undefined,
        drivingCategory: undefined,
        personnelNumber: composeValidators( maxNumbers( 10 ) ),
        garageNumber: composeValidators( maxNumbers( 10 ), mustNotBeOnlyNull ),
        mechanicFIO: composeValidators( maxLength( 50 ) ),
        dispatcherFIO: composeValidators( maxLength( 50 ) ),
        photoFace: undefined,
        rating: composeValidators( maxNumbers( 2 ) ),
    } as EmployeesCardType<ValidateType>
}

export type EmployeesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof employeesStoreActions>

export const employeesStoreReducer = ( state = initialState, action: ActionsType ): EmployeesStoreReducerStateType => {

    switch (action.type) {

        case 'employees-store-reducer/SET-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const employeesStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: ( initialValues: EmployeesCardType ) => ( {
        type: 'employees-store-reducer/SET-VALUES',
        initialValues,
    } as const ),

}

/* САНКИ */

export type EmployeesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): BaseStoreReducerThunkActionType =>
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

