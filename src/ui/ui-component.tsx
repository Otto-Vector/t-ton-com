import React from 'react';
import styles from './ui-component.module.scss';

import {Header} from './header/header';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Footer} from './footer/footer';
import {LinksPanel} from './links-panel/links-panel'
import {MenuPanel} from './menu-panel/menu-panel';
import {useSelector} from 'react-redux';
import {getRoutesStore} from '../selectors/base-reselect';
import {HelloSection} from './hello-section/hello-section';
import {LoginSection} from './login-section/login-section';

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)

    return (
        <div className={styles.ui}>
            <Header/>
            <div className={styles.ui__centerWrapper}>
                <div className={styles.ui__sideBarLeft}>
                    <MenuPanel/>
                </div>
                <section className={styles.ui__content + ' ' + styles.grow}>
                    <Routes>
                        <Route path='/' element={ <Navigate to={ routes.login }/> }/>
                        <Route path={routes.hello} element={ <HelloSection/> }/>
                        <Route path={routes.login} element={ <LoginSection/> }/>
                        <Route path={routes.create} element={ <h2>СОЗДАТЬ ЗАЯВКУ</h2> }/>
                        <Route path={routes.search} element={ <h2>ПОИСК ЗАЯВКИ</h2> }/>
                        <Route path={routes.status} element={ <h2>СТАТУС ПО АКТИВНЫМ ЗАЯВКАМ</h2> }/>
                        <Route path={routes.history} element={ <h2>АРХИВ ЗАКРЫТЫХ ЗАЯВОК</h2> }/>
                        <Route path={routes.map} element={ <h2>КАРТА АКТИВНЫХ И ПАССИВНЫХ :)</h2> }/>
                        <Route path={routes.options} element={ <h2>ДОСТУП ЗАКРЫТ! ТОЛЬКО АДМИНАМ</h2> }/>

                        <Route path='*' element={ <h2>This site NOT FOUND. Try another address</h2> }/>
                    </Routes>
                </section>
                <div className={styles.ui__sideBarRight}>
                    <LinksPanel/>
                </div>
            </div>
            <div className={styles.ui__footer}>
                <Footer/>
            </div>
        </div>
    )
}
