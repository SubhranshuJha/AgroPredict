import React from 'react'

function CardUiAnimation() {
    return (
        <div className='rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-lg p-4 flex flex-col justify-between h-full animate-pulse'>

            {/* Header */}
            <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-xl'></div>
                <div className='h-8 w-24 bg-gray-200 dark:bg-white/10 rounded'>
                </div>

            </div>

            {/* Main Price */}
            <div className='text-center mb-6 space-y-2'>
                <div className='h-8 w-24 mx-auto bg-gray-200 dark:bg-white/10 rounded'></div>
                <div className='h-4 w-20 mx-auto bg-gray-200 dark:bg-white/10 rounded'></div>
            </div>

            {/* Stats */}
            <div className='flex-1 bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3'>

                <div className='h-8 w-28 mx-auto bg-gray-200 dark:bg-white/10 rounded'></div>

                <div className='flex justify-between'>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-white/10 rounded'></div>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-white/10 rounded'></div>
                </div>

                <div className='flex justify-between'>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-white/10 rounded'></div>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-white/10 rounded'></div>
                </div>

                <div className='flex justify-between'>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-white/10 rounded'></div>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-white/10 rounded'></div>
                </div>

            </div>

        </div>
    )
}

export default CardUiAnimation