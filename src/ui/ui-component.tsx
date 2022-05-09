import React from 'react';
import styles from './ui-component.module.scss';

import {Header} from './header/header';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Footer} from './footer/footer';
import {LinksPanel} from './links-panel/links-panel'
import {MenuPanel} from './menu-panel/menu-panel';
import {useSelector} from 'react-redux';
import {getRoutesStore} from '../selectors/routes-reselect';
import {HelloSection} from './hello-section/hello-section';
import {LoginSection} from './login-section/login-section';
import {OptionsSection} from './options-section/options-section';
import {RequisitesForm} from './options-section/requisites-form/requisites-form';
import {ShippersForm} from './options-section/shippers-consignees-form/shippers-form';
import {ConsigneesForm} from './options-section/shippers-consignees-form/consignees-form';
import {EmployeesForm} from './options-section/employees-form/employees-form';
import {TransportForm} from './options-section/transport-trailer-form/transport-form';
import {TrailerForm} from './options-section/transport-trailer-form/trailer-form';

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
                        <Route path='/' element={ <Navigate to={ routes.options }/> }/>
                        <Route path={routes.hello} element={ <HelloSection/> }/>
                        <Route path={routes.login} element={ <LoginSection /> }/>
                        <Route path={routes.create} element={ <h2>СОЗДАТЬ ЗАЯВКУ</h2> }/>
                        <Route path={routes.search} element={ <h2>ПОИСК ЗАЯВКИ</h2> }/>
                        <Route path={routes.status} element={ <h2>СТАТУС ПО АКТИВНЫМ ЗАЯВКАМ</h2> }/>
                        <Route path={routes.history} element={ <h2>АРХИВ ЗАКРЫТЫХ ЗАЯВОК</h2> }/>
                        <Route path={routes.map} element={ <h2>КАРТА АКТИВНЫХ ЗАЯВОК</h2> }/>
                        <Route path={routes.optionsEdit.shippers+':id'} element={ <ShippersForm onSubmit={()=>{}}/> }/>
                        <Route path={routes.optionsEdit.employees+':id'} element={ <EmployeesForm/> }/>
                        <Route path={routes.optionsEdit.transport+':id'} element={ <TransportForm/> }/>
                        <Route path={routes.optionsEdit.trailer+':id'} element={ <TrailerForm/> }/>
                        <Route path={routes.optionsEdit.consignees+':id'} element={ <ConsigneesForm onSubmit={()=>{}}/>}/>

                        <Route path={routes.options} element={ <OptionsSection/> }/>
                        <Route path={routes.requisites} element={ <RequisitesForm/> }/>

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
