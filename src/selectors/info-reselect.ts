import {AppStateType} from '../redux/redux-store'
import {InfoStoreReducerStateType} from '../redux/info-store-reducer';
import {createSelector} from 'reselect';

type InfoStoreSelectors<T extends keyof Y, Y = InfoStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsFetchingInfoStore: InfoStoreSelectors<'isFetching'> = (state) => state.infoStoreReducer.isFetching
export const getContentInfoStore: InfoStoreSelectors<'content'> = (state) => state.infoStoreReducer.content

// export const getUnreadMessagesCountInfoStore: InfoStoreSelectors<'unreadMessages'> = (state) => state.infoStoreReducer.unreadMessages

export const getUnreadMessagesCountInfoStore = createSelector( getContentInfoStore,
    ( content  ): number => {
        return content.reduce(
            (count, item)=>count+(item.viewed?0:1),0)
    } )