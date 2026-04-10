// import React from 'react'

// function Card() {

//     const response = {
//         "historical": [
//             {
//                 "date": "2026-03-28",
//                 "commodity": "Wheat",
//                 "avg_price": 2447.805,
//                 "min_price": 2178.79,
//                 "max_price": 2716.82,
//                 "modal_price": 2441.66
//             }
//         ],
//         "predictions": [
//             {
//                 "date": "2026-03-29",
//                 "commodity": "Wheat",
//                 "predicted_price": 2450.64
//             }
//         ],
//     }

//     return (
//         <div className='border border-white/15 w-64 rounded-md h-84 bg-white/10 backdrop-blur-md p-2'>
//             <div className='p-3 h-full'>

//                 {/* <`img
//                 src='logo.png'
//                 alt="wheat logo"
//                 className='h-6' /> */}
//                 <div className='flex gap-3 border mb-5'>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="w-6 h-6"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                         />
//                     </svg>
//                     {/* Commodity Name: */}
//                     <p>{response.historical[0].commodity}</p>

//                 </div>
//                 <div className='border p-2 font-semibold text-3xl rounded-2xl'>
//                     {Math.round(response.historical[0].avg_price)}

//                     <p className='font-light text-sm text-white/20'>Rs/Quintal</p>
//                 </div>
//                 <div className='border mt-5 p-5 text-md text-white/75 rounded-2xl'>
//                     <p className='text-center font-semibold text-lg text-white'>Today's stats</p>
//                     <hr />
//                     <p>min price: {response.historical[0].min_price }</p>
//                     <p>max price: {response.historical[0].max_price } </p>
//                     <p>modal price: { response.historical[0].modal_price} </p>
//                 </div>
//             </div>



//         </div>
//     )
// }

// export default Card


import React from 'react'


function Card({ historicalData, predictedData, icon }) {

    return (
        <div className='rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-4'>

            {/* Header */}
            <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl'>
                    {/* 🌾 */}
                    <img
                        src={icon}
                        alt="not"
                        className='w-11/12 h-11/12 rounded-xl'
                    />
                    {/* {icon} */}
                </div>
                <p className='text-lg  font-semibold '>{historicalData.commodity}</p>
            </div>

            {/* Main Price */}
            <div className='text-center mb-6'>
                <h1 className='text-4xl font-bold'>
                    ₹{Math.round(historicalData.avg_price)}
                </h1>
                <p className='text-sm text-white/60'>per Quintal</p>
            </div>

            {/* Stats */}
            <div className='bg-white/5 rounded-xl p-4 space-y-2'>

                <p className='text-center text-sm font-semibold text-white/80 mb-2'>
                    Today's Stats
                </p>

                <div className='flex justify-between'>
                    <span className='text-white/60'>Min</span>
                    <span className='text-red-400'>
                        ₹{Math.round(historicalData.min_price)}
                    </span>
                </div>

                <div className='flex justify-between'>
                    <span className='text-white/60'>Max</span>
                    <span className='text-green-400'>
                        ₹{Math.round(historicalData.max_price)}
                    </span>
                </div>

                <div className='flex justify-between'>
                    <span className='text-white/60'>Modal</span>
                    <span className='text-blue-400'>
                        ₹{Math.round(historicalData.modal_price)}
                    </span>
                </div>

            </div>

            {/* Prediction */}
            <div className='mt-4 text-center text-sm text-white/70'>
                {/* Tomorrow's avg predicted price: ₹{ Math.round(predictedData.predicted_price) } */}
                {predictedData ?
                    "Tomorrow's avg predicted price: ₹" + Math.round(predictedData.predicted_price)
                    :
                    'Prediction Not available'
                }
            </div>

        </div>
    )
}

export default Card