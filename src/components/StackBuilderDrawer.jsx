import React, { useState } from "react";
import { useStackBuilder } from "../context/StackBuilderContext";

export default function StackBuilderDrawer() {
  const {
    stack,
    removeFromStack,
    clearStack,
    isOpen,
    setIsOpen,
    unifiedTerraform,
    unifiedRego
  } = useStackBuilder();

  const [activeTab, setActiveTab] = useState("tf"); // 'tf' or 'rego'
  const [copied, setCopied] = useState(false);

  if (stack.length === 0 && !isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTf = () => {
    const element = document.createElement("a");
    const file = new Blob([unifiedTerraform], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "main.tf";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadRego = () => {
    const element = document.createElement("a");
    const file = new Blob([unifiedRego], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "policy.rego";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-purple-600/30 flex items-center gap-2 hover:scale-105 transition"
        >
          <span>📦</span>
          <span>Architecture Stack</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
            {stack.length}
          </span>
        </button>
      )}

      {/* Drawer Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between text-slate-100 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-lg text-white">Unified Architecture Stack</h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs">
                    {stack.length} selected
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Export merged deployable Terraform IaC and OPA Rego policy bundles.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stack Items List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {stack.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <p className="text-sm mb-2">Your architecture stack is currently empty.</p>
                  <p className="text-xs">
                    Click <strong>"+ Add to Stack"</strong> on any blueprint across AWS, Azure, GCP, Civo, or Hetzner to assemble a custom deployment bundle.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>Selected Blueprints ({stack.length})</span>
                      <button
                        onClick={clearStack}
                        className="text-red-400 hover:text-red-300 text-xs lowercase"
                      >
                        clear all
                      </button>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {stack.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-950/70 border border-slate-800/80 rounded-lg px-3 py-2 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-purple-400 shrink-0">{item.id}</span>
                            <span className="text-slate-200 truncate">{item.title}</span>
                          </div>
                          <button
                            onClick={() => removeFromStack(item.id)}
                            className="text-slate-500 hover:text-red-400 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Combined Code Preview */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                        <button
                          onClick={() => setActiveTab("tf")}
                          className={`px-3 py-1 rounded font-semibold transition ${
                            activeTab === "tf" ? "bg-purple-600 text-white" : "text-slate-400"
                          }`}
                        >
                          Unified main.tf
                        </button>
                        <button
                          onClick={() => setActiveTab("rego")}
                          className={`px-3 py-1 rounded font-semibold transition ${
                            activeTab === "rego" ? "bg-purple-600 text-white" : "text-slate-400"
                          }`}
                        >
                          Unified policy.rego
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopy(activeTab === "tf" ? unifiedTerraform : unifiedRego)}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                      >
                        {copied ? "Copied to Clipboard!" : "Copy Full Code"}
                      </button>
                    </div>

                    <pre className="text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-300 max-h-72 overflow-auto">
                      {activeTab === "tf" ? unifiedTerraform : unifiedRego}
                    </pre>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Drawer
              </button>

              <div className="flex gap-2">
                <button
                  disabled={stack.length === 0}
                  onClick={handleDownloadTf}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 disabled:opacity-30 transition"
                >
                  Download main.tf
                </button>
                <button
                  disabled={stack.length === 0}
                  onClick={handleDownloadRego}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 disabled:opacity-30 transition"
                >
                  Download policy.rego
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
