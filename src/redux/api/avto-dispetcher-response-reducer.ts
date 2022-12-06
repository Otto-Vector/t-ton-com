import {AppStateType, GetActionsTypes} from '../redux-store'
import {AvtoDispetcherResponseType} from '../../types/api-types'

import {ThunkAction} from 'redux-thunk'
import {GetAvtodispetcherRouteType, getRouteFromAvtodispetcherApi} from '../../api/external-api/avtodispetcher.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';

const initialState = {
    responseRoute: {} as AvtoDispetcherResponseType,
}

export type AvtoDispetcherStoreReducerStateType = typeof initialState

export type AvtoDispetcherStoreActionsType = GetActionsTypes<typeof avtoDispetcherStoreActions>

export const avtoDispetcherStoreReducer = ( state = initialState, action: AvtoDispetcherStoreActionsType ): AvtoDispetcherStoreReducerStateType => {

    switch (action.type) {
        case 'avtoDispetcher-store-reducer/SET-VALUES': {
            return {
                ...state,
                responseRoute: action.responseRoute,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const avtoDispetcherStoreActions = {
    setValues: ( responseRoute: AvtoDispetcherResponseType ) => ( {
        type: 'avtoDispetcher-store-reducer/SET-VALUES',
        responseRoute,
    } as const ),
}

/* САНКИ */
// конструктор для типов санок
export type AvtoDispetcherThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, AvtoDispetcherStoreActionsType | GlobalModalActionsType>

// геолокируем (вытаскиваем) название города из запроса автодиспетчера
export const getCityFromDispetcherAPI = ( {
                                              from,
                                              to,
                                          }: GetAvtodispetcherRouteType ): AvtoDispetcherThunkActionType<{ coordinates?: string, city?: string } | null> =>
    async ( dispatch ) => {
        try {
            const response = await getRouteFromAvtodispetcherApi({ from, to })

            if (response.segments.length > 0) {
                const cityNameStart = response.segments[0].start.name
                const cityNameFinish = response.segments[0].finish.name
                const city = isNaN(+cityNameStart[0]) ? cityNameStart : cityNameFinish
                return { city }
            }

        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage('Ошибка запроса на название города'))
            return { coordinates: 'Ошибка запроса на название города, измените координаты' }
        }

        return null
    }