import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer'
// сейчас они прописаны на ui компоненте
// import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import './modal-animations.css' // вырезал нужные анимации для модалки
import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
import './info-global-to-modal.scss'
import {Modal} from 'antd'
import {
    getActionGlobalModalStore,
    getNavigateToCancelGlobalModalStore,
    getNavigateToOkGlobalModalStore,
    getTextGlobalModalStore,
    getTimeToDeactivateGlobalModalStore,
    getTitleGlobalModalStore,
} from '../../../selectors/utils/global-modal-reselect'
import {useNavigate} from 'react-router-dom'
import {textFromArrayToParagraph} from './text-from-array-to-paragraph/text-from-array-to-paragraph'
import {ModalFooter} from './modal-footer/modal-footer'
import {ModalCloseIcon} from './modal-close-icon/modal-close-icon'


export const InfoGlobalToModal: React.FC = () => {

    const textToGlobalModal = useSelector(getTextGlobalModalStore)
    const actionOnOk = useSelector(getActionGlobalModalStore)
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
        // выполняем прокинутый экшон (если он есть)
        actionOnOk && actionOnOk()
        navToOnOk && navigate(navToOnOk)
    }

    const onCancelHandle = () => {
        onCloseLocal()
        navToOnCancel && navigate(navToOnCancel)
    }

    const titleHere: string | 'Вопрос' | 'Информация' = title || ( ( actionOnOk || navToOnOk ) ? 'Вопрос' : 'Информация' )

    useEffect(() => {
        // активируется при наличии данных
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
            // centered={ true }
               visible={ visible }
               onCancel={ onCancelHandle }
            // onOk={ onOkHandle }
               className={ 'modalStyle' }
               closeIcon={ ModalCloseIcon }
               footer={ ModalFooter({
                   onCancelHandle,
                   onOkHandle,
                   isCancelButtonEnable: titleHere !== 'Информация',
               })}
        >
            { textFromArrayToParagraph(textToGlobalModal) }
            {/*{ textToGlobalModal }*/}
        </Modal>
    )
}
