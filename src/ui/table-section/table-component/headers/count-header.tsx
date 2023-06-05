import React from 'react'

type OwnProps = {
    unfilteredRows: number,
    filteredRows: number
}
// хедер в начале для статусов (показывает количество заявок в списке и кол-во отфильтрованных
export const CountHeader: React.ComponentType<OwnProps> = ( { unfilteredRows, filteredRows } ) =>
    <span style={ { fontSize: '75%' } }>{
        `${ unfilteredRows || '' }${ ( filteredRows !== unfilteredRows ) ? '/' + filteredRows : '' }`
    }</span>
