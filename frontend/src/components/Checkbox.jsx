import React from 'react'
function Checkbox (props) {
    const className = `bg-red-100 border-red-300 text-red-500 focus:ring-red-200 ${props.className || ''}`
    return (
        <div>
            <input {...props} type="checkbox" className={className}
                    >
            </input>
        </div>
    );
}

export default Checkbox;