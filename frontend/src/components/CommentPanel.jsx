import React, { useState, useEffect } from "react";
import { Check, Filter, Wand2 } from "lucide-react";

export default function CommentPanel({ comments, onResolve, onQuickFix }) {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("resolvedComments");
    if (saved) {
      const ids = JSON.parse(saved);
      ids.forEach((id) => onResolve(id, true));
    }
  }, []);

  const filtered =
    filter === "all" ? comments : comments.filter((c) => c.type === filter);

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">AI Comments</h2>
        <select
          className="border rounded p-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="grammar">Grammar</option>
          <option value="suggestion">Suggestion</option>
          <option value="clarity">Clarity</option>
        </select>
      </div>

      {filtered.map((c) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl shadow-sm border-l-4 ${
            c.type === "grammar"
              ? "border-blue-400"
              : c.type === "suggestion"
              ? "border-green-400"
              : "border-yellow-400"
          } bg-white`}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">{c.text}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onQuickFix(c)}
                className="text-green-600 hover:text-green-800"
                title="Quick Fix"
              >
                <Wand2 size={16} />
              </button>
              <button
                onClick={() => {
                  onResolve(c.id);
                  const saved =
                    JSON.parse(localStorage.getItem("resolvedComments")) || [];
                  localStorage.setItem(
                    "resolvedComments",
                    JSON.stringify([...saved, c.id])
                  );
                }}
                className="text-gray-500 hover:text-black"
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
