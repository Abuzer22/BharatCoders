import ChatBot from "./components/ChatBot";
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
  const [lang, setLang] = useState<Language>("en");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [state, setState] = useState("All States");
  const [occupation, setOccupation] = useState("");
  const [results, setResults] = useState<Scheme[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [applicationSuccess, setApplicationSuccess] =
    useState<string | null>(null);

  /* ================= SEARCH ================= */

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      const userAge = parseInt(age) || 0;
      const userIncome = parseInt(income) || 0;

      const filtered = SCHEMES.filter((scheme) => {
        if (userIncome > scheme.maxIncome) return false;

        if (
          scheme.state !== "All" &&
          state !== "All States" &&
          scheme.state !== state
        )
          return false;

        if (scheme.occupation !== "All") {
          const occ = Array.isArray(scheme.occupation)
            ? scheme.occupation
            : [scheme.occupation];
          if (!occ.includes(occupation)) return false;
        }

        if (scheme.minAge && userAge < scheme.minAge) return false;
        if (scheme.maxAge && userAge > scheme.maxAge) return false;

        return true;
      });

      setResults(filtered);
      setIsSearching(false);
    }, 600);
  };

  /* ================= APPLY ================= */

  const handleApply = async (scheme: Scheme) => {
    try {
      const res = await fetch("http://localhost:5000/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user-1",
          schemeId: scheme.id,
        }),
      });

      if (!res.ok) {
        alert("You already applied for this scheme.");
        return;
      }

      if (scheme.applyLink) {
        window.open(scheme.applyLink, "_blank");
      }

      setApplicationSuccess(
        lang === "en" ? scheme.title_en : scheme.title_hi
      );
      setTimeout(() => setApplicationSuccess(null), 2500);
    } catch {
      alert("Server not reachable");
    }
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

        {/* FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8"
        >
          <form
            onSubmit={handleSearch}
            className="grid md:grid-cols-2 gap-6"
          >
            <InputField
              icon={<User className="w-4 h-4" />}
              label="Your Age"
              value={age}
              onChange={setAge}
              type="number"
            />

            <InputField
              icon={<IndianRupee className="w-4 h-4" />}
              label="Annual Income (₹)"
              value={income}
              onChange={setIncome}
              type="number"
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
              <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.01] active:scale-[0.98] transition">
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
    whileHover={{ y: -4 }}
    className="group bg-white rounded-2xl border border-slate-200 
               shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 
               transition-all duration-300 p-6 flex flex-col"
  >
    {/* Top Row */}
    <div className="flex items-start justify-between mb-3">
      <h4 className="text-lg font-semibold text-slate-900 leading-snug">
        {lang === "en" ? scheme.title_en : scheme.title_hi}
      </h4>

      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      </div>
    </div>

    {/* Description (rural friendly hint) */}
    <p className="text-sm text-slate-500 mb-5 leading-relaxed">
      Eligible government benefit based on your profile.
    </p>

    {/* Apply Button */}
    <button
      onClick={() => handleApply(scheme)}
      className="mt-auto w-full py-3 rounded-xl font-semibold
                 bg-slate-900 text-white
                 hover:bg-indigo-600
                 active:scale-[0.98]
                 transition-all duration-200"
    >
      Apply Now
    </button>
  </motion.div>
))}
        {/* {results?.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">
                {lang === "en" ? scheme.title_en : scheme.title_hi}
              </h3>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <button
              onClick={() => handleApply(scheme)}
              className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-black transition"
            >
              Apply Now
            </button>
          </div>
        ))} */}
      </section>

      {/* SUCCESS */}
      {applicationSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl">
          Application Initiated Successfully!
        </div>
      )}

      {/* CHATBOT */}
      <ChatBot
        onAutoFill={(data) => {
          if (data.state) setState(data.state);
          if (data.occupation) setOccupation(data.occupation);
          if (data.age !== undefined) setAge(String(data.age));
          if (data.income !== undefined)
            setIncome(String(data.income));
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
}: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-1">
        {icon}
        {label}
      </label>
      <input
        type={type}
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