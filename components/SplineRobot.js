'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
    ssr: false,
});

export default function SplineRobot() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-12 h-12 border-4 border-white/5 border-t-white/30 rounded-full animate-spin"></div>
                </div>
            )}
            <div className="relative z-10 w-full h-full scale-110 pointer-events-auto">
                <Spline
                    scene="/genkub_greeting_robot.spline"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}
