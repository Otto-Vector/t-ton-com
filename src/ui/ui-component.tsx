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
import {getAllConsigneesAPI} from '../redux/options/consignees-store-reducer'
import {getAllRequestsAPI, getCargoCompositionSelector} from '../redux/forms/request-store-reducer';
import {getAllShippersAPI} from '../redux/options/shippers-store-reducer';
import {getInfoMessages} from '../redux/info-store-reducer';
import {InfoSection} from './info-section/info-section';
import {getAllTransportAPI} from '../redux/options/transport-store-reducer';
import {getAllTrailerAPI} from '../redux/options/trailer-store-reducer';
import {getAllEmployeesAPI} from '../redux/options/employees-store-reducer';
import {YandexMapComponent} from './yandex-map-component/yandex-map-component';
import {geoPositionTake} from '../redux/auth-store-reducer';

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {

    const routes = useSelector(getRoutesStore)
    const dispatch = useDispatch()

    useEffect(()=>{ // до реализации авторизации, подгружаем все данные здесь (временно)

        dispatch<any>(getAllConsigneesAPI({innID:0}))
        dispatch<any>(getAllRequestsAPI({innID:0}))
        dispatch<any>(getAllShippersAPI({innID:0}))
        dispatch<any>(getAllTransportAPI({innID:0}))
        dispatch<any>(getAllTrailerAPI({innID:0}))
        dispatch<any>(getAllEmployeesAPI({innID:0}))

        dispatch<any>(getInfoMessages({authID:0}))
        dispatch<any>(getCargoCompositionSelector())
        dispatch<any>(geoPositionTake())

    },[dispatch])

    return (
        <div className={ styles.ui }>
            <Header/>
            <div className={ styles.ui__centerWrapper }>
                <div className={ styles.ui__sideBarLeft }>
                    <MenuPanel/>
                </div>
                <section className={ styles.ui__content + ' ' + styles.grow }>
                    <Routes>
                        <Route path="/" element={ <Navigate to={ routes.hello }/> }/>

                        <Route path={ routes.hello } element={ <HelloSection/> }/> {/*ОКНО ПРИВЕТСТВИЯ*/ }
                        <Route path={ routes.login } element={ <LoginSection/> }/> {/*ОКНО АВТОРИЗАЦИИ*/ }
                        <Route path={ routes.requestInfo.create }
                               element={ <RequestSection mode={ 'create' }/> }/> {/*СОЗДАНИЕ ЗАЯВКИ*/ }
                        <Route path={ routes.requestInfo.history+':reqNumber' }
                               element={ <RequestSection mode={ 'history' }/> }/> {/*СОЗДАНИЕ ЗАЯВКИ*/ }
                        <Route path={ routes.searchList }
                               element={ <SearchSection mode={ 'search' }/> }/> {/*ПОИСК активных заявок*/ }
                        <Route path={ routes.requestInfo.driver + ':reqNumber' }
                               element={ <RequestSection
                                   mode={ 'status' }/> }/> {/*ПРОСМОТР активных заявок для перевозчика*/ }
                        <Route path={ routes.requestsList } element={ <SearchSection
                            mode={ 'status' }/> }/> {/*таблица статусов по активным заявкам*/ }
                        <Route path={ routes.requestInfo.status + ':reqNumber' }
                               element={ <div className={ styles.ui__fake }><h2>СТАТУС ЗАЯВКИ</h2>
                               </div> }/> {/*статус заявки*/ }
                        <Route path={ routes.historyList }
                               element={ <SearchSection mode={ 'history' }/> }/> {/*АРХИВ ЗАКРЫТЫХ ЗАЯВОК*/ }

                        <Route path={ routes.map } element={ <YandexMapComponent /> }/>
                        <Route path={ routes.maps.answers + ':reqNumber' }
                               element={ <div className={ styles.ui__fake }><h2>КАРТА С ОТВЕТАМИ ПЕРЕВОЗЧИКОВ</h2>
                               </div> }/>
                        <Route path={ routes.info } element={ <InfoSection/> }/>
                        <Route path={ routes.addDriver+ ':reqNumber' }
                               element={ <AddDriversForm /> }/>

                        <Route path={ routes.optionsEdit.shippers + ':id' } element={ <ShippersForm/> }/>
                        <Route path={ routes.optionsEdit.employees + ':id' } element={ <EmployeesForm/> }/>
                        <Route path={ routes.optionsEdit.transport + ':id' } element={ <TransportForm/> }/>
                        <Route path={ routes.optionsEdit.trailer + ':id' } element={ <TrailerForm/> }/>
                        <Route path={ routes.optionsEdit.consignees + ':id' } element={ <ConsigneesForm/> }/>

                        <Route path={ routes.options } element={ <OptionsSection/> }/>
                        <Route path={ routes.requisites } element={ <RequisitesForm/> }/>

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
