import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface AIGeneratorProps {
  onGenerate: (prompt: string) => Promise<void>;
  disabled?: boolean;
  replaceExisting?: boolean;
  type: "blog" | "career" | "service" | "solution" | "product";
}

function askToReplace() {
  return new Promise<boolean>((resolve) => {
    toast.custom((item) => (
      <div className="w-80 rounded-xl border border-technic-border bg-white p-4 shadow-tn-md">
        <p className="text-sm font-semibold text-technic-text">Replace the current content?</p>
        <p className="mt-1 text-sm text-technic-secondary">AI will fill the form. Uploaded images stay as they are.</p>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="rounded-lg px-3 py-1.5 text-sm text-technic-secondary" onClick={() => { toast.dismiss(item.id); resolve(false); }}>
            Cancel
          </button>
          <button type="button" className="rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-semibold text-white" onClick={() => { toast.dismiss(item.id); resolve(true); }}>
            Replace
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  });
}

export default function AIGenerator({ onGenerate, disabled, replaceExisting = false, type }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }

    if (replaceExisting) {
      const confirmed = await askToReplace();
      if (!confirmed) return;
    }

    setIsGenerating(true);
    try {
      await onGenerate(prompt);
      toast.success("Form updated from your prompt.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const placeholder = type === "blog"
    ? "e.g., Write an SEO-friendly blog about the future of AI in modern web development..."
    : type === "career"
    ? "e.g., Create a Senior Full Stack Developer position for our Noida office..."
    : type === "solution"
    ? "e.g., Write a Healthcare Solutions page for hospitals and clinics..."
    : type === "product"
    ? "e.g., A delivery app. Play Store https://play.google.com/store/apps/details?id=com.example.app and App Store https://apps.apple.com/app/id123. Or a website at https://example.com"
    : "e.g., Write a Custom Website Development service page for growing businesses...";

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
