import React, {useEffect} from 'react'

export const GlobalFilter = ( { filter, setFilter, value }: { filter: any, setFilter: any, value: string } ) => {
    useEffect(() => {
        setFilter(value||'')
    }, [ value ])
    return ( <></> )
}
