import { useContext } from "react";
import { ThemeContext } from "./themeContext";

const useTheme = () => {
    return useContext(ThemeContext);
}
    export default useTheme

