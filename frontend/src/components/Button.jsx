import React from 'react';

function Button (props) {
    const className = `flex items-center justify-center px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 ${props.className || ''}`
    return (
        <div>
            <button {...props} className={className}
                    >
                {props.title}
            </button>
        </div>
    );
}

export default Button;