import { ThemeProvider as NextThemeProviders } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export const ThemeProvider = ({children, ...props}: ThemeProviderProps) => {
    return <NextThemeProviders {...props} >{children}</NextThemeProviders>
}