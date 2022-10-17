import React, { HTMLAttributes, HTMLProps, useRef, useEffect} from 'react'

function Checkbox ({
  indeterminate,
  className = 'text-white',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}
// const className = `bg-red-100 border-red-300 text-red-500 focus:ring-red-200 ${props.className || ''}`


export default Checkbox;