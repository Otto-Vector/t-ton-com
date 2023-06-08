import React from 'react'
import {useSelector} from 'react-redux';
import {getIsAuthAuthStore} from '../../../../selectors/auth-reselect';
import {Navigate} from 'react-router-dom';
import {getRoutesStore} from '../../../../selectors/routes-reselect';


export const WithAuthRedirect: React.ComponentType = ( { children } ) => {
    const isAuth = useSelector(getIsAuthAuthStore)
    const { options } = useSelector(getRoutesStore)

    if (isAuth) return <Navigate to={ options }/>
    return <>{ children }</>
}
