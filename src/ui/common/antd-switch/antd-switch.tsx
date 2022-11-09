import React from 'react'

// сейчас они прописаны на ui компоненте
import 'antd/lib/style/index.css' // используем core стили antd
import 'antd/lib/switch/style/index.css'
import './ants-switch-restyle.scss'
import {Switch} from 'antd';


type OwnProps = {
    checkedChildren?: JSX.Element | string
    unCheckedChildren?: JSX.Element | string
    checked: boolean
    onClick: () => void
}

const rotatedLabel = ( inside: any ) => <div style={ { transform: 'rotate(-90deg)' } }>{ inside }</div>

export const AntdSwitch: React.FC<OwnProps> = ( {
                                                    checked,
                                                    unCheckedChildren,
                                                    checkedChildren,
                                                    onClick,
                                                } ) => {
    return (
            <Switch
                size={ 'small' }
                checkedChildren={ checkedChildren }
                unCheckedChildren={ unCheckedChildren }
                checked={ checked }
                onClick={ onClick }
            />
    )
}


type SwitchMaskProps = {
    checked: boolean
    onClick: () => void
}

export const SwitchMask: React.FC<SwitchMaskProps> = ( {
                                                           checked,
                                                           onClick,
                                                       } ) => {
    return <div style={ { width: '40px', transform: 'rotate(90deg)' } }
                title={ 'Ввод по форме' }>
        <AntdSwitch
            checkedChildren={ rotatedLabel('ru')}
            unCheckedChildren={ rotatedLabel('--')}
            checked={ checked }
            onClick={ onClick }
        />
    </div>
}