"use client";

import { useState } from "react";
import { Search, Sparkles, Zap, Brain, MessageSquare, Terminal, ChevronRight } from "lucide-react";
import WhopProductCard from "./WhopProductCard";

export default function StoreCatalog({ products }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Products", icon: Sparkles },
    { id: "ai-rag", name: "AI & RAG", icon: Brain },
    { id: "outreach", name: "Outreach & Email", icon: Zap },
    { id: "inbound", name: "Inbound & Chat", icon: MessageSquare },
    { id: "revops", name: "RevOps & Systems", icon: Terminal },
  ];

  const filteredProducts = products.filter((p) => {
    // 1. Category Filter
    if (filter !== "all" && p.category !== filter) return false;

    // 2. Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(query);
      const descMatch = p.description.toLowerCase().includes(query);
      const tagMatch = p.integrations.some((t) => t.toLowerCase().includes(query));
      return titleMatch || descMatch || tagMatch;
    }

    return true;
  });

  // Separate bundle from other products to highlight it
  const bundle = products.find((p) => p.isBundle);
  const otherProducts = filteredProducts.filter((p) => !p.isBundle);

  // If "all" is selected and no search query, show bundle highlighted at the top
  const showBundleHeader = filter === "all" && searchQuery.trim() === "" && bundle;

  return (
    <div className="space-y-12">
      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                    : "bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08]"
                }`}
              >
                <Icon size={14} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates & integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-8">
        {/* 1. Bundle Highlight */}
        {showBundleHeader && (
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
            
            <div className="relative bg-white dark:bg-slate-950/20 bg-gradient-to-r from-teal-500/5 to-purple-500/5 dark:from-teal-500/10 dark:to-purple-500/10 border border-slate-200 dark:border-teal-500/30 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl dark:shadow-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 -z-10" />
              
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider">
                    ⭐ Master Collection Bundle
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                    {bundle.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                    {bundle.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {bundle.integrations.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/[0.04] text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-auto lg:min-w-[340px]">
                  <WhopProductCard
                    title={bundle.title}
                    description="All 18 production workflows + updates"
                    price={`$${bundle.price}`}
                    checkoutUrl={bundle.purchaseUrl}
                    isBundle={true}
                    features={[
                      "All 18 Individual JSON Blueprints",
                      "30 Days of Automation Live Updates",
                      "SOP Integration Guides & Video Walks",
                      "Lifetime Free Workflows Guarantee",
                      "12-Month Breaking Change Insurance",
                      "Private Discord Support Access"
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Grid of other products */}
        {otherProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProducts.map((p) => (
              <div key={p.planId} className="flex flex-col h-full bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-teal-500/50 transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-md">
                {/* Glow ring on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-500 dark:text-teal-400 uppercase tracking-wider">
                        {p.category === "ai-rag" && "AI & RAG"}
                        {p.category === "outreach" && "Outreach"}
                        {p.category === "inbound" && "Inbound"}
                        {p.category === "revops" && "RevOps"}
                      </span>
                      <span className="text-lg font-black text-teal-600 dark:text-teal-400">
                        ${p.price}
                      </span>
                    </div>

                    {/* Image Placeholder with high aesthetics */}
                    <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                      <img
                        src={`/images/blog/${p.image}`}
                        alt={p.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-90"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-mono truncate uppercase tracking-widest bg-slate-950/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10 w-fit">
                        {p.integrations.join(" + ")}
                      </div>
                    </div>

                    {/* Text info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6">
                    <a
                      href={p.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      Buy Workflow
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showBundleHeader && (
            <div className="text-center py-16 bg-white/50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/10 rounded-3xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No templates match your search filters. Try selecting another category or query.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
