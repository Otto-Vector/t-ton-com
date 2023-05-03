import {GetActionsTypes} from '../types/ts-utils';

const initialState = {
    routes: {
        // '/hello'
        hello: '/hello',
        // '/login'
        login: '/login',
        // '/search'
        searchList: '/search',
        // '/requests/'
        requestsList: '/requests/',
        // '/history'
        historyList: '/history',
        // добавление водителя при создании заявки "самовывоз"
        // '/request/selfExportDriverForm/'
        selfExportDriver: '/request/selfExportDriverForm/',
        // добавление водителя при создании заявки "самовывоз"
        // '/request/selfExportDriverForm/'
        selfExportDriverFromStatus: '/request/selfExportDriverFromStatus/',
        // добавление водителя при отклике на заявку
        // '/request/addDriversForm/'
        addDriver: '/request/addDriversForm/',
        requestInfo: {
            // '/request/status/'
            status: '/request/status/',
            // '/request/driver/'
            driver: '/request/driver/',
            // '/request/history/'
            history: '/request/history/',
            // '/request/create/'
            create: '/request/create/',
            // '/request/accept/'
            accept: '/request/accept/',
        },
        // '/maps'
        map: '/maps',
        maps: {
            // '/maps/address/'
            status: '/maps/status/',
            // '/maps/answers/'
            answers: '/maps/answers/',
            // '/maps/routes/'
            routes: '/maps/routes/',
        },
        // '/balance'
        balance: '/balance',
        // '/options'
        options: '/options',
        optionsEdit: {
            // '/options/shippers/'
            shippers: '/options/shippers/',
            // '/options/employees/'
            employees: '/options/employees/',
            // '/options/transport/'
            transport: '/options/transport/',
            // '/options/trailer/'
            trailer: '/options/trailer/',
            // '/options/consignees/'
            consignees: '/options/consignees/',
        },
        // '/requisites/'
        requisites: '/requisites/',
        // '/info'
        info: '/info',
        // '/download-sample-file'
        test: '/test',
    },
}

export type RoutesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof routeStoreActions>

export const routesStoreReducer = ( state = initialState, action: ActionsType ): RoutesStoreReducerStateType => {

    switch (action.type) {

        case 'base-store-reducer/CHANGE-ROUTE': {
            return {
                ...state,
                routes: { ...state.routes, [action.routeName]: action.routePath },
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const routeStoreActions = {
    // зачем-то нужно. пока не знаю зачем (пусть будет)
    setRoute: ( routeName: string, routePath: string ) => ( {
        type: 'base-store-reducer/CHANGE-ROUTE',
        routeName, routePath,
    } as const ),
}
