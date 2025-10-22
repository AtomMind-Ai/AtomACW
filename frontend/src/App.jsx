import React, { useState, useRef, useEffect } from "react";
import Editor from "./components/Editor";
import CommentPanel from "./components/CommentPanel";
import ChatDrawer from "./components/ChatDrawer";
import { useHotkeys } from "react-hotkeys-hook";
import { readFile, saveText, saveDocx } from "./utils/fileUtils";
import { askSuggest, askReview, askChat } from "./utils/api";
import { FileUp, Save, Trash } from "lucide-react";

export default function App() {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [memory, setMemory] = useState([]); // LLM chat memory
  const fileInput = useRef();
  const messagesEndRef = useRef();

  useHotkeys("ctrl+enter", () => setChatOpen((v) => !v));
  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    handleSave();
  });

  useEffect(() => {
    // Welcome message when chat opens
    if (chatOpen && messages.length === 0) {
      const welcome = {
        role: "assistant",
        text: "Hello! How can I assist you today? 😊",
      };
      setMessages([welcome]);
      setMemory([welcome]);
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const content = await readFile(file);
    setText(content);
  };

  const handleSave = () => {
    if (!text.trim()) return;
    saveText(text, "document.txt");
  };

  const handleAIComment = async () => {
    const res = await askReview(text);
    if (res.comments)
      setComments(
        res.comments.map((c) => ({ id: Date.now() + Math.random(), ...c }))
      );
  };

  const handleResolve = (id, silent) => {
    if (!silent) setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleQuickFix = async (comment) => {
    const res = await askSuggest(comment.text, "Apply fix directly.");
    alert(`Quick Fix Suggestion:\n${res.suggestion}`);
  };

  const handleSendChat = async (msg) => {
    const userMsg = { role: "user", content: msg };
    setMessages((m) => [...m, userMsg]);
    const newMemory = [...memory, userMsg];

    const res = await askChat(msg, text, newMemory);
    const assistantMsg = { role: "assistant", content: res.response };

    setMessages((m) => [...m, assistantMsg]);
    setMemory([...newMemory, assistantMsg]);
  };

  const handleClearMemory = () => {
    setMemory([]);
    setMessages([]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="p-2 border-b bg-white flex items-center gap-2">
        <button
          onClick={() => fileInput.current.click()}
          className="flex items-center gap-1 border px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          <FileUp size={16} /> Open
        </button>
        <input
          type="file"
          accept=".txt,.docx"
          ref={fileInput}
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-1 border px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          <Save size={16} /> Save
        </button>
        <button
          onClick={handleAIComment}
          className="ml-auto text-sm bg-blue-500 text-white px-3 py-1 rounded-lg"
        >
          AI Review
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 p-3">
          <Editor text={text} onChange={setText} />
        </div>
        <div className="w-1/3 border-l bg-gray-50">
          <CommentPanel
            comments={comments}
            onResolve={handleResolve}
            onQuickFix={handleQuickFix}
          />
        </div>
      </div>

      <ChatDrawer
        open={chatOpen}
        messages={messages}
        onSend={handleSendChat}
        onClearMemory={handleClearMemory} // pass clear memory callback
        messagesEndRef={messagesEndRef} // auto-scroll
      />
    </div>
  );
}
