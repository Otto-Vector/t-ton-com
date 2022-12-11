import {GetActionsTypes} from '../../types/ts-utils';

const initialState = {
    isLightBoxOpen: false as boolean,
    image: '' as string | undefined,
}

export type LightboxStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof lightBoxStoreActions>

export const lightBoxStoreReducer = ( state = initialState, action: ActionsType ): LightboxStoreReducerStateType => {

    switch (action.type) {


        case 'lightBox-store-reducer/SET-IS-OPEN': {
            return {
                ...state,
                isLightBoxOpen: true,
            }
        }
        case 'lightBox-store-reducer/SET-IS-CLOSE': {
            return {
                ...state,
                isLightBoxOpen: false,
            }
        }
        case 'lightBox-store-reducer/SET-IMAGE': {
            return {
                ...state,
                isLightBoxOpen: true,
                image: action.image,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const lightBoxStoreActions = {

    setLightBoxOpen: () => ( {
        type: 'lightBox-store-reducer/SET-IS-OPEN',
    } as const ),
    setLightBoxClose: () => ( {
        type: 'lightBox-store-reducer/SET-IS-CLOSE',
    } as const ),
    setLightBoxImage: ( image: string ) => ( {
        type: 'lightBox-store-reducer/SET-IMAGE',
        image,
    } as const ),
}
