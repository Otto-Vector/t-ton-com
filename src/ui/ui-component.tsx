import React, {useEffect} from 'react'
import styles from './ui-component.module.scss'
import {Header} from './header/header'
import {Navigate, Route, Routes} from 'react-router-dom'
import {Footer} from './footer/footer'
import {LinksPanel} from './links-panel/links-panel'
import {MenuPanel} from './menu-panel/menu-panel'
import {useDispatch, useSelector} from 'react-redux'
import {getRoutesStore} from '../selectors/routes-reselect'
import {HelloSection} from './hello-section/hello-section'
import {LoginSection} from './login-section/login-section'
import {OptionsSection} from './options-section/options-section'
import {RequisitesForm} from './options-section/requisites-form/requisites-form'
import {ShippersForm} from './options-section/shippers-consignees-form/shippers-form'
import {ConsigneesForm} from './options-section/shippers-consignees-form/consignees-form'
import {EmployeesForm} from './options-section/employees-form/employees-form'
import {TransportForm} from './options-section/transport-trailer-form/transport-form'
import {TrailerForm} from './options-section/transport-trailer-form/trailer-form'
import {TableSection} from './table-section/table-section'
import {RequestSection} from './request-section/request-section'
import {AddDriversForm} from './add-drivers-form/add-drivers-form'
import {InfoSection} from './info-section/info-section'
import {MapSection} from './map-section/map-section'
import {LightBoxComponent} from './common/lightbox-component/lightbox-component'
import {AppStateType} from '../redux/redux-store'
import {initializedAll} from '../redux/app-store-reducer'
import {Preloader} from './common/preloader/preloader'
import {WithAuthRedirect} from './common/redirect/with-auth-redirect/with-auth-redirect'
import {ToAuthRedirect} from './common/redirect/with-auth-redirect/to-auth-redirect'
import {getAutologinAuthStore, getIsAuthAuthStore} from '../selectors/auth-reselect'
import {autoLoginMe} from '../redux/auth-store-reducer'
import {Page404} from './common/404-page/page-404'

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const initialazed = useSelector(( state: AppStateType ) => state.appStoreReducer.initialized)
    const authTry = useSelector(getAutologinAuthStore)
    const isAuth = useSelector(getIsAuthAuthStore)

    const dispatch = useDispatch()

    // инициализация данных пользователя (запросы к серверу на списки и т.п.)
    useEffect(() => {
        if (isAuth && !initialazed) dispatch<any>(initializedAll())
    }, [ isAuth, initialazed, dispatch ])

    // автоматическая авторизация (одна попытка)
    useEffect(() => {
        if (!isAuth && !authTry) dispatch<any>(autoLoginMe())
    }, [ authTry, isAuth, dispatch ])

    if (isAuth && !initialazed) return <div className={ styles.ui__preloader }><Preloader/></div>

    return (
        <div className={ styles.ui }>
            <LightBoxComponent/> {/*перманентно присутствует здесь для модального отображения картинок*/ }
            <Header/>
            <div className={ styles.ui__centerWrapper }>
                <div className={ styles.ui__sideBarLeft }>
                    <MenuPanel/>
                </div>
                <section className={ styles.ui__content }>
                    <Routes>
                        <Route path="/" element={ <Navigate to={ routes.hello }/> }/>

                        {/*ОКНО ПРИВЕТСТВИЯ*/ }
                        <Route path={ routes.hello } element={ <HelloSection/> }/>
                        {/*ОКНО АВТОРИЗАЦИИ*/ }
                        <Route path={ routes.login } element={
                            <WithAuthRedirect> <LoginSection/> </WithAuthRedirect> }/>
                        {/*СОЗДАНИЕ ЗАЯВКИ*/ }
                        <Route path={ routes.requestInfo.create + ':reqNumber' }
                               element={ <ToAuthRedirect> <RequestSection/> </ToAuthRedirect> }/>
                        {/*ПРОСМОТР активных заявок того кто их создал или участвует в ней*/ }
                        <Route path={ routes.requestInfo.status + ':reqNumber' }
                               element={ <ToAuthRedirect> <RequestSection/> </ToAuthRedirect> }/>
                        {/*ПРОСМОТР ЗАЯВКИ закрытой своей без возможности изменения*/ }
                        <Route path={ routes.requestInfo.history + ':reqNumber' }
                               element={ <ToAuthRedirect> <RequestSection/> </ToAuthRedirect> }/>
                        {/*ПРОСМОТР ЗАЯВКИ с возможностью её принять или отказаться*/ }
                        <Route path={ routes.requestInfo.accept + ':reqNumber' }
                               element={ <ToAuthRedirect> <RequestSection/> </ToAuthRedirect> }/>

                        {/*ТАБЛИЦА ПОИСК активных заявок ОБЩЕЕ*/ }
                        <Route path={ routes.searchList }
                               element={ <ToAuthRedirect> <TableSection mode={ 'search' }/> </ToAuthRedirect> }/>
                        {/*ТАБЛИЦА статусов по СВОИМ заявкам*/ }
                        <Route path={ routes.requestsList }
                               element={ <ToAuthRedirect> <TableSection mode={ 'status' }/> </ToAuthRedirect> }/>
                        {/*АРХИВ ЗАКРЫТЫХ СВОИХ ЗАЯВОК*/ }
                        <Route path={ routes.historyList }
                               element={ <ToAuthRedirect> <TableSection mode={ 'history' }/> </ToAuthRedirect> }/>

                        {/*КАРТА со своими водителями и иной информацией*/ }
                        <Route path={ routes.maps.status }
                               element={ <ToAuthRedirect><MapSection/></ToAuthRedirect> }/>
                        {/*КАРТА с ответами по заявке*/ }
                        <Route path={ routes.maps.answers + ':reqNumber' }
                               element={ <ToAuthRedirect><MapSection/></ToAuthRedirect> }/>

                        {/*НАСТРОЙКИ водители, транспорт, прицепы и т.п.*/ }
                        <Route path={ routes.options } element={ <ToAuthRedirect><OptionsSection/></ToAuthRedirect> }/>

                        {/*ИНФО с ответами по заявке*/ }
                        <Route path={ routes.info } element={ <ToAuthRedirect><InfoSection/></ToAuthRedirect> }/>

                        {/*КАРТОЧКА ОТВЕТА НА ЗАЯВКУ выбор водителя и стоимости*/ }
                        <Route path={ routes.addDriver + ':reqNumber' }
                               element={ <ToAuthRedirect> <AddDriversForm mode={ 'addDriver' }/> </ToAuthRedirect> }/>
                        {/*КАРТОЧКА ОТВЕТА НА ЗАЯВКУ =САМОВЫВОЗ ПРИ СОЗДАНИИ= выбор водителя и стоимости */ }
                        <Route path={ routes.selfExportDriver + ':reqNumber' }
                               element={ <ToAuthRedirect> <AddDriversForm mode={ 'selfExportDriver' }/>
                               </ToAuthRedirect> }/>
                        {/*КАРТОЧКА ОТВЕТА НА ЗАЯВКУ =САМОВЫВОЗ ПРИ ПОВТОРНОМ ПРОСМОТРЕ= выбор водителя и стоимости */ }
                        <Route path={ routes.selfExportDriverFromStatus + ':reqNumber' }
                               element={ <ToAuthRedirect> <AddDriversForm mode={ 'selfExportDriverFromStatus' }/>
                               </ToAuthRedirect> }/>

                        {/* РЕКВИЗИТЫ ОРГАНИЗАЦИИ с флагом редактирования данных при создании */ }
                        <Route path={ routes.requisites + ':newFlag' } element={ <RequisitesForm/> }/>
                        {/*КАРТОЧКА ГРУЗООТПРАВИТЕЛЬ*/ }
                        <Route path={ routes.optionsEdit.shippers + ':id' }
                               element={ <ToAuthRedirect><ShippersForm/></ToAuthRedirect> }/>
                        {/*КАРТОЧКА СОТРУДНИК*/ }
                        <Route path={ routes.optionsEdit.employees + ':id' }
                               element={ <ToAuthRedirect><EmployeesForm/></ToAuthRedirect> }/>
                        {/*КАРТОЧКА ТРАНСПОРТ*/ }
                        <Route path={ routes.optionsEdit.transport + ':id' }
                               element={ <ToAuthRedirect><TransportForm/></ToAuthRedirect> }/>
                        {/*КАРТОЧКА ПРИЦЕП*/ }
                        <Route path={ routes.optionsEdit.trailer + ':id' }
                               element={ <ToAuthRedirect><TrailerForm/></ToAuthRedirect> }/>
                        {/*КАРТОЧКА ГРУЗОПОЛУЧАТЕЛЬ*/ }
                        <Route path={ routes.optionsEdit.consignees + ':id' }
                               element={ <ToAuthRedirect><ConsigneesForm/></ToAuthRedirect> }/>

                        {/*404*/ }
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
