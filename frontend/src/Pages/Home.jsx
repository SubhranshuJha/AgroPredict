import { Link } from "react-router-dom";
import { CardRenderer } from "../Components";

function Home() {
  return (
    <div className="bg-linear-to-b from-[#f1f1f0] via-[#e9e7e3] to-[#dde8e1] dark:from-black dark:via-green-900/10 dark:to-blue-950/5 text-gray-800 dark:text-white min-h-screen">
      { console.log("API URL:", import.meta.env.VITE_API_URL) }
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-12 pb-12">

        <span className="border border-[#d6d3cd] dark:border-white/20 text-sm px-4 py-1 rounded-full mb-6 backdrop-blur bg-[#e7e5e0] dark:bg-white/10 text-gray-700 dark:text-gray-200">
          LSTM-POWERED • 84.2% ACCURACY • 95+ COMMODITIES
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Revolutionary Agricultural <span className="text-[#2f855a] dark:text-green-400">Price Intelligence</span>
        </h1>

        <p className="text-gray-600 dark:text-white/60 mt-6 max-w-2xl text-lg">
          Empowering farmers, traders, and agri-businesses with AI-driven insights.
          <br />Predict commodity prices up to 7 days ahead with confidence.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            to="/market-overview"
            className="bg-[#2f855a] hover:bg-[#276749] transition-all px-6 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-xl"
          >
            View Market Overview
          </Link>

          <Link
            className="border border-[#d6d3cd] bg-[#e5e3df] dark:bg-white/10 hover:bg-white/20 transition px-6 py-3 rounded-lg backdrop-blur-md shadow-sm"
            to={'/about'}
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 pb-20">

        <div className="bg-[#eceae6] dark:bg-white/5 backdrop-blur-md border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-[#2f855a] dark:text-green-400">84.2%</h2>
          <p className="text-gray-600 dark:text-white/60 mt-2">Prediction Accuracy</p>
        </div>

        <div className="bg-[#eceae6] dark:bg-white/5 backdrop-blur-md border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-[#2f855a] dark:text-green-400">95+</h2>
          <p className="text-gray-600 dark:text-white/60 mt-2">Commodities Tracked</p>
        </div>

        <div className="bg-[#eceae6] dark:bg-white/5 backdrop-blur-md border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-[#2f855a] dark:text-green-400">7 Days</h2>
          <p className="text-gray-600 dark:text-white/60 mt-2">Forecast Horizon</p>
        </div>

      </section>
      {/* 
      CARD SECTION
      <section className="px-6 md:px-20 pb-20">
        <h2 className="text-2xl font-semibold mb-6">Market Insights</h2>
        <CardRenderer />
      </section> */}


      {/* FEATURES SECTION */}
      <section className="px-6 md:px-20 pb-24">

  <div className="text-center mb-16">
    <p className="text-xs tracking-widest text-gray-500 dark:text-white/40 mb-4">
      POWERED BY ADVANCED AI
    </p>

    <h2 className="text-3xl md:text-5xl font-semibold">
      Everything you need to <br /> <span className="text-[#2f855a] dark:text-green-400">Trade </span>smarter
    </h2>
  </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* CARD 1 */}
    <div className="bg-[#eceae6] dark:bg-white/5 border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold mb-2">LSTM Neural Networks</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">
        Advanced Long Short-Term Memory networks analyze complex agricultural
        patterns and market trends.
      </p>
    </div>

    {/* CARD 2 */}
    <div className="bg-[#eceae6] dark:bg-white/5 border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold mb-2">Real-Time Analytics</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">
        Processes live market data to provide instant insights and predictions
        across 95+ commodities.
      </p>
    </div>

    {/* CARD 3 */}
    <div className="bg-[#eceae6] dark:bg-white/5 border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold mb-2">Price Forecasting</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">
        Delivers accurate price predictions up to 7 days ahead with high accuracy.
      </p>
    </div>

    {/* CARD 4 */}
    <div className="bg-[#eceae6] dark:bg-white/5 border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">
        Comprehensive risk analysis and volatility predictions to help mitigate losses.
      </p>
    </div>

    {/* CARD 5 */}
    <div className="bg-[#eceae6] dark:bg-white/5 border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold mb-2">Global Market Data</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">
        Access worldwide agricultural commodity markets and pricing information.
      </p>
    </div>

    {/* CARD 6 */}
    <div className="bg-[#eceae6] dark:bg-white/5 border border-[#d6d3cd] dark:border-white/10 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
      <p className="text-gray-600 dark:text-white/60 text-sm">
        Machine learning algorithms continuously improve prediction accuracy over time.
      </p>
    </div>

        </div>
      </section>
    </div>
  );
}

export default Home;