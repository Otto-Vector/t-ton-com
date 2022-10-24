import React from 'react'
import styles from './menu-panel.module.scss'

import {useDispatch, useSelector} from 'react-redux'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {NavLink, useLocation} from 'react-router-dom';
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

import {getIsAuthAuthStore} from '../../selectors/auth-reselect';
import {getUnreadMessagesCountInfoStore} from '../../selectors/info-reselect';
import {logoutAuth} from '../../redux/auth-store-reducer';
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer';
import {requestStoreActions} from '../../redux/forms/request-store-reducer';
import {getIsReqErrorRequisitesStore} from '../../selectors/options/requisites-reselect';


type OwnProps = {}

export const MenuPanel: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const isAuth = useSelector(getIsAuthAuthStore)
    const isRequisitesError = useSelector(getIsReqErrorRequisitesStore)
    const unreadMessagesCount = useSelector(getUnreadMessagesCountInfoStore)
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const newRequestRoute = routes.requestInfo.create + 'new'
    const isNewRegistrationRoute = pathname === routes.requisites + 'new'

    const logout = async () => {
        await dispatch<any>(textAndActionGlobalModal({
            text: 'ВЫ ДЕЙСТВИТЕЛЬНО ХОТИТЕ ВЫЙТИ?',
            action: logoutAuth,
        }))
    }

    const newRequest = async () => {
        dispatch(requestStoreActions.setIsNewRequest(true))
        dispatch(requestStoreActions.setCurrentDistance(null))
        await dispatch<any>(textAndActionGlobalModal({
            text: 'СОЗДАТЬ НОВУЮ ЗАЯВКУ?',
            navigateOnOk: newRequestRoute,
        }))
    }

    const requisitesMustBeFilled = async () => {
        await dispatch<any>(textAndActionGlobalModal({
            title: 'Внимание!',
            text: 'НЕОБХОДИМО ЗАПОЛНИТЬ ДАННЫЕ РЕКВИЗИТОВ!',
            navigateOnOk: routes.requisites + 'new',
            navigateOnCancel: routes.requisites + 'new',
        }))
    }
    // вынес за пределы NavLink назначение классов
    const activeClass = ( { isActive }: { isActive: boolean } ): string =>
        `${ styles.menuPanel__item } ${ isActive
            ? styles.menuPanel__item_active : styles.menuPanel__item_unactive }`

    // легче редактировать и меньше кода на перебор
    const menuItems = [
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
            route: routes.map, src: mapSVG, title: 'Карта маршрутов',
            buttonText: 'Карта', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.options, src: optionsPNG, title: 'Панель настроек (админ)',
            buttonText: 'Настройки', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.info, src: infoSVG, title: 'Информация / События',
            buttonText: 'Инфо', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
        {
            route: routes.test, src: testPNG, title: 'Для тестов отрисовки компонентов',
            buttonText: 'Тест', active: !isNewRegistrationRoute && isAuth,
            action: null,
        },
    ]

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
                                 // отключаем переход до выполнения экшона
                                 e.preventDefault()
                                 await requisitesMustBeFilled()
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
}
