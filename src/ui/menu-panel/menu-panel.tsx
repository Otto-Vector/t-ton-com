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


type OwnProps = {}

export const MenuPanel: React.FC<OwnProps> = () => {
    const routes = useSelector(getRoutesStore)
    const activeClass = ({isActive}: { isActive: boolean }) => isActive
        ? styles.menuPanel__item_active : styles.menuPanel__item_unactive

    return (
        <nav className={styles.menuPanel}>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.login} className={activeClass}>
                    <img src={loginSVG} alt="Панель авторизации"/>
                    <div>{'Вход'}</div>
                </NavLink>
            </div>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.create} className={activeClass}>
                    <img src={createSVG} alt="Создать заявку"/>
                    <div>{'Создать'}</div>
                </NavLink>
            </div>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.search} className={activeClass}>
                    <img src={searchSVG} alt="Поиск неактивных заявок"/>
                    <div>{'Поиск'}</div>
                </NavLink>
            </div>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.status} className={activeClass}>
                    <img src={statusSVG} alt="Активные заявки"/>
                    <div>{'Заявки'}</div>
                </NavLink>
            </div>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.history} className={activeClass}>
                    <img src={historySVG} alt="История выполненных заявок"/>
                    <div>{'История'}</div>
                    <div>{'заявок'}</div>
                </NavLink>
            </div>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.map} className={activeClass}>
                    <img src={mapSVG} alt="Карта маршрутов"/>
                    <div>{'Карта'}</div>
                </NavLink>
            </div>
            <div className={styles.menuPanel__item}>
                <NavLink to={routes.options} className={activeClass}>
                    <img src={optionsSVG} alt="Панель настроек (админ)"/>
                    <div>{'Настройки'}</div>
                </NavLink>
            </div>
        </nav>
    )
}
