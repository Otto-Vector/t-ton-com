import React, {useEffect} from 'react'
import {UseFiltersColumnProps} from 'react-table'

export const ColumnInputFilter = ( {
                                       column,
                                       filterData,
                                   }: { column?: UseFiltersColumnProps<{}>, filterData?: number | string } ) => {
    useEffect(() => {
        column?.setFilter(filterData)
    }, [column,filterData])
    return ( <></> )
}

