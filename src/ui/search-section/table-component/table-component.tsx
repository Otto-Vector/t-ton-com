import React, {useEffect} from 'react'
import styles from './table-component.module.scss'
import {Button} from '../../common/button/button'
import {CancelButton} from '../../options-section/common-forms/cancel-button/cancel-button'
import {addOneDay} from '../../../utils/parsers'
import {Table} from './table'
import {ColumnInputFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
import {useSelector} from 'react-redux'
import {UseFiltersColumnProps} from 'react-table';

// const TableF = ( { columns, data }: { columns: readonly Column[], data: readonly {}[] }) => {
// // export const Table( { columns, data }: { columns: readonly Column[], data: readonly {}[] } ) => {
//     // Use the state and functions returned from useTable to build your UI
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         rows,
//         prepareRow,
//         state,
//         setGlobalFilter,
//     } = useTable( {
//         columns,
//         data,
//     }, useGlobalFilter )
//
//     const {globalFilter} = state
//
//     // Render the UI for your table
//     return ( <>
//         <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//         <table { ...getTableProps() }>
//             <thead>
//             { headerGroups.map( headerGroup => (
//                 <tr { ...headerGroup.getHeaderGroupProps() }>
//                     { headerGroup.headers.map( column => (
//                         <th { ...column.getHeaderProps() }>{ column.render( 'Header' ) }</th>
//                     ) ) }
//                 </tr>
//             ) ) }
//             </thead>
//             <tbody { ...getTableBodyProps() }>
//             { rows.map( ( row, i ) => {
//                 prepareRow( row )
//                 return (
//                     <tr { ...row.getRowProps() } onClick={ () => {
//                     } }>
//                         { row.cells.map( cell => {
//                             return <td { ...cell.getCellProps() }>{ cell.render( 'Cell' ) }</td>
//                         } ) }
//                     </tr>
//                 )
//             } ) }
//             </tbody>
//         </table>
//       </>
//     )
// }


export const TableComponent: React.FC = () => {

    const {dayFilter, routeFilter} = useSelector(getValuesFiltersStore)

    const columns = React.useMemo(
        () => [
            {
                Header: '№',
                accessor: 'requestNumber',
                disableFilters: true,
            },
            {
                Header: 'Тип груза',
                accessor: 'cargoType',
                Filter: () => {
                },
            },
            {
                Header: 'Дата',
                accessor: 'requestDate',
                Filter: ({column}: { column: UseFiltersColumnProps<{}> }) => {
                    useEffect(() => {
                        column.setFilter(dayFilter)
                    }, [])
                },
            },
            {
                Header: 'Расстояние (км)',
                accessor: 'distance',
                Filter: ({column}: { column: UseFiltersColumnProps<{}> }) => {
                    useEffect(() => {
                        column.setFilter(routeFilter)
                    }, [])
                },
                filter: 'between',
            },
            {
                Header: 'Маршрут',
                accessor: 'route',
                Filter: ColumnInputFilter,
                disableFilters: true,
            },
            {
                Header: 'Ответы',
                accessor: 'answers',
                Filter: ColumnInputFilter,
                disableFilters: true,
            },
            {
                Header: '',
                accessor: 'open',
                Filter: () => {
                },
                disableFilters: true,
            },
            {
                Header: '',
                accessor: 'close',
                Filter: () => {
                },
                disableFilters: true,
            },
        ],
        [dayFilter, routeFilter],
    )

    const data = React.useMemo(() => (
        [
            {
                requestNumber: 964,
                cargoType: 'Битумовоз',
                requestDate: addOneDay(new Date()).toLocaleDateString(),
                distance: 1120,
                route: 'Ангарск в Чита',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 984,
                cargoType: 'Битумовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 120,
                route: 'Пенза в Самара',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 985,
                cargoType: 'Контейнеровоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 80,
                route: 'Иркутск в Усолье-Сибирское',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 989,
                cargoType: 'Битумовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 3760,
                route: 'Пенза в Ростов-на-Дону',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 991,
                cargoType: 'Бензовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 4790,
                route: 'Красноярск в Пенза',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 999,
                cargoType: 'Цементовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 1680,
                route: 'Пенза в Новосибирск',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: Math.floor(Math.random() * 99),
                cargoType: 'Газовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: Math.floor(Math.random() * 9999),
                route: 'Пенза в Новосибирск',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 964,
                cargoType: 'Битумовоз',
                requestDate: addOneDay(new Date()).toLocaleDateString(),
                distance: 1120,
                route: 'Ангарск в Чита',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 984,
                cargoType: 'Битумовоз',
                requestDate: addOneDay(new Date()).toLocaleDateString(),
                distance: 120,
                route: 'Пенза в Самара',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 985,
                cargoType: 'Контейнеровоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 80,
                route: 'Иркутск в Усолье-Сибирское',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 989,
                cargoType: 'Битумовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 3760,
                route: 'Пенза в Ростов-на-Дону',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 991,
                cargoType: 'Бензовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: 4790,
                route: 'Красноярск в Пенза',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: 999,
                cargoType: 'Цементовоз',
                requestDate: addOneDay(new Date()).toLocaleDateString(),
                distance: 1680,
                route: 'Пенза в Новосибирск',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },
            {
                requestNumber: Math.floor(Math.random() * 99),
                cargoType: 'Газовоз',
                requestDate: new Date().toLocaleDateString(),
                distance: Math.floor(Math.random() * 9999),
                route: 'Пенза в Новосибирск',
                answers: Math.floor(Math.random() * 99),
                open: <Button colorMode={'gray'} title={'Открыть'}/>,
                close: <CancelButton onCancelClick={() => {
                }} noAbsolute/>,
                subRows: undefined,
            },

        ]), [])


    return (
        <div className={styles.tableComponent}>
            <Table columns={columns} data={data}/>
            {/*<AppTable/>*/}
        </div>
    )
}
