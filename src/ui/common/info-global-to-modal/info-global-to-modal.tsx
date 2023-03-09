import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer'
// сейчас они прописаны на ui компоненте
// import 'antd/lib/style/modal-animations.css' // используем core стили antd
import './modal-animations.css'
import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
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
import {Button} from '../button/button'
import {MaterialIcon} from '../material-icon/material-icon'


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

    const titleHere = title || ( ( actionOnOk || navToOnOk ) ? 'Вопрос' : 'Информация' )

    const footer =
        <div style={ { display: 'flex', justifyContent: 'flex-end', height: '30px'} }>
            { titleHere !== 'Информация' ?
                <Button title={ 'Отмена' }
                        colorMode={ 'blueAlert' }
                        onClick={ onCancelHandle }
                        style={ { width: '100px', margin: '0 5px' } }/>
                : null }
            <Button title={ 'Ok' }
                    colorMode={ 'blue' }
                    onClick={ onOkHandle }
                    style={ { width: '100px', margin: '0 5px' } }/>
        </div>

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
               className={ 'modalStyle' }
               closeIcon={ <MaterialIcon icon_name={ 'highlight_off' }
                                         style={ { fontSize: '23px', color: '#023e8a' } }/> }
            // centered={ true }
               footer={ footer }
        >
            { textFromArrayToParagraph(textToGlobalModal) }
        </Modal>
    )
}
