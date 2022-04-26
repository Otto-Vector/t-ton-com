import React from 'react'
import styles from './menu-panel.module.scss'
import {useSelector} from 'react-redux'
import {getRoutesStore} from '../../selectors/base-reselect'
import {NavLink} from 'react-router-dom';
import loginSVG from './buttons/login.svg'
import createSVG from './buttons/create.svg'
import searchSVG from './buttons/search.svg'
import statusSVG from './buttons/status.svg'
import historySVG from './buttons/history.svg'
import mapSVG from './buttons/map.svg'
import optionsSVG from './buttons/options.svg'
import {getIsAuth} from '../../selectors/auth-reselect';


type OwnProps = {}

export const MenuPanel: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const isAuth = useSelector(getIsAuth)

    // вынес за пределы NavLink назначение классов
    const activeClass = ({isActive}: { isActive: boolean }): string => isActive
        ? styles.menuPanel__item_active : styles.menuPanel__item_unactive

    // легче редактировать и меньше кода на перебор
    const menuItems = [
        {route: routes.login, src: loginSVG, title: 'Авторизация', buttonText: `${isAuth ? 'Вход' : 'Выход'}`},
        {route: routes.create, src: createSVG, title: 'Создать заявку', buttonText: 'Создать'},
        {route: routes.search, src: searchSVG, title: 'Поиск неактивных заявок', buttonText: 'Поиск'},
        {route: routes.status, src: statusSVG, title: 'Активные заявки', buttonText: 'Заявки'},
        {route: routes.history, src: historySVG, title: 'Выполненные заявки', buttonText: 'История заявок'},
        {route: routes.map, src: mapSVG, title: 'Карта маршрутов', buttonText: 'Карта'},
        {route: routes.options, src: optionsSVG, title: 'Панель настроек (админ)', buttonText: 'Настройки'},
    ]

    return (
        <nav className={styles.menuPanel}>
            {menuItems.map(({route, src, title, buttonText}) =>
                <div className={styles.menuPanel__item}>
                    <NavLink to={route} className={activeClass} role={'button'} title={title}>
                        <img className={styles.menuPanel__image} src={src} alt={buttonText}/>
                        <div className={styles.menuPanel__text}>{buttonText}</div>
                    </NavLink>
                </div>
            )}
        </nav>
    )
}
