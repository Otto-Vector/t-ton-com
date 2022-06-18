import {GetActionsTypes} from './redux-store'


const initialState = {
    formCoordinates: [0,0]
}

export type CoordsStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof coordsStoreActions>

export const coordsStoreReducer = ( state = initialState, action: ActionsType ): CoordsStoreReducerStateType => {

    switch (action.type) {


        case 'info-store-reducer/SET-FORM-COORDS': {
            return {
                ...state,
                formCoordinates: action.formCoordinates,
            }
        }

        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const coordsStoreActions = {

    setFormCoordinates: ( formCoordinates: [number,number] ) => ( {
        type: 'info-store-reducer/SET-FORM-COORDS',
        formCoordinates,
    } as const ),

}
