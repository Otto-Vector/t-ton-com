import {ThunkAction} from "redux-thunk";
import {ActionsAnyType, AppStateType, GetActionsTypes} from "./redux-store";

const initialState = {
  initialazed: false,
}

export type AppReducerStateType = typeof initialState
type ActionsType = GetActionsTypes<typeof appActions>

export const appStoreReducer = (state = initialState,
                    action: ActionsType) : AppReducerStateType => {

  switch (action.type) {

    case 'app-reducer/SET_INITIALIZED' : {
      return {
        ...state,
        initialazed: true
      }
    }

    default : {
      // возвращаем вообще без изменений
      return state
    }
  }

}


/* ЭКШОНЫ */
const appActions: ActionsAnyType = {
  // при обращении, изменяет стейт initialazed на true
  setInitialazedSuccess: () => ({type: 'app-reducer/SET_INITIALIZED'} as const),
}


/* САНКИ */
// конструктор для типов санок
export type InitializedThunkActionType = ThunkAction<void, AppStateType, unknown, ActionsType>

// просто ещё один Промис для кучи
const sleep = (ms: number) : Promise<Function> => new Promise(resolve => setTimeout(resolve, ms))

// запускаем комбайн загрузок/обращений к API
export const initializedAll = (): InitializedThunkActionType =>
  (dispatch) => {
    // let promise = dispatch(getAuth())
    let promise2 = sleep(100)
    // let friends = dispatch(getResponseFriends())

    Promise.all([
        // promise,
        promise2,
        // friends
      ])
      .then(() => {
        dispatch(appActions.setInitialazedSuccess())
      })
}
