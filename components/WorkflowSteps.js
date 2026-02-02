'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        num: 1,
        title: "Discovery & Audit",
        color: "blue",
        border: "border-blue-500/20",
        bg: "bg-blue-500/10",
        text: "text-blue-400"
    },
    {
        num: 2,
        title: "Draft Strategy",
        color: "purple",
        border: "border-purple-500/20",
        bg: "bg-purple-500/10",
        text: "text-purple-400"
    },
    {
        num: 3,
        title: "Solution Build",
        color: "orange",
        border: "border-orange-500/20",
        bg: "bg-orange-500/10",
        text: "text-orange-400"
    },
    {
        num: 4,
        title: "Final & Support",
        color: "green",
        border: "border-green-500/20",
        bg: "bg-green-500/10",
        text: "text-green-400"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};

export default function WorkflowSteps() {
    return (
        <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent -translate-y-1/2 hidden md:block"></div>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
            >
                {steps.map((step) => (
                    <motion.div
                        key={step.num}
                        variants={item}
                        whileHover={{
                            y: -10,
                            scale: 1.05,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                        className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 shadow-lg mx-auto w-full max-w-[200px] hover:border-white/20 hover:bg-[#111] transition-colors"
                    >
                        <motion.div
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className={`w-12 h-12 rounded-full ${step.bg} ${step.text} flex items-center justify-center font-bold mx-auto mb-4 border ${step.border}`}
                        >
                            {step.num}
                        </motion.div>
                        <h3 className="text-white font-medium text-sm md:text-base">{step.title}</h3>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
