import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#d6d3cd] dark:border-white/10 pt-20 px-6 md:px-20 pb-12 bg-[#e9e7e3] dark:bg-[#07130f] text-gray-800 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-6">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-semibold text-[#2f855a] dark:text-green-400 mb-3">
            AgroPredict AI
          </h2>
          <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed">
            AI-powered agricultural price forecasting platform helping farmers,
            traders, and businesses make smarter decisions.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Navigation</h3>
          <ul className="space-y-2 text-gray-600 dark:text-white/60 text-sm">
            <li>
              <Link to="/" className="hover:text-[#2f855a] transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/market-overview" className="hover:text-[#2f855a] transition">
                Market Overview
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#2f855a] transition">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* FEATURES */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Features</h3>
          <ul className="space-y-2 text-gray-600 dark:text-white/60 text-sm">
            <li className="hover:text-[#2f855a] transition cursor-pointer">
              Price Forecasting
            </li>
            <li className="hover:text-[#2f855a] transition cursor-pointer">
              Real-Time Analytics
            </li>
            <li className="hover:text-[#2f855a] transition cursor-pointer">
              Risk Assessment
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-600 dark:text-white/60 text-sm">
            <li>Email: support@agropredict.ai</li>
            <li>Location: India</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#d6d3cd] dark:border-white/10 pt-6 text-center text-gray-500 dark:text-white/40 text-sm">
        © {new Date().getFullYear()} AgroPredict AI. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;