import React from 'react'
import styles from './ofer.module.scss'
import docum from '../../../media/document.svg'
import {DownloadSampleFileWrapper} from '../../common/download-sample-file/download-sample-file-wrapper'
import {useSelector} from 'react-redux'
import {getFooterBaseStore} from '../../../selectors/base-reselect'

type OwnProps = {}

export const Ofer: React.FC<OwnProps> = () => {
    const { linkToOfer } = useSelector(getFooterBaseStore)
    const oferText = 'Договор-оферта'

    return (
        <DownloadSampleFileWrapper urlShort={ linkToOfer }>
            <div className={ styles.ofer }>
                <img className={ styles.ofer__img } src={ docum } alt={ oferText }/>
                <span>{ oferText }</span>
            </div>
        </DownloadSampleFileWrapper>
    )
}
