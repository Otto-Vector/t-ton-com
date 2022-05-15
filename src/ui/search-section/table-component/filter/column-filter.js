import React, { useState } from 'react'
import {Button} from '../../../common/button/button';

export const ColumnFilter = ({ column }) => {

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
          // setFilter(e.target.value);
          setFilter('16.05.2022');
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
