import useTheme from '../contexts/theme/useTheme'

function ThemeButton() {
    const { themeMode, toggleTheme } = useTheme()
  return (
    <div>
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className="
          relative flex items-center justify-center
          w-11 h-11 rounded-full
          bg-slate-100 dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          transition-colors duration-300
          hover:ring-4 hover:ring-indigo-500/10
          active:scale-95
          hover:cursor-pointer
        "
      >
        <span className={`
          absolute text-xl
          transition-all duration-500 ease-out
          ${themeMode === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}>☀️</span>
        <span className={`
          absolute text-xl
          transition-all duration-500 ease-out
          ${themeMode === 'light' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}>🌙</span>
      </button>
    </div>
  )
}

export default ThemeButton
