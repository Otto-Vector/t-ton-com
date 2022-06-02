import React from 'react'
import styles from './menu-panel.module.scss'

import {useSelector} from 'react-redux'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {NavLink} from 'react-router-dom';
import loginSVG from './buttonsSVG/login.svg'
import createSVG from './buttonsSVG/create.svg'
import searchSVG from './buttonsSVG/search.svg'
import statusSVG from './buttonsSVG/status.svg'
import historySVG from './buttonsSVG/history.svg'
import mapSVG from './buttonsSVG/map.svg'
import infoSVG from './buttonsSVG/info.svg'
import optionsPNG from './buttonsSVG/options.png'
import attentionSVG from '../../media/attention.svg'

import {getIsAuthAuthStore} from '../../selectors/auth-reselect';
import {getUnreadMessagesCountInfoStore} from '../../selectors/info-reselect';


type OwnProps = {}

export const MenuPanel: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const isAuth = useSelector(getIsAuthAuthStore)
    const unreadMessagesCount = useSelector(getUnreadMessagesCountInfoStore)
    // вынес за пределы NavLink назначение классов
    const activeClass = ( { isActive }: { isActive: boolean } ): string =>
        `${ styles.menuPanel__item } ${ isActive
            ? styles.menuPanel__item_active : styles.menuPanel__item_unactive }`

    // легче редактировать и меньше кода на перебор
    const menuItems = [
        {
            route: routes.login, src: loginSVG, title: 'Авторизация',
            buttonText: `${ isAuth ? 'Вход' : 'Выход' }`, active: true,
        },
        {
            route: routes.requestInfo.create, src: createSVG, title: 'Создать заявку',
            buttonText: 'Создать', active: isAuth,
        },
        {
            route: routes.searchList, src: searchSVG, title: 'Поиск неактивных заявок',
            buttonText: 'Поиск', active: isAuth,
        },
        {
            route: routes.requestsList, src: statusSVG, title: 'Активные заявки',
            buttonText: 'Заявки', active: isAuth,
        },
        {
            route: routes.historyList, src: historySVG, title: 'Выполненные заявки',
            buttonText: 'История заявок', active: isAuth,
        },
        {
            route: routes.map, src: mapSVG, title: 'Карта маршрутов',
            buttonText: 'Карта', active: isAuth,
        },
        {
            route: routes.options, src: optionsPNG, title: 'Панель настроек (админ)',
            buttonText: 'Настройки', active: isAuth,
        },
        {
            route: routes.info, src: infoSVG, title: 'Информация / События',
            buttonText: 'Инфо', active: isAuth,
        },
    ]

    return (
        <nav className={ styles.menuPanel }>
            { menuItems.map(( { route, src, title, buttonText, active } ) =>
                active &&
                <NavLink to={ route } className={ activeClass } role={ 'button' } title={ title } key={ route + src }>
                    <img className={ styles.menuPanel__image } src={ src } alt={ buttonText }/>
                    <div className={ styles.menuPanel__text }>{ buttonText }</div>
                    { ( buttonText === 'Инфо' && unreadMessagesCount !== 0 ) &&
                        <div className={ styles.attentionIcon }><img src={ attentionSVG } alt={ '!' }/></div> }
                </NavLink>,
            ) }
        </nav>
    )
}
