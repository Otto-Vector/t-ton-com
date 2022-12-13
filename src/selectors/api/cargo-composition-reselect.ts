import {AppStateType} from '../../redux/redux-store'
import {CargoCopmpositionStoreReducerStateType} from '../../redux/api/cargo-composition-response-reducer';


type CargoCompositionSelectors<T extends keyof Y, Y = CargoCopmpositionStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getCargoCompositionSelectorStore: CargoCompositionSelectors<'cargoComposition'> = ( state ) => state.cargoCompositionStoreReducer.cargoComposition

