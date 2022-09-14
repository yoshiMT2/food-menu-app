import React from 'react';

function Button (props) {
    return (
        <div>
            <button className='w-full flex items-center justify-center px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400'
                    // onClick={props.onClick}
                    disabled={props.disabled}
                    >
                {props.title}
            </button>
        </div>
    );
}

export default Button;