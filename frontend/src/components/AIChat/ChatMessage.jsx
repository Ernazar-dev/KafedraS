export default function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          isUser
            ? "bg-[#02135e] text-white shadow-md shadow-[#02135e]/20"
            : "bg-white border-2 border-slate-200 text-base"
        }`}
      >
        {isUser ? "I" : "🤖"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#02135e] text-white rounded-br-sm"
            : "bg-white text-slate-700 border border-slate-100 rounded-bl-sm"
        }`}
      >
        {message}
      </div>
    </div>
  );
}