import React from 'react'
import './App.scss'
import {UiComponent} from './ui/ui-component'
import store from './redux/redux-store'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {YMaps} from 'react-yandex-maps'
import 'react-image-lightbox/style.css' //подключаем стили ligthBox в главном компоненте

const App: React.FC = () => {

    return (
        <Provider store={ store }>
            <YMaps
                version={ '2.1' }
                query={
                    {
                        apikey: 'c61f2ade-a655-4ad8-be32-5381fa8bc73b',
                        lang: 'ru_RU',
                        coordorder: 'latlong',
                    }
                }>
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
