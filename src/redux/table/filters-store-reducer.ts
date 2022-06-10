import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {addOneDay, ddMmFormat} from '../../utils/date-formats';


const date = new Date()

export const initialFiltersState = {
    buttons: {
        cargoFilter: {
            title: 'Тип груза',
            mode: false,
            // type: CargoType,
        },
        todayFilter: {
            title: 'Сегодня ' + ddMmFormat(date),
            mode: false,
        },
        tomorrowFilter: {
            title: 'Завтра ' + ddMmFormat(addOneDay(date)),
            mode: false,
        },
        shortRouteFilter: {
            title: 'Местные < 100',
            mode: false,
        },
        longRouteFilter: {
            title: 'Дальние > 100',
            mode: false,
        },
        nearDriverFilter: {
            title: 'Рядом с авто',
            mode: false,
        },
        clearFilters: {
            title: 'Без Фильтра',
            mode: true,
        },
    },
    values: {
        dayFilter: undefined as undefined | Date,
        routeFilter: [0, 99999],
        cargoFilter: ''
    },
}

export type FiltersStoreReducerStateType = typeof initialFiltersState

type ActionsType = GetActionsTypes<typeof filtersStoreActions>

export const filtersStoreReducer = (state = initialFiltersState, action: ActionsType): FiltersStoreReducerStateType => {

    switch (action.type) {

        case 'filters-store-reducer/SET-TODAY-FILTER': {
            return {
                ...state,
                values:
                    {
                        ...state.values,
                        dayFilter: state.buttons.todayFilter.mode ? date : undefined,
                    },
            }
        }
        case 'filters-store-reducer/SET-TODAY-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    todayFilter: {...state.buttons.todayFilter, mode: action.mode},
                },
            }
        }
        case 'filters-store-reducer/SET-TOMORROW-FILTER': {
            return {
                ...state,
                values: {
                    ...state.values,
                    dayFilter: state.buttons.tomorrowFilter.mode ? addOneDay(date) : undefined,
                },
            }
        }
        case 'filters-store-reducer/SET-TOMORROW-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    tomorrowFilter: {...state.buttons.tomorrowFilter, mode: action.mode},
                },
            }
        }
        case 'filters-store-reducer/SET-SHORT-ROUTE-FILTER': {
            return {
                ...state,
                values: {
                    ...state.values,
                    routeFilter: state.buttons.shortRouteFilter.mode ? [0, 100] : [0, 99999],
                },
            }
        }
        case 'filters-store-reducer/SET-SHORT-ROUTE-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    shortRouteFilter: {...state.buttons.shortRouteFilter, mode: action.mode},
                },
            }
        }
        case 'filters-store-reducer/SET-LONG-ROUTE-FILTER': {
            return {
                ...state,
                values: {
                    ...state.values,
                    routeFilter: state.buttons.longRouteFilter.mode ? [100, 99999] : [0, 99999],
                },
            }
        }
        case 'filters-store-reducer/SET-LONG-ROUTE-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    longRouteFilter: {...state.buttons.longRouteFilter, mode: action.mode},
                },
            }
        }
        case 'filters-store-reducer/SET-NEAR-DRIVER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    nearDriverFilter: {...state.buttons.nearDriverFilter, mode: action.mode}
                }
            }
        }
        case 'filters-store-reducer/SET-CARGO-FILTER-VALUE': {
            return {
                ...state,
                values: {
                    ...state.values,
                    cargoFilter: action.value
                }
            }
        }
        case 'filters-store-reducer/SET-CARGO-FILTER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    cargoFilter: {...state.buttons.cargoFilter, mode: action.mode}
                }
            }
        }

        case 'filters-store-reducer/SET-CLEAR-FILTER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    clearFilters: {...state.buttons.clearFilters, mode: action.mode}
                }
            }
        }
        case 'filters-store-reducer/SET-CLEAR-FILTER': {
            return {
                ...action.initial,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const filtersStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setTodayFilter: () => ({
        type: 'filters-store-reducer/SET-TODAY-FILTER',
    } as const),
    setTodayMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-TODAY-MODE',
        mode,
    } as const),
    setTomorrowFilter: () => ({
        type: 'filters-store-reducer/SET-TOMORROW-FILTER',
    } as const),
    setTomorrowMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-TOMORROW-MODE',
        mode,
    } as const),
    setShortRouteFilter: () => ({
        type: 'filters-store-reducer/SET-SHORT-ROUTE-FILTER',
    } as const),
    setShortRouteMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-SHORT-ROUTE-MODE',
        mode,
    } as const),
    setLongRouteFilter: () => ({
        type: 'filters-store-reducer/SET-LONG-ROUTE-FILTER',
    } as const),
    setLongRouteMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-LONG-ROUTE-MODE',
        mode,
    } as const),
    setCargoFilterValue: (value: string ) => ({
        type: 'filters-store-reducer/SET-CARGO-FILTER-VALUE',
        value
    } as const),
    setCargoFilterMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-CARGO-FILTER-MODE',
        mode,
    } as const),
    setNearDriverMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-NEAR-DRIVER-MODE',
        mode,
    } as const),
    setClearFilter: (initial: FiltersStoreReducerStateType) => ({
        type: 'filters-store-reducer/SET-CLEAR-FILTER',
        initial,
    } as const),
    setClearFilterMode: (mode: boolean) => ({
        type: 'filters-store-reducer/SET-CLEAR-FILTER-MODE',
        mode,
    } as const),

}

/* САНКИ */

export type FiltersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): FiltersStoreReducerThunkActionType =>
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

