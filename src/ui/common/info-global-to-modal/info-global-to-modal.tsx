import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';
// сейчас они прописаны на ui компоненте
import 'antd/lib/style/index.css' // используем core стили antd
import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфо-окон
import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import {Modal} from 'antd';
import {
    getActionGlobalModalStore,
    getNavigateToCancelGlobalModalStore,
    getNavigateToOkGlobalModalStore,
    getTextGlobalModalStore,
    getTitleGlobalModalStore,
} from '../../../selectors/utils/global-modal-reselect';
import {useNavigate} from 'react-router-dom';


const textFromArrayToParagraph = ( text: string | string[] ) => {
    if (typeof text === 'string') return <p>{ text }</p>
    return text.map(( line, index, textArr ) =>
        <p style={ { marginBottom: index + 1 === textArr.length ? '0' : '.5rem' } } key={ line }>{ line }</p>)
}

export const InfoGlobalToModal: React.FC = () => {

    const textToGlobalModal = useSelector(getTextGlobalModalStore)
    const action = useSelector(getActionGlobalModalStore)
    const navToOnOk = useSelector(getNavigateToOkGlobalModalStore)
    const navToOnCancel = useSelector(getNavigateToCancelGlobalModalStore)
    const title = useSelector(getTitleGlobalModalStore)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ visible, setVisible ] = useState(false)

    const onCloseLocal = () => {
        setVisible(false)
        dispatch(globalModalStoreActions.resetAllValues())
    }

    const onOkHandle = () => {
        onCloseLocal()
        // выполняем прокинутый экшон (если он есть)
        action && dispatch<any>(action())
        navToOnOk && navigate(navToOnOk)
    }

    const onCancelHandle = () => {
        onCloseLocal()
        navToOnCancel && navigate(navToOnCancel)
    }

    const titleHere = title || ( ( action || navToOnOk ) ? 'Вопрос' : 'Информация' )

    useEffect(() => {
        setVisible(!!textToGlobalModal)
    }, [ textToGlobalModal ])


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
