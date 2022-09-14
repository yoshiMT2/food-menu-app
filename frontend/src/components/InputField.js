import React from 'react';

function InputField (props) {
    return (
        <div className='flex flex-col'>
            <label  className='block mb-1 text-sm font-semibold text-gray-700' htmlFor='email'>
                {props.label}
            </label>
            <input className='md:w-80 w-56 px-3 py-2 rounded-md border border-slate-400 focus:border-indigo-400 focus:border-2 focus:outline-none'
                   type={props.type}
                   placeholder={props.placeholder}
                   onChange={props.onChange}>
             </input>
        </div>
    );
}

export default InputField;