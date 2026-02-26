import VoiceInput from "./components/VoiceInput";
import ChatBot from "./components/ChatBot";
import ApplicationForm from "./components/ApplicationForm";
import schemesData from "./data/schemes.json";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  User,
  Globe,
  CheckCircle2,
} from "lucide-react";

/* ================= TYPES ================= */

type Language = "en" | "hi";

interface Scheme {
  id: number;
  title_en: string;
  title_hi: string;
  maxIncome: number;
  state: string;
  occupation: string | string[];
  minAge?: number;
  maxAge?: number;
  applyLink?: string;

  // ⭐ scoring fields
  score?: number;
  reasons?: string[];
  confidence?: "High" | "Medium" | "Low";
  priority?: boolean;
}

const SCHEMES = schemesData as unknown as Scheme[];

const STATES = [
  "All States",
  "Uttar Pradesh",
  "Maharashtra",
  "Karnataka",
  "Delhi",
];

const OCCUPATIONS = [
  "Student",
  "Farmer",
  "Unemployed",
  "Private Employee",
  "Unorganized Sector",
];

/* ================= APP ================= */

export default function App() {
  const [applyScheme, setApplyScheme] = useState<Scheme | null>(null);
  const [lang, setLang] = useState<Language>("en");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [state, setState] = useState("All States");
  const [occupation, setOccupation] = useState("");
  const [results, setResults] = useState<Scheme[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  /* ================= SEARCH ================= */

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    const userAge = Math.max(1, parseInt(age) || 0);
    const userIncome = Math.max(1, parseInt(income) || 0);

    if (!userAge || !userIncome || !occupation) {
      alert("Please fill all required fields properly.");
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const scored = SCHEMES.map((scheme) => {
        let score = 0;
        const reasons: string[] = [];

        // income check
        if (userIncome <= scheme.maxIncome) {
          score += 40;
          reasons.push("Income eligible");
        }

        // state check
        if (
          scheme.state === "All" ||
          state === "All States" ||
          scheme.state === state
        ) {
          score += 30;
          reasons.push("State eligible");
        }

        // occupation check
        const occ = Array.isArray(scheme.occupation)
          ? scheme.occupation
          : [scheme.occupation];

        if (scheme.occupation === "All" || occ.includes(occupation)) {
          score += 20;
          reasons.push("Occupation match");
        }

        // age check
        if (
          (!scheme.minAge || userAge >= scheme.minAge) &&
          (!scheme.maxAge || userAge <= scheme.maxAge)
        ) {
          score += 10;
          reasons.push("Age eligible");
        }

        // ⭐ confidence
        let confidence: "High" | "Medium" | "Low" = "Low";
        if (score >= 80) confidence = "High";
        else if (score >= 60) confidence = "Medium";

        // ⭐ priority
        const priority = score >= 85;

        return { ...scheme, score, reasons, confidence, priority };
      });

      const filtered = scored
        .filter((s) => (s.score ?? 0) >= 40)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      setResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">IndiaThriving</h1>
              <p className="text-[10px] text-slate-400 -mt-1">
                GOVT BENEFITS
              </p>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Discover benefits you{" "}
            <span className="text-indigo-600">qualify</span> for
            <br />
            in seconds.
          </h2>
        </div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8"
        >
          <form onSubmit={handleSearch} className="grid md:grid-cols-2 gap-6">
            <InputField
              icon={<User className="w-4 h-4" />}
              label="Your Age"
              value={age}
              onChange={setAge}
              type="number"
              min={1}
            />

            <InputField
              icon={<IndianRupee className="w-4 h-4" />}
              label="Annual Income (₹)"
              value={income}
              onChange={setIncome}
              type="number"
              min={1}
            />

            <SelectField
              icon={<MapPin className="w-4 h-4" />}
              label="State of Residence"
              value={state}
              onChange={setState}
              options={STATES}
            />

            <SelectField
              icon={<Briefcase className="w-4 h-4" />}
              label="Occupation"
              value={occupation}
              onChange={setOccupation}
              options={OCCUPATIONS}
              placeholder="Select Occupation"
            />

            <div className="md:col-span-2 pt-2">
              <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600">
                {isSearching ? "Searching..." : "Find My Schemes"}
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* RESULTS */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid gap-5">
        {results?.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-slate-900">
                {lang === "en" ? scheme.title_en : scheme.title_hi}
              </h4>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                {scheme.priority && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-purple-100 text-purple-700">
                    Priority
                  </span>
                )}
              </div>
            </div>

            {/* confidence */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-indigo-600">
                Match: {scheme.score ?? 0}%
              </span>

              <span
                className={`text-[10px] font-bold px-2 py-1 rounded
                ${
                  scheme.confidence === "High"
                    ? "bg-emerald-100 text-emerald-700"
                    : scheme.confidence === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {scheme.confidence} Confidence
              </span>
            </div>

            <button
              onClick={() => setApplyScheme(scheme)}
              className="mt-auto w-full py-3 rounded-xl font-semibold bg-slate-900 text-white hover:bg-indigo-600 transition"
            >
              Apply Now
            </button>
          </motion.div>
        ))}

        {/* empty state */}
        {results && results.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg font-semibold mb-2">
              No strong matches found
            </p>
            <p className="text-sm">
              Try adjusting income, state, or occupation.
            </p>
          </div>
        )}
      </section>

      {/* FORM MODAL */}
      {applyScheme && (
        <ApplicationForm
          schemeId={applyScheme.id}
          schemeName={
            lang === "en" ? applyScheme.title_en : applyScheme.title_hi
          }
          onClose={() => setApplyScheme(null)}
        />
      )}

      {/* CHATBOT */}
      <ChatBot
        onAutoFill={(data) => {
          if (data.state) setState(data.state);
          if (data.occupation) setOccupation(data.occupation);
          if (data.age !== undefined) setAge(String(data.age));
          if (data.income !== undefined) setIncome(String(data.income));
        }}
      />
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function InputField({
  icon,
  label,
  value,
  onChange,
  type = "text",
  min,
}: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-1">
        {icon}
        {label}
      </label>
      <input
        type={type}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function SelectField({
  icon,
  label,
  value,
  onChange,
  options,
  placeholder,
}: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-1">
        {icon}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}