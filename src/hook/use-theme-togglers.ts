// 'use client'

// import { useEffect, useState } from "react";

// export const useThemeTogglers = () => {
//     const [theme, setTheme] = useState<null | 'dark' | 'neon'>(null);

//     useEffect(() => {
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme === 'dark' || savedTheme === 'neon') {
//             setTheme(savedTheme);

//             const html = document.querySelector('html')!
            
//             html.classList.add(savedTheme);
//         }
//     }, [])

//     useEffect(() => {
//          const html = document.querySelector('html')!

//          html.classList.remove('dark', 'neon');

//         if (theme === 'dark') {
//             html.classList.add('dark');
//             localStorage.setItem('theme', 'dark');
//         } else if(theme === 'neon') {
//             html.classList.add('neon');
//             localStorage.setItem('theme', 'neon');
//         } else {
//             localStorage.removeItem('theme');
//         }
//     }, [theme])

//     const toggleTheme = () => {
//         if (theme === 'dark') {
//             setTheme('neon');
//         } else if(theme === 'neon') {
//             setTheme(null);

//         } else {
//             setTheme('dark');
//         }
//     }

//     return { theme, toggleTheme }
// }