'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from "@studio-freight/lenis";

export default function LenisScroller() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname?.startsWith('/admin')) return;

        const lenisScroll = new Lenis({
            lerp: 0,
            //wheelMultiplier: 0.8
            wheelMultiplier: 1.3
        });

        function raf(time) {
            lenisScroll.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisScroll.destroy();
        };
    }, [pathname]);

    return <></>;
}
