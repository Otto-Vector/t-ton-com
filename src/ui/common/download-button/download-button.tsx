import React from 'react'
import {SizedPreloader} from '../preloader/preloader'
import {Button} from '../button/button'

export enum ButtonState {
    Primary = 'Primary',
    Loading = 'Loading',
}

interface ButtonProps {
    readonly buttonState: ButtonState;
    readonly onClick: () => void;
    readonly label: string;
}

export const DownloadButton: React.FC<ButtonProps> = ( {
                                                           buttonState,
                                                           onClick,
                                                           label,
                                                       } ) => {
    const isLoading = buttonState === ButtonState.Loading
    return (
        <Button onClick={ onClick }>
            { isLoading
                ? <SizedPreloader sizeHW={ '15px' }/>
                : label }
        </Button>
    )
}