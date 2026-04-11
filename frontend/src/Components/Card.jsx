import React, { useMemo } from 'react'


function Card({ historicalData, predictedData, icon }) {
    let isDataAvailable = false;
    if (predictedData?.length !== 0) {
        isDataAvailable = true
    }
    
    const { formattedFutureDates, formattedPredictedData } = useMemo(() => {
        const today = new Date();
        const predictionDates = [];
        const formattedFutureDates = []
        const formattedPredictedData = []

        for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

            predictionDates.push(
                futureDate.toLocaleDateString('en-CA') // YYYY-MM-DD format
            );
            formattedFutureDates.push(
                futureDate.toLocaleDateString('en-GB')
            )
            formattedPredictedData.push(
                predictedData?.find(data => data.date === predictionDates[i - 1])
            )
        }
        return { formattedFutureDates, formattedPredictedData }
    }, [predictedData])


    return (
        <div className='rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between h-full'>

            {/* Header */}
            <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl'>
                    {/* 🌾 */}
                    <img
                        src={icon}
                        alt="not"
                        className='w-11/12 h-11/12 rounded-xl'
                    />
                    {/* {icon} */}
                </div>
                <p className='text-lg  font-semibold text-gray-800 dark:text-white '>{historicalData.commodity}</p>
            </div>

            {/* Main Price */}
            <div className='text-center mb-6'>
                <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                    ₹{Math.round(historicalData.avg_price)}
                </h1>
                <p className='text-sm text-gray-500 dark:text-white/60'>per Quintal</p>
            </div>

            <div className='h-full flex flex-col gap-2'>
                {/* Stats */}
                <div className='flex-1 bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2'>

                    <p className='text-center text-sm font-semibold text-gray-700 dark:text-white/80 mb-2'>
                        Today's Stats
                    </p>

                    <div className='flex justify-between'>
                        <span className='text-gray-500 dark:text-white/60'>Min</span>
                        <span className='text-red-500 dark:text-red-400 font-medium'>
                            ₹{Math.round(historicalData.min_price)}
                        </span>
                    </div>

                    <div className='flex justify-between'>
                        <span className='text-gray-500 dark:text-white/60'>Max</span>
                        <span className='text-green-600 dark:text-green-400 font-medium'>
                            ₹{Math.round(historicalData.max_price)}
                        </span>
                    </div>

                    <div className='flex justify-between'>
                        <span className='text-gray-500 dark:text-white/60'>Modal</span>
                        <span className='text-blue-600 dark:text-blue-400 font-medium'>
                            ₹{Math.round(historicalData.modal_price)}
                        </span>
                    </div>

                </div>

                {/* Prediction */}
                {/* <div className='mt-4 text-center text-sm text-gray-600 dark:text-white/70'>
                {predictedData ?
                    "Tomorrow's avg predicted price: ₹" + Math.round(predictedData.predicted_price)
                    :
                    'Prediction Not available'
                }
            </div> */}
                <div className='flex-1 bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2 text-gray-500 dark:text-white/60 mt-4'>

                    {isDataAvailable ? (
                        <>
                            <p className='text-center text-sm font-semibold text-gray-700 dark:text-white/80 mb-2'>
                                Future's predicted Stats
                            </p>
                            <hr />

                            <div className='flex justify-between'>
                                <span>{formattedFutureDates[0]}</span>
                                <span className='text-red-500 dark:text-red-400 font-medium'>
                                    ₹{Math.round(formattedPredictedData[0]?.predicted_price)}
                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span >{formattedFutureDates[1]}</span>
                                <span className='text-green-600 dark:text-green-400 font-medium'>
                                    ₹{Math.round(formattedPredictedData[1]?.predicted_price)}

                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span>{formattedFutureDates[2]}</span>
                                <span className='text-blue-600 dark:text-blue-400 font-medium'>
                                    ₹{Math.round(formattedPredictedData[2]?.predicted_price)}

                                </span>
                            </div>
                        </>)
                        :
                        <div className='h-full flex items-center justify-center'>
                            <p className='text-2xl text-center text-gray-900/60 font-semibold dark:text-amber-400'>Predictions NOT available!!</p>
                        </div>
                    }


                </div>
            </div>

        </div>
    )
}

export default Card