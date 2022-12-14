import React from 'react'
import './App.scss'
import {UiComponent} from './ui/ui-component'
import store from './redux/redux-store'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {YMaps} from 'react-yandex-maps'


const { REACT_APP_YANDEX_KEY } = process.env

const App: React.FC = () => {
    return (
        <Provider store={ store }>
            <YMaps
                version={ '2.1.79' }
                query={
                    {
                        // apikey: REACT_APP_YANDEX_KEY,
                        lang: 'ru_RU',
                        coordorder: 'latlong',
                    }
                }
            >
                <BrowserRouter>
                    <div className="container">
                        <UiComponent/>
                    </div>
                </BrowserRouter>
            </YMaps>
        </Provider>
    )
}

export default App
