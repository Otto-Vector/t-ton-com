import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {addOneDay, ddMmFormat} from '../../utils/date-formats'
import {GetActionsTypes} from '../../types/ts-utils'


const date = new Date()

export const initialFiltersState = {
    buttons: {
        statusFilter: {
            title: 'Статус заявки',
            mode: false,
        },
        cargoFilter: {
            title: 'Тип груза',
            mode: false,
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
        globalFilter: {
            title: 'Глобальный Фильтр',
            mode: true,
        },
        clearFilters: {
            title: 'Без Фильтра',
            mode: true,
        },
    },
    globalFilterValue: '',
    values: {
        dayFilter: undefined as undefined | Date,
        routeFilter: [ 0, 99999 ],
        cargoFilter: '',
        statusFilter: '',
    },
}

export type FiltersStoreReducerStateType = typeof initialFiltersState

type ActionsType = GetActionsTypes<typeof filtersStoreActions>

export const filtersStoreReducer = ( state = initialFiltersState, action: ActionsType ): FiltersStoreReducerStateType => {

    switch (action.type) {

        case 'filters-store-reducer/SET-GLOBAL-FILTER': {
            return {
                ...state,
                globalFilterValue: action.value,
            }
        }
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
                    todayFilter: { ...state.buttons.todayFilter, mode: action.mode },
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
                    tomorrowFilter: { ...state.buttons.tomorrowFilter, mode: action.mode },
                },
            }
        }
        case 'filters-store-reducer/SET-SHORT-ROUTE-FILTER': {
            return {
                ...state,
                values: {
                    ...state.values,
                    routeFilter: state.buttons.shortRouteFilter.mode ? [ 0, 100 ] : [ 0, 99999 ],
                },
            }
        }
        case 'filters-store-reducer/SET-SHORT-ROUTE-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    shortRouteFilter: { ...state.buttons.shortRouteFilter, mode: action.mode },
                },
            }
        }
        case 'filters-store-reducer/SET-LONG-ROUTE-FILTER': {
            return {
                ...state,
                values: {
                    ...state.values,
                    routeFilter: state.buttons.longRouteFilter.mode ? [ 100, 99999 ] : [ 0, 99999 ],
                },
            }
        }
        case 'filters-store-reducer/SET-LONG-ROUTE-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    longRouteFilter: { ...state.buttons.longRouteFilter, mode: action.mode },
                },
            }
        }
        case 'filters-store-reducer/SET-GLOBAL-FILTER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    globalFilter: { ...state.buttons.globalFilter, mode: action.mode },
                },
            }
        }
        case 'filters-store-reducer/SET-CARGO-FILTER-VALUE': {
            return {
                ...state,
                values: {
                    ...state.values,
                    cargoFilter: action.value,
                },
            }
        }
        case 'filters-store-reducer/SET-CARGO-FILTER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    cargoFilter: { ...state.buttons.cargoFilter, mode: action.mode },
                },
            }
        }
        case 'filters-store-reducer/SET-STATUS-FILTER-VALUE': {
            return {
                ...state,
                values: {
                    ...state.values,
                    statusFilter: action.value,
                },
            }
        }
        case 'filters-store-reducer/SET-STATUS-FILTER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    statusFilter: { ...state.buttons.statusFilter, mode: action.mode },
                },
            }
        }
        case 'filters-store-reducer/SET-CLEAR-FILTER-MODE': {
            return {
                ...state,
                buttons: {
                    ...state.buttons,
                    clearFilters: { ...state.buttons.clearFilters, mode: action.mode },
                },
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
    setGlobalFilter: ( value: string ) => ( {
        type: 'filters-store-reducer/SET-GLOBAL-FILTER',
        value,
    } as const ),
    setGlobalFilterMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-GLOBAL-FILTER-MODE',
        mode,
    } as const ),
    setTodayFilter: () => ( {
        type: 'filters-store-reducer/SET-TODAY-FILTER',
    } as const ),
    setTodayMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-TODAY-MODE',
        mode,
    } as const ),
    setTomorrowFilter: () => ( {
        type: 'filters-store-reducer/SET-TOMORROW-FILTER',
    } as const ),
    setTomorrowMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-TOMORROW-MODE',
        mode,
    } as const ),
    setShortRouteFilter: () => ( {
        type: 'filters-store-reducer/SET-SHORT-ROUTE-FILTER',
    } as const ),
    setShortRouteMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-SHORT-ROUTE-MODE',
        mode,
    } as const ),
    setLongRouteFilter: () => ( {
        type: 'filters-store-reducer/SET-LONG-ROUTE-FILTER',
    } as const ),
    setLongRouteMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-LONG-ROUTE-MODE',
        mode,
    } as const ),
    setCargoFilterValue: ( value: string ) => ( {
        type: 'filters-store-reducer/SET-CARGO-FILTER-VALUE',
        value,
    } as const ),
    setCargoFilterMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-CARGO-FILTER-MODE',
        mode,
    } as const ),
    setStatusFilterValue: ( value: string ) => ( {
        type: 'filters-store-reducer/SET-STATUS-FILTER-VALUE',
        value,
    } as const ),
    setStatusFilterMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-STATUS-FILTER-MODE',
        mode,
    } as const ),
    setClearFilter: ( initial: FiltersStoreReducerStateType ) => ( {
        type: 'filters-store-reducer/SET-CLEAR-FILTER',
        initial,
    } as const ),
    setClearFilterMode: ( mode: boolean ) => ( {
        type: 'filters-store-reducer/SET-CLEAR-FILTER-MODE',
        mode,
    } as const ),

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
