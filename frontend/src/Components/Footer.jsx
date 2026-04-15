import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-blue-500/20 mt-20 px-6 md:px-20 py-12 bg-blue-950/20 text-white">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-6">

        {/* BRAND */}
        <div>
          <h2 className="text-xl font-semibold text-green-400 mb-3">
             AgroPredict AI
          </h2>
          <p className="text-white/60 text-sm">
            AI-powered agricultural price forecasting platform helping farmers,
            traders, and businesses make smarter decisions.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Navigation</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/market-overview" className="hover:text-blue-400 transition">
                Market Overview
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* FEATURES */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Features</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="hover:text-blue-400 transition cursor-pointer">
              Price Forecasting
            </li>
            <li className="hover:text-blue-400 transition cursor-pointer">
              Real-Time Analytics
            </li>
            <li className="hover:text-blue-400 transition cursor-pointer">
              Risk Assessment
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>Email: support@agropredict.ai</li>
            <li>Location: India</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-blue-500/20 pt-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} AgroPredict AI. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;