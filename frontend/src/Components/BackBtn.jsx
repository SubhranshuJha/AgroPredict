import React from 'react'
import { useNavigate } from 'react-router-dom';

function BackBtn() {
    const navigate = useNavigate();
    return (
        <div className="px-10 pt-6">
            <button
                onClick={() => {
                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate("/"); // fallback route
                    }
                }}
                className="absolute top-10 left-6 z-50 
            w-20 h-fit px-2 py-1 flex items-center justify-around    
             rounded-full 
            
             bg-gray-100 dark:bg-slate-800 
             text-gray-700 dark:text-gray-200 
                hover:dark:ring-1 hover:dark:ring-white hover:text-white 
             transition-all shadow-lg 
             hover:scale-110 active:scale-95"
            >
                <svg className="w-fit h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
            </button>
        </div>
    )
}

export default BackBtn