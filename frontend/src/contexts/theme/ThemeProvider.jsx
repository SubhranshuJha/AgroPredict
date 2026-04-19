import { useState, useEffect } from "react";
import { ThemeContext } from "./themeContext";

export const ThemeProvider = ({ children }) => {
    const savedTheme = localStorage.getItem("themeMode");

    const [themeMode, setThemeMode] = useState(() => {
        return savedTheme ? savedTheme : "dark";
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