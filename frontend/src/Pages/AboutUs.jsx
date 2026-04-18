import React from 'react'

function AboutUs() {
  return (
    <div className='min-h-[70vh] flex items-center justify-center px-6 py-12 bg-linear-to-b from-[#f8f6f1] via-[#f1efe9] to-[#e8f3ec] dark:from-black dark:via-green-900/10 dark:to-blue-950/5'>

      <div className='max-w-3xl w-full text-center bg-[#ffffffcc] dark:bg-white/5 backdrop-blur-md border border-[#e0ddd7] dark:border-white/10 rounded-2xl p-10 shadow-sm'>

        <h1 className='text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6'>
          About Us
        </h1>

        <p className='text-gray-600 dark:text-white/60 text-lg leading-relaxed'>
          We are building intelligent agricultural solutions powered by AI to help farmers,
          traders, and businesses make smarter decisions. Our platform leverages advanced
          machine learning models to predict commodity prices with high accuracy and
          reliability.
        </p>

      </div>

    </div>
  )
}

export default AboutUs