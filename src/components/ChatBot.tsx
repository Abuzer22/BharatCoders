import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

type AutoFillData = {
  state?: string;
  occupation?: string;
  age?: number;
  income?: number;
};

type Props = {
  onAutoFill?: (data: AutoFillData) => void;
};

export default function ChatBot({ onAutoFill }: Props) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! Tell me about yourself (e.g., 'UP farmer income 2 lakh').",
    },
  ]);
  const [input, setInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // 🔥 smart parser
  const extractInfo = (text: string): AutoFillData => {
    const lower = text.toLowerCase();
    const data: AutoFillData = {};

    if (lower.includes("farmer")) data.occupation = "Farmer";
    if (lower.includes("student")) data.occupation = "Student";
    if (lower.includes("unemployed")) data.occupation = "Unemployed";

    if (lower.includes("up") || lower.includes("uttar"))
      data.state = "Uttar Pradesh";
    if (lower.includes("delhi")) data.state = "Delhi";
    if (lower.includes("maharashtra")) data.state = "Maharashtra";

    const lakhMatch = lower.match(/(\d+)\s*lakh/);
    if (lakhMatch) data.income = Number(lakhMatch[1]) * 100000;

    const incomeNum = lower.match(/\b\d{5,7}\b/);
    if (incomeNum) data.income = Number(incomeNum[0]);

    const ageMatch = lower.match(/age\s*(\d+)/);
    if (ageMatch) data.age = Number(ageMatch[1]);

    return data;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setTyping(true);

    const extracted = extractInfo(userText);
    onAutoFill?.(extracted);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Got it 👍 I’ve filled your details. Click 'Find My Schemes' to continue.",
        },
      ]);
    }, 900);
  };

  const quickFill = (text: string) => {
    setInput(text);
  };

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(!open)} style={styles.fab}>
  <img
    src="/chatbot.png"
    alt="chatbot"
    style={{ width: 40, height: 40 }}
  />
</button>
      {/* <button onClick={() => setOpen(!open)} style={styles.fab}>
        💬
      </button> */}

      {/* Chat Window */}
      {open && (
        <div style={styles.container}>
          <div style={styles.header}>
            Gov Scheme Assistant
            <span style={styles.statusDot} />
          </div>

          <div style={styles.chatBox}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  ...(m.sender === "user" ? styles.user : styles.bot),
                }}
              >
                {m.text}
              </div>
            ))}

            {typing && <div style={styles.typing}>Bot is typing…</div>}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={styles.quickRow}>
            <button
              style={styles.quickBtn}
              onClick={() => quickFill("UP farmer income 2 lakh")}
            >
              Farmer
            </button>
            <button
              style={styles.quickBtn}
              onClick={() => quickFill("student income 1 lakh")}
            >
              Student
            </button>
            <button
              style={styles.quickBtn}
              onClick={() => quickFill("unemployed age 25")}
            >
              Unemployed
            </button>
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Describe yourself..."
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, CSSProperties> = {


fab: {
  position: "fixed",
  bottom: 24,
  right: 24,
  width: 60,
  height: 60,
  borderRadius: "50%",
//   background: "#4f46e5",
background: "#111827",
  border: "none",
  cursor: "pointer",
  zIndex: 99999,
  boxShadow: "0 12px 30px rgba(79,70,229,.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
container: {
  position: "fixed",
  bottom: 95,
  right: 24,
  width: 360,
  height: 520,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 25px 60px rgba(0,0,0,.18)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 99999,

  /* 🔥 SMOOTH OPEN MAGIC */
  transformOrigin: "bottom right",
  animation: "chatPop 260ms cubic-bezier(.34,1.56,.64,1)",
},
  header: {
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "#fff",
    padding: "14px 16px",
    fontWeight: 600,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  chatBox: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    background: "#f8fafc",
  },
  message: {
    maxWidth: "75%",
    padding: "9px 12px",
    margin: "6px 0",
    borderRadius: 12,
    fontSize: 13,
    lineHeight: 1.4,
  },
  user: {
    background: "#4f46e5",
    color: "#fff",
    marginLeft: "auto",
  },
  bot: {
    background: "#e5e7eb",
    color: "#111",
  },
  typing: {
    fontSize: 12,
    color: "#64748b",
    padding: "4px 6px",
  },
  quickRow: {
    display: "flex",
    gap: 6,
    padding: "6px 8px",
    flexWrap: "wrap",
    borderTop: "1px solid #eee",
    background: "#fff",
  },
  quickBtn: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#f1f5f9",
    cursor: "pointer",
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #e5e7eb",
  },
  input: {
    flex: 1,
    padding: 10,
    border: "none",
    outline: "none",
    fontSize: 13,
  },
  sendBtn: {
    background: "#1106e4",
    color: "#fff",
    border: "none",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
};