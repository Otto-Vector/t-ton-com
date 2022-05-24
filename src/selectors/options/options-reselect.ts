import {AppStateType} from '../../redux/redux-store'
import {OptionsLabelType, OptionsStoreReducerStateType} from '../../redux/options/options-store-reducer';
import { createSelector } from 'reselect'
import {getAllShippersStore} from './shippers-reselect';
import {ShippersCardType} from '../../types/form-types';

type OptionsStoreSelectors<T extends keyof Y, Y = OptionsStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getShippersTitlesOptionsStore: OptionsStoreSelectors<'shippers'> = (state) => state.optionsStoreReducer.shippers
export const getEmployeesOptionsStore: OptionsStoreSelectors<'employees'> = (state) => state.optionsStoreReducer.employees
export const getTransportOptionsStore: OptionsStoreSelectors<'transport'> = (state) => state.optionsStoreReducer.transport
export const getTrailerOptionsStore: OptionsStoreSelectors<'trailer'> = (state) => state.optionsStoreReducer.trailer
export const getConsigneesOptionsStore: OptionsStoreSelectors<'consignees'> = (state) => state.optionsStoreReducer.consignees


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
export const getShippersOptionsStore = createSelector( getAllShippersStore,
    ( shippers: ShippersCardType[]  ): OptionsLabelType[] => {
        return shippers.map(({id, title})=>({id, title}))
    } )
