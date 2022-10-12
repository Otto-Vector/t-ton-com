import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';
// import 'antd/lib/style/index.css' // используем core стили antd
// import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
// import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import {Modal} from 'antd';
import {useNavigate} from 'react-router-dom';
import {getNavigateToOkGlobalModalStore, getTextGlobalModalStore} from '../../../selectors/utils/global-modal-reselect';


export const InfoGlobalToModal: React.FC = () => {

    const textToGlobalModal = useSelector(getTextGlobalModalStore)
    const navToOk = useSelector(getNavigateToOkGlobalModalStore)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ visible, setVisible ] = useState(false)

    const onCloseLocal = () => {
        setVisible(false)
        dispatch(globalModalStoreActions.setTextMessage(''))
    }

    const onOkHandle = () => {
        onCloseLocal()
        dispatch(globalModalStoreActions.setNavigateToOk(''))
        navToOk && navigate(navToOk)
    }

    const onCancelHandle = ()=>{
        onCloseLocal()
    }

    useEffect(() => {
        setVisible(!!textToGlobalModal)
    }, [ textToGlobalModal ])


    return (
        <Modal title={ 'Информация' }
               visible={ visible }
               onOk={ onOkHandle }
               onCancel={ onCancelHandle }
            // closeIcon={<Preloader/>}
        >
            <p>{ textToGlobalModal }</p>
        </Modal>

    )
}
