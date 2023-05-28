import React from 'react'
import {useSelector} from 'react-redux';
import {getIsAuthAuthStore} from '../../../../selectors/auth-reselect';
import {Navigate} from 'react-router-dom';
import {getRoutesStore} from '../../../../selectors/routes-reselect';

// Переброс на логинизацию при отсутствии таковой
export const ToAuthRedirect: React.FC = ( { children } ) => {
    const isAuth = useSelector(getIsAuthAuthStore)
    const { login } = useSelector(getRoutesStore)

    if (!isAuth) return <Navigate to={ login }/>
    return <>{ children }</>
}
