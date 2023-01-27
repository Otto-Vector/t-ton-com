import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';
// сейчас они прописаны на ui компоненте
// import 'antd/lib/style/index.css' // используем core стили antd
import './index.css'
import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import {Modal} from 'antd';
import {
    getActionGlobalModalStore,
    getNavigateToCancelGlobalModalStore,
    getNavigateToOkGlobalModalStore,
    getTextGlobalModalStore,
    getTimeToDeactivateGlobalModalStore,
    getTitleGlobalModalStore,
} from '../../../selectors/utils/global-modal-reselect';
import {useNavigate} from 'react-router-dom';
import {textFromArrayToParagraph} from './text-from-array-to-paragraph/text-from-array-to-paragraph';


export const InfoGlobalToModal: React.FC = () => {

    const textToGlobalModal = useSelector(getTextGlobalModalStore)
    const action = useSelector(getActionGlobalModalStore)
    const navToOnOk = useSelector(getNavigateToOkGlobalModalStore)
    const navToOnCancel = useSelector(getNavigateToCancelGlobalModalStore)
    const title = useSelector(getTitleGlobalModalStore)
    const timeToDeactivate = useSelector(getTimeToDeactivateGlobalModalStore)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ visible, setVisible ] = useState(false)
    const [ isOneTimeActivated, setIsOneTimeActivated ] = useState(false)
    const [ timeToKillModal, setTimeToKillModal ] = useState<null | any>(null)

    const onCloseLocal = () => {
        // эти три команды, чтобы нормально отработать с таймером
        timeToKillModal && clearTimeout(timeToKillModal)
        setTimeToKillModal(null)
        setIsOneTimeActivated(false)

        setVisible(false)
        dispatch(globalModalStoreActions.resetAllValues())
    }

    const onOkHandle = () => {
        onCloseLocal()
        console.log('ok')
        // выполняем прокинутый экшон (если он есть)
        action && action()
        navToOnOk && navigate(navToOnOk)
    }

    const onCancelHandle = () => {
        console.log('close')
        onCloseLocal()
        navToOnCancel && navigate(navToOnCancel)
    }

    const titleHere = title || ( ( action || navToOnOk ) ? 'Вопрос' : 'Информация' )

    useEffect(() => {
        setVisible(!!textToGlobalModal)
    }, [ textToGlobalModal ])

    useEffect(() => {
        // активируем один раз
        if (timeToDeactivate && !isOneTimeActivated) {
            setIsOneTimeActivated(true)
            setTimeToKillModal(setTimeout(() => {
                onCloseLocal()
            }, timeToDeactivate))
        }
    }, [ timeToDeactivate ])

    return (
        <Modal title={ titleHere }
               visible={ visible }
               onOk={ onOkHandle }
               onCancel={ onCancelHandle }
        >
            { textFromArrayToParagraph(textToGlobalModal) }
        </Modal>
    )
}
