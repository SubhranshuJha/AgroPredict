import { createContext } from "react"

export const ThemeContext = createContext({
    themeMode: 'light',
    toggleTheme: () => {
        throw new Error("toggleTheme must be used within ThemeProvider");
    }
})