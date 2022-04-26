import React from 'react';
import styles from './ui-component.module.scss';
import {Header} from './header/header';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Footer} from './footer/footer';
import {LinksPanel} from './links-panel/links-panel'
import {MenuPanel} from './menu-panel/menu-panel';

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {
    return (
        <div className={styles.ui}>
            <Header/>
            <div className={styles.ui__centerWrapper}>
                <div className={styles.ui__sideBarLeft}>
                    <MenuPanel/>
                </div>
                <section className={styles.ui__content + ' ' + styles.grow}>
                    {/*<Routes>*/}
                    {/*    <Route path='/' element={ <Navigate to={ '/search' }/> }/>*/}
                    {/*    <Route path='*' element={ <h1>This site NOT FOUND. Try another address</h1> }/>*/}
                    {/*</Routes>*/}
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
