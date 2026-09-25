import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface AIGeneratorProps {
  onGenerate: (prompt: string) => Promise<void>;
  disabled?: boolean;
  type: "blog" | "career";
}

export default function AIGenerator({ onGenerate, disabled, type }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate(prompt);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const placeholder = type === "blog"
    ? "e.g., Write an SEO-friendly blog about the future of AI in modern web development..."
    : "e.g., Create a Senior Full Stack Developer position for our Noida office...";

  return (
    <div className="bg-white border border-technic-border rounded-2xl p-6 mb-8 shadow-tn-sm">
      <div className="flex items-center mb-4">
        <span className="w-9 h-9 rounded-xl bg-technic-cyan-soft flex items-center justify-center mr-3">
          <Sparkles className="w-5 h-5 text-technic-cyan-deep" />
        </span>
        <h2 className="text-xl font-bold text-technic-text">AI Generator</h2>
        <span className="ml-auto h-2 w-2 rounded-full bg-technic-orange" aria-hidden="true" />
      </div>

      <p className="text-technic-muted text-sm mb-4">
        Describe what you want to create and AI will populate the form for you.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="ai-prompt">AI prompt</label>
        <input
          id="ai-prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isGenerating}
          className="tn-input flex-1 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled && !isGenerating) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={disabled || isGenerating || !prompt.trim()}
          className="bg-brand-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium transition-opacity hover:opacity-95 whitespace-nowrap shadow-tn-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate with AI
            </>
          )}
        </button>
      </div>
    </div>
  );
}
