import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';
// сейчас они прописаны на ui компоненте
// import 'antd/lib/style/index.css' // используем core стили antd
// import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
// import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import {Modal} from 'antd';
import {
    getActionGlobalModalStore,
    getNavigateToOkGlobalModalStore,
    getTextGlobalModalStore,
} from '../../../selectors/utils/global-modal-reselect';
import {useNavigate} from 'react-router-dom';


export const InfoGlobalToModal: React.FC = () => {

    const textToGlobalModal = useSelector(getTextGlobalModalStore)
    const action = useSelector(getActionGlobalModalStore)
    const navToOnOkHandle = useSelector(getNavigateToOkGlobalModalStore)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ visible, setVisible ] = useState(false)

    const onCloseLocal = () => {
        setVisible(false)
        dispatch(globalModalStoreActions.setTextMessage(''))
        dispatch(globalModalStoreActions.setAction(null))
        dispatch(globalModalStoreActions.setNavigateToOk(''))
    }

    const onOkHandle = () => {
        onCloseLocal()
        // выполняем прокинутый экшон (если он есть)
        action && dispatch<any>(action())
        navToOnOkHandle && navigate(navToOnOkHandle)
    }

    const onCancelHandle = () => {
        onCloseLocal()
    }

    useEffect(() => {
        setVisible(!!textToGlobalModal)
    }, [ textToGlobalModal ])


    return (
        <Modal title={ ( action || navToOnOkHandle ) ? 'Вопрос' : 'Информация' }
               visible={ visible }
               onOk={ onOkHandle }
               onCancel={ onCancelHandle }
            // closeIcon={<Preloader/>}
        >
            <p>{ textToGlobalModal }</p>
        </Modal>

    )
}
