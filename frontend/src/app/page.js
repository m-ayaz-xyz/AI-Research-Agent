"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!topic.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/research", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          topic: topic.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Research failed");
      }

      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}

        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-zinc-500">
            AI RESEARCH AGENT
          </p>

          <h1 className="text-4xl font-bold">Research any topic</h1>

          <p className="mt-3 text-zinc-400">
            Search the web, analyze a source, write a report and get it
            reviewed.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <label htmlFor="topic" className="mb-3 block text-sm font-medium">
            Research Topic
          </label>

          <textarea
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            disabled={loading}
            placeholder="Enter your research topic..."
            rows={5}
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-400"
          />

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="mt-4 rounded-xl bg-white px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Researching..." : "Start Research"}
          </button>
        </form>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />

              <div>
                <p className="font-medium">AI Agent is working...</p>

                <p className="mt-1 text-sm text-zinc-500">
                  Search → Reader → Writer → Critic
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Result */}

        {result && (
          <div className="mt-8 space-y-6">
            {/* Search Results */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Search Results</h2>

              <pre className="whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                {result.search_results}
              </pre>
            </section>

            {/* Scraped Content */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Scraped Content</h2>

              <pre className="max-h-125 overflow-auto whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                {result.scraped_content}
              </pre>
            </section>

            {/* Final Report */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Final Report</h2>

                <button
                  onClick={() => navigator.clipboard.writeText(result.report)}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-xs hover:bg-zinc-800"
                >
                  Copy
                </button>
              </div>

              <article className="whitespace-pre-wrap leading-8 text-zinc-300">
                {result.report}
              </article>
            </section>

            {/* Critic */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-5 text-xl font-semibold">Critic Review</h2>

              <pre className="whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                {result.feedback}
              </pre>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
