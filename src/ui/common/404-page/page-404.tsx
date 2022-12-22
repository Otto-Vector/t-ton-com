import React from 'react'
import classes from './page-404.module.scss'
import {MaterialIcon} from '../material-icon/material-icon';

type OwnProps = {}

export const Page404: React.FC<OwnProps> = () => {

    return <section className={classes.error404}>
        <div className={ classes.error404_mainbox }>
            <div className={ classes.error404_err }>4</div>
            <div className={ classes.error404_far }>
                <MaterialIcon icon_name={'question_mark'}/>
            </div>
            <div className={ classes.error404_err2 }>4</div>
            <div className={ classes.error404_msg }>Данной страницы/ссылки не существует в этом приложении<p>Попробуйте c <a
                href="https://t-ton.com/hello">hello</a> страницы </p></div>
        </div>
    </section>
}

