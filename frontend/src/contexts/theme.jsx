import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
    themeMode: 'light',
    toggleTheme: () => { }
})

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => {
        if (localStorage.getItem("themeMode")) {
            return localStorage.getItem("themeMode")
        }
        else {
            return "dark"
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (themeMode === "light") {
            root.classList.remove("dark");
        } else {
            root.classList.add("dark");
        }

        localStorage.setItem("themeMode", themeMode);

    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext value={{ themeMode, toggleTheme }}>
            {children}
        </ThemeContext>
    );
}

// export const ThemeProvider = ThemeContext.Provider

export default function useTheme() {
    return useContext(ThemeContext)
}