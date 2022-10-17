import React from 'react';

function InputField (props) {
    const className = `px-3 py-2 rounded-md border border-slate-400 focus:border-indigo-400 focus:border-2 focus:outline-none st ${props.className || ''}`
    return (
        <div className='flex flex-col'>
            <label className='block mb-1 text-sm font-semibold text-gray-700' htmlFor='email'>
                {props.label}
            </label>
            <input {...props} className={className}/>
        </div>
    );
}

export default InputField;