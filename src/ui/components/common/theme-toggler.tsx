'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react";

export const ThemeToggler = () => {

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    const handleClick = () => {
        if(theme === 'light') setTheme('dark');
        if(theme === 'dark') setTheme('neon');
        if(theme === 'neon') setTheme('light');
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) {
        return <button className="text-xs bg-foreground text-background rounded size-7 animate-pulse" />
    }

    return (
        <> 
            <button 
                className="text-xs bg-foreground text-background rounded px-2 py-1 size-7"
                onClick={handleClick}
            >
                {theme === 'dark' ? 'D' : theme === 'neon' ? 'N' : 'L'}
            </button>

            
        </>
    )
}