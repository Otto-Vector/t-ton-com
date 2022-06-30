import React, {useEffect} from 'react';
import {createPortal} from 'react-dom';

type PortalType = {
    getHTMLElementId: string
}

export const Portal: React.FC<PortalType> =
    ( { children, getHTMLElementId } ) => {

        // находим искомый HTML по id
        const mount = document.getElementById(getHTMLElementId)
        //добавляем в него свой div
        const el = document.createElement('div')

        useEffect(() => {
            // добавляем свой див к искомому элементу
            mount?.appendChild(el)
            return () => {
                // удаляем элемент от искомого при завершении компоненты
                mount?.removeChild(el)
            }
        }, [ el, mount ])

        // собственно, пририсовываем React-элемент в div к искомому HTML
        return createPortal(children, el)

    }