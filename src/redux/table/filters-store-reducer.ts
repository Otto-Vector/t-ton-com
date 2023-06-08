import {addOneDay, ddMmFormat} from '../../utils/date-formats'
import {GetActionsTypes} from '../../types/ts-utils'
import { TableModesType } from '../../types/form-types'


const todayDate = new Date()

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
            title: 'Сегодня ' + ddMmFormat(todayDate),
            mode: false,
        },
        tomorrowFilter: {
            title: 'Завтра ' + ddMmFormat(addOneDay(todayDate)),
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
            mode: false,
        },
        clearFilters: {
            title: 'Без Фильтра',
            mode: true,
        },
    },
    values: {
        dayFilter: undefined as undefined | Date,
        routeFilter: [ 0, 99999 ],
        cargoFilter: '',
        statusFilter: '',
        globalFilterValue: '',
    },
}

const modesInitial = {
    search: JSON.parse(JSON.stringify(initialFiltersState)) as typeof initialFiltersState,
    history: JSON.parse(JSON.stringify(initialFiltersState)) as typeof initialFiltersState,
    status: JSON.parse(JSON.stringify(initialFiltersState)) as typeof initialFiltersState,
}

export type FiltersStoreReducerStateType = typeof modesInitial

type ActionsType = GetActionsTypes<typeof filtersStoreActions>

export const filtersStoreReducer = ( state = modesInitial, action: ActionsType ): FiltersStoreReducerStateType => {

    switch (action.type) {

        case 'filters-store-reducer/SET-GLOBAL-FILTER': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        globalFilterValue: action.value,
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-TODAY-FILTER': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        dayFilter: state[action.tableMode].buttons.todayFilter.mode ? todayDate : undefined,
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-TODAY-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        todayFilter: { ...state[action.tableMode].buttons.todayFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-TOMORROW-FILTER': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        dayFilter: state[action.tableMode].buttons.tomorrowFilter.mode ? addOneDay(todayDate) : undefined,
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-TOMORROW-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        tomorrowFilter: { ...state[action.tableMode].buttons.tomorrowFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-SHORT-ROUTE-FILTER': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        routeFilter: state[action.tableMode].buttons.shortRouteFilter.mode ? [ 0, 100 ] : [ 0, 99999 ],
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-SHORT-ROUTE-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        shortRouteFilter: { ...state[action.tableMode].buttons.shortRouteFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-LONG-ROUTE-FILTER': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        routeFilter: state[action.tableMode].buttons.longRouteFilter.mode ? [ 100, 99999 ] : [ 0, 99999 ],
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-LONG-ROUTE-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        longRouteFilter: { ...state[action.tableMode].buttons.longRouteFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-GLOBAL-FILTER-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        globalFilter: { ...state[action.tableMode].buttons.globalFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-CARGO-FILTER-VALUE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        cargoFilter: action.value,
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-CARGO-FILTER-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        cargoFilter: { ...state[action.tableMode].buttons.cargoFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-STATUS-FILTER-VALUE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    values: {
                        ...state[action.tableMode].values,
                        statusFilter: action.value,
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-STATUS-FILTER-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        statusFilter: { ...state[action.tableMode].buttons.statusFilter, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-CLEAR-FILTER-MODE': {
            return {
                ...state,
                [action.tableMode]: {
                    ...state[action.tableMode],
                    buttons: {
                        ...state[action.tableMode].buttons,
                        clearFilters: { ...state[action.tableMode].buttons.clearFilters, mode: action.mode },
                    },
                },
            }
        }
        case 'filters-store-reducer/SET-CLEAR-FILTER': {
            return {
                ...state,
                [action.tableMode]: {
                    ...action.initial,
                },
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const filtersStoreActions = {
    setGlobalFilter: ( value: string, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-GLOBAL-FILTER',
        value,
        tableMode,
    } as const ),
    setGlobalFilterMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-GLOBAL-FILTER-MODE',
        mode,
        tableMode,
    } as const ),
    setTodayFilter: ( tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-TODAY-FILTER',
        tableMode,
    } as const ),
    setTodayMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-TODAY-MODE',
        mode,
        tableMode,
    } as const ),
    setTomorrowFilter: ( tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-TOMORROW-FILTER',
        tableMode,
    } as const ),
    setTomorrowMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-TOMORROW-MODE',
        mode,
        tableMode,
    } as const ),
    setShortRouteFilter: ( tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-SHORT-ROUTE-FILTER',
        tableMode,
    } as const ),
    setShortRouteMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-SHORT-ROUTE-MODE',
        mode,
        tableMode,
    } as const ),
    setLongRouteFilter: ( tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-LONG-ROUTE-FILTER',
        tableMode,
    } as const ),
    setLongRouteMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-LONG-ROUTE-MODE',
        mode,
        tableMode,
    } as const ),
    setCargoFilterValue: ( value: string, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-CARGO-FILTER-VALUE',
        value,
        tableMode,
    } as const ),
    setCargoFilterMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-CARGO-FILTER-MODE',
        mode,
        tableMode,
    } as const ),
    setStatusFilterValue: ( value: string, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-STATUS-FILTER-VALUE',
        value,
        tableMode,
    } as const ),
    setStatusFilterMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-STATUS-FILTER-MODE',
        mode,
        tableMode,
    } as const ),
    setClearFilter: ( initial: typeof initialFiltersState, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-CLEAR-FILTER',
        initial,
        tableMode,
    } as const ),
    setClearFilterMode: ( mode: boolean, tableMode: TableModesType ) => ( {
        type: 'filters-store-reducer/SET-CLEAR-FILTER-MODE',
        mode,
        tableMode,
    } as const ),

}

/* САНКИ */

// export type FiltersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>
