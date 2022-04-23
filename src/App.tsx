import React from 'react'
import './App.scss'
import {UiComponent} from './ui/ui-component'
import store from './redux/redux-store'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'


const App: React.FC = () => {

    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="container">
                    <UiComponent/>
                </div>
            </BrowserRouter>
        </Provider>
    )
}

export default App
