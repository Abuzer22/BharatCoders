import { Mic } from "lucide-react";

export default function VoiceInput({
  onResult,
}: {
  onResult: (text: string) => void;
}) {
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    // 🌾 Rural friendly language (Hindi India)
    recognition.lang = "hi-IN";

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = () => {
      alert("Voice recognition error");
    };
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className="flex items-center justify-center w-12 h-12 rounded-xl
                 bg-indigo-600 text-white hover:bg-indigo-700
                 active:scale-95 transition"
      title="Speak"
    >
      <Mic className="w-5 h-5" />
    </button>
  );}
