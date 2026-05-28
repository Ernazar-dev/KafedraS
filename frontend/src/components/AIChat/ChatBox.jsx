import { useState, useRef, useEffect } from "react";
import { sendMessageToAI } from "../../api/ai";
import ChatMessage from "./ChatMessage";
import { FiSend } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { message: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI(userMsg.message);
      setMessages((prev) => [...prev, { message: aiResponse.reply, isUser: false }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { message: "AI juwap bere almadı 😕", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">

      {/* ─── HEADER ─── */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#02135e] shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <FaRobot className="text-white text-base" />
        </div>
        <div>
          <h3 className="text-white font-bold text-[15px] leading-none">AI Kómekshi</h3>
          <span className="text-white/60 text-[12px]">Sorawlarıńızdı jazıń</span>
        </div>
        {/* Online dot */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          <span className="text-white/60 text-[12px]">Online</span>
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-[#f8fafc]"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-10 select-none">
            <div className="w-16 h-16 rounded-2xl bg-[#02135e]/5 flex items-center justify-center">
              <FaRobot className="text-[#02135e]/30 text-3xl" />
            </div>
            <p className="text-slate-400 text-sm text-center">
              Sálem! Sorawlarıńızdı jazıń,<br />men járdem beremen.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.message} isUser={msg.isUser} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-base shrink-0">
              🤖
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#02135e]/40 animate-bounce inline-block" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#02135e]/40 animate-bounce inline-block" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#02135e]/40 animate-bounce inline-block" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── INPUT AREA ─── */}
      <div className="shrink-0 px-4 py-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-[#f8fafc] border-2 border-slate-200 rounded-xl px-4 py-1 focus-within:border-[#02135e] focus-within:shadow-[0_0_0_4px_rgba(2,19,94,0.08)] transition-all duration-200">
          <input
            type="text"
            placeholder="Sorawınızdı jazıń..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 bg-transparent py-2.5 text-[14px] text-slate-700 outline-none placeholder-slate-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-[#02135e] text-white flex items-center justify-center shrink-0 hover:bg-[#02135e]/90 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <FiSend size={16} />
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Enter basıw arqalı jiberiń
        </p>
      </div>
    </div>
  );
}