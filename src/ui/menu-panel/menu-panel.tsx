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


type OwnProps = {}

export const MenuPanel: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const newRequestRoute = routes.requestInfo.create + 'new'
    const isAuth = useSelector(getIsAuthAuthStore)
    const unreadMessagesCount = useSelector(getUnreadMessagesCountInfoStore)
    const dispatch = useDispatch()
    const { pathname } = useLocation()

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

    // вынес за пределы NavLink назначение классов
    const activeClass = ( { isActive }: { isActive: boolean } ): string =>
        `${ styles.menuPanel__item } ${ isActive
            ? styles.menuPanel__item_active : styles.menuPanel__item_unactive }`

    // легче редактировать и меньше кода на перебор
    const menuItems = [
        {
            route: isAuth ? null : routes.login, src: loginSVG, title: `${ !isAuth ? 'Авторизация' : 'Выход' }`,
            buttonText: `${ !isAuth ? 'Вход' : 'Выход' }`, active: true,
            action: !isAuth ? null : logout,
        },
        {
            route: pathname === newRequestRoute ? newRequestRoute : null, src: createSVG, title: 'Создать заявку',
            buttonText: 'Создать', active: isAuth,
            action: newRequest,
        },
        {
            route: routes.searchList, src: searchSVG, title: 'Поиск неактивных заявок',
            buttonText: 'Поиск', active: isAuth, action: null,
        },
        {
            route: routes.requestsList, src: statusSVG, title: 'Мои активные заявки',
            buttonText: 'Заявки', active: isAuth, action: null,
        },
        {
            route: routes.historyList, src: historySVG, title: 'Мои выполненные заявки',
            buttonText: 'История заявок', active: isAuth, action: null,
        },
        {
            route: routes.map, src: mapSVG, title: 'Карта маршрутов',
            buttonText: 'Карта', active: isAuth, action: null,
        },
        {
            route: routes.options, src: optionsPNG, title: 'Панель настроек (админ)',
            buttonText: 'Настройки', active: isAuth, action: null,
        },
        {
            route: routes.info, src: infoSVG, title: 'Информация / События',
            buttonText: 'Инфо', active: isAuth, action: null,
        },
        {
            route: routes.test, src: testPNG, title: 'Для тестов отрисовки компонентов',
            buttonText: 'Тест', active: isAuth, action: null,
        },
    ]

    return (
        <nav className={ styles.menuPanel }>
            { menuItems.map(( { route, src, title, buttonText, active, action } ) =>
                active &&
                <NavLink to={ route || '' }
                         className={ activeClass }
                         role={ 'button' }
                         title={ title }
                         key={ route + src }
                         onClick={ async (e) => {
                             // при отсутствии пути (когда элемент просто кнопка) отключаем переход
                             if (!route) e.preventDefault()
                             if (action) await action()
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
