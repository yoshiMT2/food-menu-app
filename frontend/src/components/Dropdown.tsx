import React from 'react';
import {
  Column,
  Table,
} from '@tanstack/react-table'

function Dropdown ({column, table}: {column: Column<any, any>, table: Table<any>}) {

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const onChangeHandler = (value) => {
    if (value === 'out_of_stock') {
      column.setFilterValue(false)
    }
    if (value === 'in_stock') {
      column.setFilterValue(true)
    }
    if (value === '') {
      column.setFilterValue(null)
    }
  }

  return typeof firstValue === 'boolean' ? (
    <div>
      <select
        className="block text-center p-1 text-sm text-gray-700 bg-indigo-200 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-70"
        onChange={e => onChangeHandler(e.target.value)}
        >
        <option value="">在庫状況</option>
        <option value="out_of_stock">在庫切れ</option>
        <option value="in_stock">在庫あり</option>
        <option value="">全て</option>
      </select>
    </div>
  )
  :(<div></div>)
}

export default Dropdown