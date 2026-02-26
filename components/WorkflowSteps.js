import { ArrowRight } from 'lucide-react';

const steps = [
    {
        num: 1,
        title: "Discovery & Audit",
        border: "border-blue-500/20",
        bg: "bg-blue-500/10",
        text: "text-blue-400"
    },
    {
        num: 2,
        title: "Draft Strategy",
        border: "border-purple-500/20",
        bg: "bg-purple-500/10",
        text: "text-purple-400"
    },
    {
        num: 3,
        title: "Solution Build",
        border: "border-orange-500/20",
        bg: "bg-orange-500/10",
        text: "text-orange-400"
    },
    {
        num: 4,
        title: "Final & Support",
        border: "border-green-500/20",
        bg: "bg-green-500/10",
        text: "text-green-400"
    }
];

export default function WorkflowSteps() {
    return (
        <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {steps.map((step, i) => (
                    <div
                        key={step.num}
                        className="workflow-step bg-[#0a0a0a] p-4 rounded-xl border border-white/5 shadow-lg mx-auto w-full max-w-[200px] hover:border-white/20 hover:bg-[#111] transition-all duration-300 hover:-translate-y-2"
                        style={{ animationDelay: `${i * 150}ms` }}
                    >
                        <div className={`w-12 h-12 rounded-full ${step.bg} ${step.text} flex items-center justify-center font-bold mx-auto mb-4 border ${step.border} transition-transform duration-300 hover:scale-110`}>
                            {step.num}
                        </div>
                        <h3 className="text-white font-medium text-sm md:text-base">{step.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
