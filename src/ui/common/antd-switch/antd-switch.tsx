import React, {useCallback} from 'react'

// сейчас они прописаны на ui компоненте
import 'antd/lib/style/index.css' // используем core стили antd
import 'antd/lib/switch/style/index.css'
import './ants-switch-restyle.scss'
import {Switch} from 'antd';


type OwnProps = {
    // input: any
    // meta: FieldState<any>
    checked: boolean
    checkedChildren?: string
    unCheckedChildren?: string
    isRotate?: boolean
    onClick: () => void
}


export const AntdSwitch: React.FC<OwnProps> = ( {
                                                    // input,
                                                    checked,
                                                    // meta,
                                                    unCheckedChildren,
                                                    checkedChildren,
                                                    isRotate,
                                                    onClick,
                                                } ) => {
    const rotatedLabel = useCallback(( inside: any ) => <div
        style={ { transform: 'rotate(-90deg)' } }>{ inside }</div>, [])


    return (
        <div style={ {
            width: '40px',
            transform:
                `rotate(${ isRotate ? '9' : '' }0deg)`
            ,
        } } title={ 'Ввод по форме' }>
            <Switch
                checkedChildren={ isRotate ? rotatedLabel(checkedChildren) : checkedChildren }
                unCheckedChildren={ isRotate ? rotatedLabel(unCheckedChildren) : unCheckedChildren }
                checked={ checked }
                size={ 'small' }
                onClick={ onClick }
            />
        </div>
    )
}
