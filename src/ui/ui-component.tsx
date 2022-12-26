import React, {useEffect} from 'react'
import styles from './ui-component.module.scss';
// import 'antd/lib/style/index.css' // используем core стили antd
// import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфоокон
// import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
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
import {TableSection} from './table-section/table-section';
import {RequestSection} from './request-section/request-section';
import {AddDriversForm} from './add-drivers-form/add-drivers-form';
import {InfoSection} from './info-section/info-section';
import {MapSection} from './map-section/map-section';
import {LightBoxComponent} from './common/lightbox-component/lightbox-component'
import {AppStateType} from '../redux/redux-store';
import {initializedAll} from '../redux/app-store-reducer';
import {Preloader} from './common/preloader/preloader';
import {WithAuthRedirect} from './common/redirect/with-auth-redirect/with-auth-redirect';
import {ТoAuthRedirect} from './common/redirect/with-auth-redirect/to-auth-redirect';
import {getAutologinAuthStore, getIsAuthAuthStore} from '../selectors/auth-reselect';
import {autoLoginMe} from '../redux/auth-store-reducer';
import {Page404} from './common/404-page/page-404';

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const initialazed = useSelector(( state: AppStateType ) => state.appStoreReducer.initialized)
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
                        <Route path={ routes.requestInfo.create + ':reqNumber' }
                               element={ <ТoAuthRedirect><RequestSection/></ТoAuthRedirect> }/> {/*СОЗДАНИЕ ЗАЯВКИ*/ }
                        <Route path={ routes.requestInfo.status + ':reqNumber' }
                               element={
                                   <ТoAuthRedirect><RequestSection/></ТoAuthRedirect> }/> {/*ПРОСМОТР активных заявок того кто их создал или участвует в ней*/ }
                        <Route path={ routes.requestInfo.history + ':reqNumber' }
                               element={
                                   <ТoAuthRedirect><RequestSection/></ТoAuthRedirect> }/> {/*ПРОСМОТР ЗАЯВКИ без возможности изменения*/ }
                        <Route path={ routes.requestInfo.accept + ':reqNumber' }
                               element={ <ТoAuthRedirect>
                                   <RequestSection/> {/*ПРОСМОТР ЗАЯВКИ с возможностью её принять или отказаться*/ }
                               </ТoAuthRedirect> }/>

                        <Route path={ routes.requestsList } element={ <ТoAuthRedirect>
                            <TableSection mode={ 'status' }/> {/*таблица статусов по активным заявкам*/ }
                        </ТoAuthRedirect> }/>
                        <Route path={ routes.searchList } element={ <ТoAuthRedirect>
                            <TableSection mode={ 'search' }/> {/*ПОИСК активных заявок*/ }
                        </ТoAuthRedirect> }/>
                        <Route path={ routes.historyList } element={ <ТoAuthRedirect>
                            <TableSection mode={ 'history' }/> {/*АРХИВ ЗАКРЫТЫХ ЗАЯВОК*/ }
                        </ТoAuthRedirect> }/>

                        <Route path={ routes.map } element={ <ТoAuthRedirect><MapSection/></ТoAuthRedirect> }/>
                        <Route path={ routes.maps.answers + ':reqNumber' }
                               element={ <ТoAuthRedirect>
                                   <div className={ styles.ui__fake }><h2>КАРТА С ОТВЕТАМИ ПЕРЕВОЗЧИКОВ</h2>
                                   </div>
                               </ТoAuthRedirect> }/>
                        <Route path={ routes.info } element={ <ТoAuthRedirect><InfoSection/></ТoAuthRedirect> }/>
                        <Route path={ routes.addDriver + ':reqNumber' }                               element={ <ТoAuthRedirect>
                                   <AddDriversForm mode={'addDriver'}/>
                        </ТoAuthRedirect> }/>
                        <Route path={ routes.selfExportDriver + ':reqNumber' } element={ <ТoAuthRedirect>
                            <AddDriversForm mode={'selfExportDriver'}/>
                        </ТoAuthRedirect> }/>

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
                        <Route path={ routes.requisites + ':newFlag' } element={ <RequisitesForm/> }/>

                        <Route path={ routes.test }
                               element={ <AddDriversForm mode={'addDriver'}/> }/>
                        {/*element={ <AddDriversView idEmployee={ '0ce2d16f-582e-4d49-ac35-e0c8f9c53b06' }/> }/>*/ }

                        {/*<Route path="*" element={ <h2>This site NOT FOUND. Try another address</h2> }/>*/}
                        <Route path="*" element={ <Page404/> }/>
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
