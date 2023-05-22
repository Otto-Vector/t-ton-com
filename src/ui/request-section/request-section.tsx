import React, {useCallback, useEffect, useMemo, useState} from 'react'
import styles from './request-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {To, useLocation, useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {deleteCurrentRequestAPI, getOneRequestsAPI, setNewRequestAPI} from '../../redux/forms/request-store-reducer'
import {getInitialValuesRequestStore, getIsFetchingRequestStore} from '../../selectors/forms/request-form-reselect'
import {CancelXButton} from '../common/cancel-button/cancel-x-button'
import {RequestFormDocumentsRight} from './request-form-documents-right/request-form-documents-right'
import {RequestMapCenter} from './request-map-center/request-map-center'
import {RequestFormLeft} from './request-form-left/request-form-left'
import {ddMmYearFormat} from '../../utils/date-formats'
import {SizedPreloader} from '../common/preloader/preloader'
import {valuesAreEqual} from '../../utils/reactMemoUtils'
import {getInitialValuesEmployeesStore} from '../../selectors/options/employees-reselect'
import {toNumber} from '../../utils/parsers'
import {getAuthIdAuthStore} from '../../selectors/auth-reselect'

// type OwnProps = { }

export type RequestModesType = { isCreateMode: boolean, isStatusMode: boolean, isHistoryMode: boolean, isAcceptDriverMode: boolean }
export type RoleModesType = {
    // заказчик
    isCustomer: boolean
    // грузоотправитель
    isSender: boolean
    // получатель
    isRecipient: boolean
    // перевозчик
    isCarrier: boolean
}
export const RequestSection: React.FC = React.memo(() => {

    const [ tabModes, setTabModes ] = useState({ left: false, center: false, right: false })
    const setActiveTab = useCallback(( tab: 'left' | 'center' | 'right' ) => {
        setTabModes({ ...{ left: false, center: false, right: false }, [tab]: true })
    }, [])

    const [ isFirstRender, setIsFirstRender ] = useState(true)

    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()

    // статусы входа в просмотр/редактирование заявки
    const requestModes: RequestModesType = useMemo(() => ( {
        isCreateMode: pathname.includes(routes.requestInfo.create),
        isStatusMode: pathname.includes(routes.requestInfo.status),
        isHistoryMode: pathname.includes(routes.requestInfo.history),
        isAcceptDriverMode: pathname.includes(routes.requestInfo.accept),
    } ), [ pathname ])
    const { isCreateMode, isStatusMode, isAcceptDriverMode, isHistoryMode } = requestModes

    const userID = useSelector(getAuthIdAuthStore)


    const isFetching = useSelector(getIsFetchingRequestStore)
    const initialValues = useSelector(getInitialValuesRequestStore)
    const oneEmployee = useSelector(getInitialValuesEmployeesStore)

    // статус отношения пользователя к заявке
    const roleModes = {
        // заказчик
        isCustomer: userID === initialValues.idUserCustomer,
        // грузоотправитель
        isSender: userID === initialValues.idUserSender,
        // получатель
        isRecipient: userID === initialValues.recipientUser,
        // перевозчик
        isCarrier: userID === initialValues.requestCarrierUser,
    }

    const dispatch = useDispatch()

    const cancelNavigate = (): To =>
        isAcceptDriverMode ? routes.searchList
            : isStatusMode ? routes.requestsList
                : isHistoryMode ? routes.historyList
                    : -1 as To


    const onCancelButton = () => {
        if (isCreateMode) {
            dispatch<any>(deleteCurrentRequestAPI({ requestNumber: toNumber(initialValues.requestNumber) }))
        }
        navigate(cancelNavigate())
    }


    useEffect(() => {// должен сработать ТОЛЬКО один раз
        if (isFirstRender) {
            setActiveTab('left')
            if (isCreateMode) {
                // создаём пустую и записываем номер заявки
                dispatch<any>(setNewRequestAPI())
            }
            if (isStatusMode || isAcceptDriverMode || isHistoryMode) {
                // прогружаем искомую заявку
                dispatch<any>(getOneRequestsAPI(toNumber(reqNumber), true))
            }
            setIsFirstRender(false)
        }
    }, [ isFirstRender ])


    if (!isCreateMode && !initialValues.requestNumber) return <div>
        <br/><br/> { 'ДАННАЯ ЗАЯВКА НЕДОСТУПНА !' }
    </div>

    return (
        <section className={ styles.requestSection }>
            <div className={ styles.requestSection__subWrapper }>
                <div className={ styles.requestSection__wrapper }>
                    { isFetching ? <SizedPreloader sizeHW={ '400px' } marginH={ '25%' }/> :
                        <>
                            <header className={ styles.requestSection__header }>
                                { `Заявка №${ initialValues.requestNumber } от ${ ddMmYearFormat(initialValues.requestDate) }` }
                            </header>
                            <div
                                className={ !tabModes.center ? styles.requestSection__formsWrapper : styles.requestSection__mapsWrapper }>
                                { tabModes.left && <RequestFormLeft requestModes={ requestModes }
                                                                    initialValues={ initialValues }
                                                                    roleModes={ roleModes }
                                /> }
                                { tabModes.center && <RequestMapCenter requestModes={ requestModes }
                                                                       driver={ oneEmployee }
                                                                       fromCity={ initialValues?.sender?.city }
                                                                       toCity={ initialValues?.recipient?.city }
                                /> }
                                { tabModes.right && <RequestFormDocumentsRight requestModes={ requestModes }
                                                                               roleModes={ roleModes }
                                /> }
                            </div>

                            <CancelXButton onCancelClick={ onCancelButton } mode={ 'blueAlert' }/>
                        </> }
                </div>
                <div className={ styles.requestSection__bottomTabsPanel }>
                    <div className={ styles.requestSection__bottomTabsItem + ' ' +
                        ( tabModes.left && styles.requestSection__bottomTabsItem_active ) }
                         onClick={ () => setActiveTab('left') }>
                        { 'Данные' }
                    </div>
                    <div className={ styles.requestSection__bottomTabsItem + ' ' +
                        ( tabModes.center && styles.requestSection__bottomTabsItem_active ) }
                         onClick={ () => setActiveTab('center') }>
                        { 'Маршрут' }
                    </div>
                    <div className={ styles.requestSection__bottomTabsItem +
                        ( tabModes.right ? ' ' + styles.requestSection__bottomTabsItem_active : '' ) +
                        ( ( isCreateMode || isAcceptDriverMode ) ? ' ' + styles.requestSection__bottomTabsItem_disabled : '' ) }
                         onClick={ () => ( isCreateMode || isAcceptDriverMode ) ? undefined : setActiveTab('right') }>
                        { 'Документы' }
                    </div>
                </div>
            </div>
        </section>
    )
}, valuesAreEqual)
