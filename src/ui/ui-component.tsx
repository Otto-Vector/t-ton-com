import React, {useEffect} from 'react'
import styles from './ui-component.module.scss';

import {Header} from './header/header';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Footer} from './footer/footer';
import {LinksPanel} from './links-panel/links-panel'
import {MenuPanel} from './menu-panel/menu-panel';
import {useDispatch, useSelector} from 'react-redux'
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
import {SearchSection} from './search-section/search-section';
import {RequestSection} from './request-section/request-section';
import {AddDriversForm} from './add-drivers-form/add-drivers-form';
import {InfoSection} from './info-section/info-section';
import {MapSection} from './map-section/map-section';
import {LightBoxComponent} from './common/lightbox-component/lightbox-component'
import {AddDriversView} from './add-drivers-form/add-drivers-view';
import {AppStateType} from '../redux/redux-store';
import {initializedAll} from '../redux/app-store-reducer';
import {Preloader} from './common/preloader/preloader';
import {WithAuthRedirect} from './common/redirect/with-auth-redirect/with-auth-redirect';
import {ТoAuthRedirect} from './common/redirect/with-auth-redirect/to-auth-redirect';
import {getAutologinAuthStore, getIsAuthAuthStore} from '../selectors/auth-reselect';
import {autoLoginMe} from '../redux/auth-store-reducer';

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const initialazed = useSelector(( state: AppStateType ) => state.appStoreReducer.initialazed)
    const authTry = useSelector(getAutologinAuthStore)
    const isAuth = useSelector(getIsAuthAuthStore)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isAuth && !authTry) dispatch<any>(autoLoginMe())
        if (isAuth && !initialazed) dispatch<any>(initializedAll())
    }, [ initialazed, authTry, isAuth, dispatch ])

    if (isAuth && !initialazed) return <div className={ styles.ui__preloader }><Preloader/></div>

    return (
        <div className={ styles.ui }>
            <LightBoxComponent/>
            <Header/>
            <div className={ styles.ui__centerWrapper }>
                <div className={ styles.ui__sideBarLeft }>
                    <MenuPanel/>
                </div>
                <section className={ styles.ui__content + ' ' + styles.grow }>
                    <Routes>
                        <Route path="/" element={ <Navigate to={ routes.hello }/> }/>

                        <Route path={ routes.hello } element={ <HelloSection/> }/> {/*ОКНО ПРИВЕТСТВИЯ*/ }
                        <Route path={ routes.login } element={
                            <WithAuthRedirect><LoginSection/></WithAuthRedirect> }/> {/*ОКНО АВТОРИЗАЦИИ*/ }
                        <Route path={ routes.requestInfo.create }
                               element={ <ТoAuthRedirect><RequestSection
                                   mode={ 'create' }/></ТoAuthRedirect> }/> {/*СОЗДАНИЕ ЗАЯВКИ*/ }
                        <Route path={ routes.requestInfo.history + ':reqNumber' }
                               element={ <ТoAuthRedirect><RequestSection
                                   mode={ 'history' }/></ТoAuthRedirect> }/> {/*СОЗДАНИЕ ЗАЯВКИ*/ }
                        <Route path={ routes.searchList }
                               element={ <ТoAuthRedirect><SearchSection
                                   mode={ 'search' }/></ТoAuthRedirect> }/> {/*ПОИСК активных заявок*/ }
                        <Route path={ routes.requestInfo.driver + ':reqNumber' }
                               element={ <ТoAuthRedirect> <RequestSection
                                   mode={ 'status' }/></ТoAuthRedirect> }/> {/*ПРОСМОТР активных заявок для перевозчика*/ }
                        <Route path={ routes.requestsList } element={ <ТoAuthRedirect><SearchSection
                            mode={ 'status' }/></ТoAuthRedirect> }/> {/*таблица статусов по активным заявкам*/ }
                        <Route path={ routes.requestInfo.status + ':reqNumber' }
                               element={ <ТoAuthRedirect>
                                   <div className={ styles.ui__fake }><h2>СТАТУС ЗАЯВКИ</h2></div>
                               </ТoAuthRedirect> }/> {/*статус заявки*/ }
                        <Route path={ routes.historyList }
                               element={ <ТoAuthRedirect><SearchSection
                                   mode={ 'history' }/></ТoAuthRedirect> }/> {/*АРХИВ ЗАКРЫТЫХ ЗАЯВОК*/ }

                        <Route path={ routes.map } element={ <ТoAuthRedirect><MapSection/></ТoAuthRedirect> }/>
                        <Route path={ routes.maps.answers + ':reqNumber' }
                               element={ <ТoAuthRedirect>
                                   <div className={ styles.ui__fake }><h2>КАРТА С ОТВЕТАМИ ПЕРЕВОЗЧИКОВ</h2>
                                   </div>
                               </ТoAuthRedirect> }/>
                        <Route path={ routes.info } element={ <ТoAuthRedirect><InfoSection/></ТoAuthRedirect> }/>
                        <Route path={ routes.addDriver + ':reqNumber' }
                               element={ <ТoAuthRedirect><AddDriversForm/></ТoAuthRedirect> }/>

                        <Route path={ routes.optionsEdit.shippers + ':id' }
                               element={ <ТoAuthRedirect><ShippersForm/></ТoAuthRedirect> }/>
                        <Route path={ routes.optionsEdit.employees + ':id' }
                               element={ <ТoAuthRedirect><EmployeesForm/></ТoAuthRedirect> }/>
                        <Route path={ routes.optionsEdit.transport + ':id' }
                               element={ <ТoAuthRedirect><TransportForm/></ТoAuthRedirect> }/>
                        <Route path={ routes.optionsEdit.trailer + ':id' }
                               element={ <ТoAuthRedirect><TrailerForm/></ТoAuthRedirect> }/>
                        <Route path={ routes.optionsEdit.consignees + ':id' }
                               element={ <ТoAuthRedirect><ConsigneesForm/></ТoAuthRedirect> }/>

                        <Route path={ routes.options } element={ <ТoAuthRedirect><OptionsSection/></ТoAuthRedirect> }/>
                        <Route path={ routes.requisites } element={ <RequisitesForm/> }/>

                        <Route path={ routes.test } element={ <AddDriversView/> }/>

                        <Route path="*" element={ <h2>This site NOT FOUND. Try another address</h2> }/>
                    </Routes>
                </section>
                <div className={ styles.ui__sideBarRight }>
                    <LinksPanel/>
                </div>
            </div>
            <div className={ styles.ui__footer }>
                <Footer/>
            </div>
        </div>
    )
}
