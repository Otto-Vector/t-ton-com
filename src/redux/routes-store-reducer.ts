import {GetActionsTypes} from './redux-store'

const initialState = {
    routes: {
        hello: '/hello',
        login: '/login',
        searchList: '/search',
        requestsList: '/requests',
        historyList: '/history',
        requestInfo: {
            status: '/request/status/',
            driver: '/request/driver/',
            history: '/request/history/',
            create: '/request/create/',
            accept: '/request/accept/',
        },
        map: '/maps',
        maps: {
            address: '/maps/address/',
            answers: '/maps/answers/',
            routes: '/maps/routes/',
        },
        balance: '/balance',
        options: '/options',
        optionsEdit: {
            shippers: '/options/shippers/',
            employees: '/options/employees/',
            transport: '/options/transport/',
            trailer: '/options/trailer/',
            consignees: '/options/consignees/',
        },
        requisites: '/requisites',
    },
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
