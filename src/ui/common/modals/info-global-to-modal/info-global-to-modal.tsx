import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import './modal-animations.css' // вырезал анимации для модалки
import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
import './info-global-to-modal.scss' // перезапись стилей
import {Modal} from 'antd'
import {
    getActionGlobalModalStore,
    getChildrenGlobalModalStore,
    getIsBodyPaddingVisibleGlobalModalStore,
    getIsFooterVisibleGlobalModalStore,
    getIsTitleVisibleGlobalModalStore,
    getNavigateToCancelGlobalModalStore,
    getNavigateToOkGlobalModalStore,
    getTextGlobalModalStore,
    getTimeToDeactivateGlobalModalStore,
    getTitleGlobalModalStore,
} from '../../../../selectors/utilites/global-modal-reselect'
import {To, useNavigate} from 'react-router-dom'
import {textFromArrayToParagraph} from './text-from-array-to-paragraph/text-from-array-to-paragraph'
import {ModalFooter} from './modal-footer/modal-footer'
import {CancelXButton} from '../../buttons/cancel-button/cancel-x-button'
import {globalModalDestroy} from '../../../../redux/utils/global-modal-store-reducer'


export const InfoGlobalToModal: React.ComponentType = () => {

    const textToGlobalModal = useSelector(getTextGlobalModalStore)
    const reactChildren = useSelector(getChildrenGlobalModalStore)
    const actionOnOk = useSelector(getActionGlobalModalStore)
    const navToOnOk = useSelector(getNavigateToOkGlobalModalStore)
    const navToOnCancel = useSelector(getNavigateToCancelGlobalModalStore)
    const title = useSelector(getTitleGlobalModalStore)
    const timeToDeactivate = useSelector(getTimeToDeactivateGlobalModalStore)
    const isFooterEnable = useSelector(getIsFooterVisibleGlobalModalStore)
    const isTitleEnable = useSelector(getIsTitleVisibleGlobalModalStore)
    const isBodyPadding = useSelector(getIsBodyPaddingVisibleGlobalModalStore)
    // const activeGlobalModalsList = useSelector(geActivetModalsListGlobalModalStore)

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
        dispatch<any>(globalModalDestroy())
    }

    const onOkHandle = () => {
        onCloseLocal()
        // выполняем прокинутый экшон (если он есть)
        actionOnOk && actionOnOk()
        navToOnOk && navigate(navToOnOk as To)
    }

    const onCancelHandle = () => {
        onCloseLocal()
        navToOnCancel && navigate(navToOnCancel as To)
    }

    // const afterClose = () => {
    //     console.log('закрыли: ')
    // }

    const titleHere: string | 'Вопрос' | 'Информация' | undefined = isTitleEnable
        ? ( title || ( ( actionOnOk || navToOnOk ) ? 'Вопрос' : 'Информация' ) )
        : undefined

    useEffect(() => {
            // активируется при наличии данных
            setVisible(!!textToGlobalModal || !!reactChildren)
        },
        [ textToGlobalModal, reactChildren ])

    useEffect(() => {
        // активируем один раз
        if (timeToDeactivate && !isOneTimeActivated) {
            setIsOneTimeActivated(true)
            setTimeToKillModal(setTimeout(() => {
                onCloseLocal()
            }, timeToDeactivate))
        }
    }, [ timeToDeactivate ])

    const isCentered = !!reactChildren

    return (
        <Modal title={ titleHere }
               centered={ isCentered }
               open={ visible }
               onCancel={ onCancelHandle }
               bodyStyle={ !isBodyPadding ? { padding: 0 } : undefined }
               width={ !isBodyPadding ? 'auto' : undefined }
            // onOk={ onOkHandle }
            // afterClose={ afterClose }
               className={ 'modalStyle' }
               closeIcon={ <CancelXButton onCancelClick={ onCancelHandle } isNotButtonButSpan={ true }/> }
               destroyOnClose={ true }
               footer={ isFooterEnable ? <ModalFooter
                   onCancelHandle={ onCancelHandle }
                   onOkHandle={ onOkHandle }
                   isCancelButtonEnable={ titleHere !== 'Информация' }
               /> : null }>
            { textToGlobalModal && textFromArrayToParagraph(textToGlobalModal) }
            { reactChildren }
        </Modal>
    )
}
