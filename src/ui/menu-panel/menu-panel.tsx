import React, {useMemo} from 'react'
import styles from './menu-panel.module.scss'

import {useDispatch, useSelector} from 'react-redux'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {NavLink, useLocation} from 'react-router-dom'
import loginSVG from './buttonsSVG/login.svg'
import createSVG from './buttonsSVG/create.svg'
import searchSVG from './buttonsSVG/search.svg'
import statusSVG from './buttonsSVG/status.svg'
import historySVG from './buttonsSVG/history.svg'
import mapSVG from './buttonsSVG/map.svg'
import infoSVG from './buttonsSVG/info.svg'
import optionsPNG from './buttonsSVG/options.png'
import attentionSVG from './buttonsSVG/attention.svg'
import testPNG from './buttonsSVG/test.png'
import undoSVG from './buttonsSVG/undo.svg'

import {getIsAuthAuthStore} from '../../selectors/auth-reselect'
import {getUnreadMessagesCountInfoStore} from '../../selectors/info-reselect'
import {logoutAuth} from '../../redux/auth-store-reducer'
import {globalModalDestroy, textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'
import {
    getCashRequisitesStore,
    getIsReqErrorRequisitesStore,
    getTariffsRequisitesStore,
} from '../../selectors/options/requisites-reselect'
import {valuesAreEqual} from '../../utils/reactMemoUtils'
import {syncParsers} from '../../utils/parsers'


type OwnProps = {}

export const MenuPanel: React.FC<OwnProps> = React.memo(() => {

    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const routes = useSelector(getRoutesStore)
    const newRequestRoute = routes.requestInfo.create + 'new'
    const tariffs = useSelector(getTariffsRequisitesStore)
    const cashUser = useSelector(getCashRequisitesStore)

    // проверка авторизован ли пользователь
    const isAuth = useSelector(getIsAuthAuthStore)

    // проверка на заполненность реквизитов
    const isRequisitesError = useSelector(getIsReqErrorRequisitesStore)
    const newRequisitesRoute = routes.requisites + 'new'
    const isNewRegistrationRoute = pathname === newRequisitesRoute
    const isOnAnswersMap = pathname.includes(routes.maps.answers)
    const reqNumber = isOnAnswersMap ? syncParsers.parseAllNumbers(pathname) : 0
    // проверка на непрочитанные сообщения
    const unreadMessagesCount = useSelector(getUnreadMessagesCountInfoStore)


    const logout = async () => {
        await dispatch<any>(textAndActionGlobalModal({
            text: 'ВЫ ДЕЙСТВИТЕЛЬНО ХОТИТЕ ВЫЙТИ?',
            action: () => {
                dispatch<any>(logoutAuth())
            },
        }))
    }

    const newRequest = () => {
        const isCorrectCashToCreate = +( cashUser || 0 ) >= +( tariffs?.create || 0 )
        isCorrectCashToCreate
            ?
            dispatch<any>(textAndActionGlobalModal({
                text: 'СОЗДАТЬ НОВУЮ ЗАЯВКУ?',
                navigateOnOk: newRequestRoute,
            }))
            :
            dispatch<any>(textAndActionGlobalModal({
                text: 'НЕ ХВАТАТЕ СРЕДСТВ НА СОЗДАНИЕ ЗАЯВКИ, НЕОБХОДИМО ПОПОЛНИТЬ БАЛАНС НА ' + tariffs?.create + 'руб. \n ОК - переход к оплате',
                navigateOnOk: routes.info,
            }))
    }

    const testAction = () => {
        dispatch<any>(globalModalDestroy())
    }

    const requisitesMustBeFilled = async () => {
        await dispatch<any>(textAndActionGlobalModal({
            title: 'Внимание!',
            text: 'НЕОБХОДИМО ЗАПОЛНИТЬ ДАННЫЕ РЕКВИЗИТОВ!',
            navigateOnOk: newRequisitesRoute,
            navigateOnCancel: newRequisitesRoute,
        }))
    }

    // вынес за пределы NavLink назначение классов
    const activeClass = ( { isActive }: { isActive: boolean } ): string =>
        `${ styles.menuPanel__item } ${ isActive
            ? styles.menuPanel__item_active : styles.menuPanel__item_unactive }`

    // легче редактировать и меньше кода на перебор
    const menuItems = useMemo(() => [
        {
            route: routes.login, src: loginSVG, title: `${ !isAuth ? 'Авторизация' : 'Выход' }`,
            buttonText: `${ !isAuth ? 'Вход' : 'Выход' }`, active: !isNewRegistrationRoute,
            action: !isAuth ? null : logout,
        },
        {
            route: newRequestRoute, src: createSVG, title: 'Создать заявку',
            buttonText: 'Создать', active: !isNewRegistrationRoute && isAuth,
            action: newRequest,
        },
        {
            route: routes.searchList, src: searchSVG, title: 'Поиск неактивных заявок',
            buttonText: 'Поиск', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.requestsList, src: statusSVG, title: 'Мои активные заявки',
            buttonText: 'Заявки', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.historyList, src: historySVG, title: 'Мои выполненные заявки',
            buttonText: 'История заявок', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: isOnAnswersMap ? routes.requestInfo.status + reqNumber : routes.maps.status,
            src: isOnAnswersMap ? undoSVG : mapSVG,
            title: isOnAnswersMap ? 'Назад к просмотру активной заявки № ' + reqNumber : 'Карта маршрутов',
            buttonText: isOnAnswersMap ? 'К заявкe' : 'Карта',
            active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.options, src: optionsPNG, title: 'Панель настроек',
            buttonText: 'Настройки', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.info, src: infoSVG, title: 'Информация / События',
            buttonText: 'Инфо', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.test,
            // route: routes.requestInfo.history + '76',
            // route: routes.addDriver + '60',
            // route: routes.optionsEdit.employees + 'a5e79ad8-b9b0-42ba-8ad3-ba127b22e9c3',
            src: testPNG, title: 'Для тестов отрисовки компонентов',
            buttonText: 'Тест', active: !isNewRegistrationRoute && isAuth,
            action: testAction,
        },
    ], [ isAuth, isNewRegistrationRoute, routes, newRequest, logout, isOnAnswersMap, reqNumber, pathname, testAction ])

    return (
        <nav className={ styles.menuPanel }>
            { menuItems.map(( { route, src, title, buttonText, active, action } ) =>
                active &&
                <NavLink to={ route }
                         className={ activeClass }
                         role={ 'button' }
                         title={ title }
                         key={ route + src }
                         onClick={ async ( e ) => {
                             if (isRequisitesError) {
                                 // кроме кнопки вход/выход
                                 if (route !== routes.login) {
                                     // отключаем переход до выполнения экшона
                                     e.preventDefault()
                                     await requisitesMustBeFilled()
                                 }
                             } else if (action) {
                                 e.preventDefault()
                                 await action()
                             }
                         } }>
                    <img className={ styles.menuPanel__image } src={ src } alt={ buttonText }/>
                    <div className={ styles.menuPanel__text }>{ buttonText }</div>
                    { ( buttonText === 'Инфо' && unreadMessagesCount !== 0 ) &&
                        <div className={ styles.attentionIcon }><img src={ attentionSVG } alt={ '!' }/></div> }
                </NavLink>,
            ) }
        </nav>
    )
}, valuesAreEqual)
