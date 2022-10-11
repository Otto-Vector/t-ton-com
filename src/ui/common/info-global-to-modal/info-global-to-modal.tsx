import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from '../../../redux/redux-store';
import {appActions} from '../../../redux/app-store-reducer';
// import 'antd/lib/style/index.css' // используем core стили antd
// import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфоокон
// import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import {Modal} from 'antd';


export const InfoGlobalToModal: React.FC = ( ) => {
  const textToGlobalModal = useSelector((state:AppStateType)=> state.appStoreReducer.modalGlobalTextMessage)
    const dispatch = useDispatch()

    const isGlobal = !!textToGlobalModal
    const [ visible, setVisible ] = useState(isGlobal)

    const onCloseLocal = () => {
        setVisible(false)
        dispatch(appActions.setModalGlobalTextMessage(''))
    }

    return (
            <Modal title={ 'Информация' }
                   visible={ visible }
                   onOk={ onCloseLocal }
                   onCancel={ onCloseLocal }
            >
                <p>{ textToGlobalModal}</p>
            </Modal>

    )
}
