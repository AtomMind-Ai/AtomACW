import React from "react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";

export default function ChatDrawer({ open, messages, onSend, onClearMemory, messagesEndRef }) {
  const [input, setInput] = React.useState("");

  return (
    <motion.div
      animate={{ x: open ? 0 : 400 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl border-l flex flex-col"
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="font-semibold text-gray-700">Chat</h2>
        <button
          onClick={onClearMemory}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
          title="Clear Memory"
        >
          <Trash size={16} /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl ${m.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100"}`}
          >
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          onSend(input);
          setInput("");
        }}
        className="p-3 border-t flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg p-2 text-sm"
          placeholder="Ask AI..."
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
          Send
        </button>
      </form>
    </motion.div>
  );
}
