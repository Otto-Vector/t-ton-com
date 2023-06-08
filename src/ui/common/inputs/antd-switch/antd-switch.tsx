import React from 'react'

// сейчас они прописаны на ui компоненте
import 'antd/lib/switch/style/index.css'
import './ants-switch-restyle.scss'
import {Switch} from 'antd';


type OwnProps = {
    checkedChildren?: JSX.Element | string
    unCheckedChildren?: JSX.Element | string
    checked: boolean
    onClick: () => void
}


export const AntdSwitch: React.ComponentType<OwnProps> = ( {
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

// повёрнутый на 90 градусов свич
export const SwitchMask: React.ComponentType<SwitchMaskProps> = ( {
                                                           checked,
                                                           onClick,
                                                       } ) => {

    return <div className={ 'rotated-ant-switch' }
                title={ 'Ввод по форме' }>
        <AntdSwitch
            checkedChildren={ rotatedLabel('ru') }
            unCheckedChildren={ rotatedLabel('--') }
            checked={ checked }
            onClick={ onClick }
        />
    </div>
}
// обёртка для поворота контента в свиче
const rotatedLabel = ( inside: any ) => <div style={ { transform: 'rotate(-90deg)' } }>{ inside }</div>
