import React from 'react'
import styles from './ofer.module.scss'
import docum from '../../../media/document.svg'
import {DownloadSampleFile} from '../../common/download-sample-file/download-sample-file'
import {useSelector} from 'react-redux'
import {getFooterBaseStore} from '../../../selectors/base-reselect'

type OwnProps = {}

export const Ofer: React.FC<OwnProps> = () => {
    const { linkToOfer } = useSelector(getFooterBaseStore)
    const oferText = 'Договор-оферта'

    return (
        <div className={ styles.ofer }>
            <img className={ styles.ofer__img } src={ docum } alt={ oferText }/>
            <span>
                <DownloadSampleFile
                    label={ oferText }
                    urlShort={ linkToOfer }
                />
                </span>
        </div>
    )
}