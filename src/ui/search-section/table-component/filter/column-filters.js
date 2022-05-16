import React from 'react'
import {Button} from '../../../common/button/button';

export const ColumnInputFilter = ({ column }) => {

  const {filterValue, setFilter} = column

  // const onChange = useAsyncDebounce(value => {
  //   setFilter(value || undefined)
  // }, 1000)

  return (
        <span>
      Search:{' '}
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value);
        }}
      />
    </span>
  )
}

export const ColumnDataFilter = ({ column }) => {

  const {filterValue, setFilter} = column

  return (
    <Button colorMode={"orange"}
            onClick={()=>{setFilter( !filterValue ? new Date().toLocaleDateString() : '')}}
    ><span>Фильтр Даты: {filterValue} </span></Button>
  )
}
