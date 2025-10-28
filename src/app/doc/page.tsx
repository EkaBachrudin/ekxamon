'use client';

import { ThemeToggler } from "@/ui/components/common/theme-toggler";

const DocPage = () => {
    return (
        <>
            <ThemeToggler />
            <div className="neon:bg-black">HomePage</div>
        </>
    )
}

export default DocPage;