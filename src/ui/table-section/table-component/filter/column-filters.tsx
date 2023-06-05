import React, {useEffect} from 'react'
import {UseFiltersColumnProps} from 'react-table'

const ColumnInputFilter: React.ComponentType<{ column: UseFiltersColumnProps<{}>, filterValue?: any }> = ( { column, filterValue } ) => {
    useEffect(() => {
        column?.setFilter(filterValue)
    }, [ column, filterValue ])
    return ( <></> )
}

// комбайн для проброса данных фильтра
export const columnFilter = ( filterValue?: any ) => ( column: { column: UseFiltersColumnProps<{}> } ) =>
    ColumnInputFilter({ ...column, filterValue })
