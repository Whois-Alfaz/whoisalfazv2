'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ActivityNode = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
    <motion.div
        className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0.5]
        }}
        transition={{
            duration: 2,
            delay,
            repeat: Infinity,
            repeatType: "reverse"
        }}
    />
);

const ConnectionLine = ({ start, end, delay }: { start: { x: number, y: number }; end: { x: number, y: number }; delay: number }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-500/20">
        <motion.line
            x1={`${start.x}%`}
            y1={`${start.y}%`}
            x2={`${end.x}%`}
            y2={`${end.y}%`}
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        />
    </svg>
);

export default function AutomationVisual() {
    const [scanLineY, setScanLineY] = useState(0);

    // Nodes configuration
    const nodes = [
        { id: 1, x: 20, y: 30 },
        { id: 2, x: 50, y: 20 },
        { id: 3, x: 80, y: 40 },
        { id: 4, x: 30, y: 70 },
        { id: 5, x: 70, y: 75 },
        { id: 6, x: 50, y: 50 }, // Central Hub
    ];

    return (
        <div className="relative w-full h-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 font-mono text-xs">

            {/* Background Grid */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Title / Status */}
            <div className="absolute top-4 left-4 text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>SYSTEM_ANALYSIS_ACTIVE</span>
            </div>

            {/* Nodes & Connections */}
            {nodes.map((node, i) => (
                <ActivityNode key={node.id} x={node.x} y={node.y} delay={i * 0.2} />
            ))}

            <ConnectionLine start={nodes[0]} end={nodes[5]} delay={0.5} />
            <ConnectionLine start={nodes[1]} end={nodes[5]} delay={0.7} />
            <ConnectionLine start={nodes[2]} end={nodes[5]} delay={0.9} />
            <ConnectionLine start={nodes[3]} end={nodes[5]} delay={1.1} />
            <ConnectionLine start={nodes[4]} end={nodes[5]} delay={1.3} />

            {/* Scanning Line */}
            <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Data Packet Simulation */}
            <motion.div
                className="absolute bg-white/5 border border-white/10 p-2 rounded text-[10px] text-blue-300 backdrop-blur-md"
                initial={{ right: 20, bottom: 20, opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 0] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            >
                <div>Packet: #294A</div>
                <div>Status: OPTIMIZED</div>
                <div>Latency: 12ms</div>
            </motion.div>

        </div>
    );
}
