import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Form() {
  const navigate = useNavigate();
  const [exam, setExam] = useState("indore");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    category: "General",
    gender: "Male",
    isPWD: false,
    tenPercentage: "",
    tenBoard: "CBSE",
    twelvePercentage: "",
    stream: "Commerce",
    score1: "",
    score2: "",
    score3: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      score1: "",
      score2: "",
      score3: "",
    }));
  }, [exam]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  function predictExam(exam, category, s1, s2, s3) {
    s1 = Number(s1) || 0;
    s2 = Number(s2) || 0;
    s3 = Number(s3) || 0;
    const totalScore = s1 + s2 + s3;

    let cutoff = 0;
    let sectionNames = [];
    let maxMarks = [];

    if (exam === "indore") {
      const cutoffs = {
        General: { s1: 24, s2: 28, s3: 112 },
        EWS: { s1: 16, s2: 18, s3: 87 },
        "NC-OBC": { s1: 12, s2: 15, s3: 78 },
        SC: { s1: 12, s2: 10, s3: 65 },
        ST: { s1: 8, s2: 6, s3: 48 },
        PwD: { s1: 8, s2: 5, s3: 47 },
      };
      const c = cutoffs[category] || cutoffs.General;
      cutoff = c.s1 + c.s2 + c.s3;
      sectionNames = ["QA (SA)", "QA (MCQ)", "Verbal Ability"];
      maxMarks = [60, 120, 180];

      const clearsSectionals = s1 >= c.s1 && s2 >= c.s2 && s3 >= c.s3;
      let probability = "Low";
      if (clearsSectionals) {
        const margin = (s1 - c.s1) + (s2 - c.s2) + (s3 - c.s3);
        probability = margin >= 20 ? "High" : "Borderline";
      }

      return { totalScore, clearsSectionals, probability, sectionNames, maxMarks, required: c };
    }

    if (exam === "rohtak") {
      const cutoffs = {
        General: 381,
        EWS: 331,
        "NC-OBC": 297,
        SC: 230,
        ST: 138,
        PwD: 274,
      };
      cutoff = cutoffs[category] || cutoffs.General;
      sectionNames = ["QA", "Logical Reasoning", "Verbal Ability"];
      maxMarks = [160, 160, 160];

      const clearsSectionals = totalScore >= cutoff;
      let probability = "Low";
      if (clearsSectionals) {
        const margin = totalScore - cutoff;
        probability = margin >= 20 ? "High" : "Borderline";
      }

      return { totalScore, clearsSectionals, probability, sectionNames, maxMarks, required: { total: cutoff } };
    }

    if (exam === "jipmat") {
      const cutoffs = {
        General: 290,
        EWS: 245,
        "NC-OBC": 226,
        SC: 148,
        ST: 190,
        PwD: 154,
      };
      cutoff = cutoffs[category] || cutoffs.General;
      sectionNames = ["Quant", "DI/LR", "Verbal Ability"];
      maxMarks = [132, 132, 136];

      const clearsSectionals = totalScore >= cutoff;
      let probability = "Low";
      if (clearsSectionals) {
        const margin = totalScore - cutoff;
        probability = margin >= 20 ? "High" : "Borderline";
      }

      return { totalScore, clearsSectionals, probability, sectionNames, maxMarks, required: { total: cutoff } };
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = predictExam(
        exam,
        formData.category,
        formData.score1,
        formData.score2,
        formData.score3
      );

      navigate("/result", {
        state: { exam, ...formData, ...result },
      });
    } catch (err) {
      console.error(err);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#121212] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F1F1F] p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10 text-white">IPMAT Tools</h2>
        <nav className="space-y-4">
          <div className="text-sm text-gray-400 uppercase tracking-wide">Exams</div>
          {["indore", "rohtak", "jipmat"].map((id) => (
            <button
              key={id}
              onClick={() => setExam(id)}
              className={`block w-full text-left px-4 py-3 rounded-lg capitalize font-medium transition ${
                exam === id ? "bg-blue-600 shadow-md" : "hover:bg-gray-800"
              }`}
            >
              {id === "jipmat" ? "JIPMAT" : `IPMAT ${id}`}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[#1F1F1F] py-5 px-8 shadow-md">
          <h1 className="text-2xl font-bold text-white">IPMAT Call Predictor 2026</h1>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  placeholder="10-digit number"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-500 bg-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-500 bg-[#2A2A2A] rounded-lg text-white"
                >
                  <option>General</option>
                  <option>EWS</option>
                  <option>NC-OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>PwD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-500 bg-[#2A2A2A] rounded-lg text-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex items-center mt-8">
                <input
                  name="isPWD"
                  type="checkbox"
                  checked={formData.isPWD}
                  onChange={handleChange}
                  className="h-6 w-6 text-blue-500 rounded focus:ring-blue-400"
                />
                <label className="ml-3 text-lg font-medium">PWD Candidate?</label>
              </div>
            </section>

            {/* Academic Records */}
            <section className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-5">Academic Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="10th Percentage" name="tenPercentage" value={formData.tenPercentage} onChange={handleChange} placeholder="e.g. 95.6" step="0.1"/>
                <div>
                  <label className="block text-sm font-medium mb-2">10th Board</label>
                  <select name="tenBoard" value={formData.tenBoard} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-500 bg-[#2A2A2A] rounded-lg text-white">
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input label="12th Percentage" name="twelvePercentage" value={formData.twelvePercentage} onChange={handleChange} placeholder="e.g. 96.4" step="0.1"/>
                <div>
                  <label className="block text-sm font-medium mb-2">12th Stream</label>
                  <select name="stream" value={formData.stream} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-500 bg-[#2A2A2A] rounded-lg text-white">
                    <option>Commerce</option>
                    <option>Science (PCM)</option>
                    <option>Science (PCB)</option>
                    <option>Humanities/Arts</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Exam Scores */}
            <section>
              <h3 className="text-lg font-semibold mb-5">Raw Scores</h3>
              <div className="grid grid-cols-1 gap-6">
                {exam === "indore" && (
                  <>
                    <Input label="QA (SA) – max 60" name="score1" value={formData.score1} onChange={handleChange} max="60"/>
                    <Input label="QA (MCQ) – max 120" name="score2" value={formData.score2} onChange={handleChange} max="120"/>
                    <Input label="Verbal Ability – max 180" name="score3" value={formData.score3} onChange={handleChange} max="180"/>
                  </>
                )}
                {exam === "rohtak" && (
                  <>
                    <Input label="QA – max 160" name="score1" value={formData.score1} onChange={handleChange} max="160"/>
                    <Input label="Logical Reasoning – max 160" name="score2" value={formData.score2} onChange={handleChange} max="160"/>
                    <Input label="Verbal Ability – max 160" name="score3" value={formData.score3} onChange={handleChange} max="160"/>
                  </>
                )}
                {exam === "jipmat" && (
                  <>
                    <Input label="Quant – max 132" name="score1" value={formData.score1} onChange={handleChange} max="132"/>
                    <Input label="DI/LR – max 132" name="score2" value={formData.score2} onChange={handleChange} max="132"/>
                    <Input label="Verbal Ability – max 136" name="score3" value={formData.score3} onChange={handleChange} max="136"/>
                  </>
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xl font-bold rounded-xl shadow-lg transition transform hover:scale-105"
            >
              {loading ? "Predicting Your Chances..." : "Predict My Call Chances"}
            </button>
          </form>
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="text-white text-2xl font-medium animate-pulse">Analyzing your scores...</div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder, min, max, step }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min || 0}
        max={max}
        step={step || "1"}
        className="w-full px-4 py-3 border-2 border-blue-500 bg-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        required
      />
    </div>
  );
}
