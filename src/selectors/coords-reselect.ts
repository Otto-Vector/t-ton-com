import {AppStateType} from '../redux/redux-store'
import {CoordsStoreReducerStateType} from '../redux/coords-store-reducer';


type CoordsStoreSelectors<T extends keyof Y, Y = CoordsStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getFormCoordinatesCoordsStore: CoordsStoreSelectors<'formCoordinates'> = ( state) => state.coordsStoreReducer.formCoordinates
