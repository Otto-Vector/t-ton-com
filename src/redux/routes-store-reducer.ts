import {GetActionsTypes} from './redux-store'

const initialState = {
    routes: {
        hello: '/hello',
        login: '/login',
        create: '/create',
        search: '/search',
        status: '/status',
        history: '/history',
        map: '/maps',
        options: '/options'
    }
}

export type RoutesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof routeStoreActions>

export const routesStoreReducer = (state = initialState, action: ActionsType): RoutesStoreReducerStateType => {

    switch (action.type) {

        case 'base-store-reducer/CHANGE-ROUTE': {
            return {
                ...state,
                routes: {...state.routes, [action.routeName]: action.routePath},
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const routeStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setRoute: (routeName: string, routePath: string) => ({
        type: 'base-store-reducer/CHANGE-ROUTE',
        routeName, routePath,
    } as const),
}
