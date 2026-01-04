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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exam, ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

      const result = await response.json();
      
      navigate("/result", {
        state: {
          exam,
          ...formData,
          ...result, 
        },
      });
    } catch (err) {
      console.error("Fetch error:", err);
      alert(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-[#1E1E1E]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1E1E] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10">IPMAT Tools</h2>
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

      <div className="flex-1 bg-white">
        <header className="bg-[#1E1E1E] py-5 px-8 shadow-md">
          <h1 className="text-2xl font-bold text-white">IPMAT Call Predictor 2026</h1>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Exam Selection Buttons */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Select Exam</h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "indore", label: "IPMAT Indore" },
                  { id: "rohtak", label: "IPMAT Rohtak" },
                  { id: "jipmat", label: "JIPMAT" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExam(item.id)}
                    className={`px-6 py-3 rounded-lg font-medium border-2 transition-all ${
                      exam === item.id
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-white text-[#2563EB] border-[#2563EB] hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Personal Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.phone} // Added value
                  placeholder="10-digit number"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category} // Added value
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg"
                >
                  <option>General</option>
                  <option>EWS</option>
                  <option>OBC-NCL</option>
                  <option>SC</option>
                  <option>ST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender} // Added value
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg"
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
                  checked={formData.isPWD} // Added checked
                  onChange={handleChange}
                  className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ml-3 text-lg font-medium">PWD Candidate?</label>
              </div>
            </section>

            {/* Academic Records */}
            <section className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-5">Academic Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="10th Percentage"
                  name="tenPercentage"
                  value={formData.tenPercentage}
                  onChange={handleChange}
                  placeholder="e.g. 95.6"
                  step="0.1"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">10th Board</label>
                  <select name="tenBoard" value={formData.tenBoard} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg">
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input
                  label="12th Percentage"
                  name="twelvePercentage"
                  value={formData.twelvePercentage}
                  onChange={handleChange}
                  placeholder="e.g. 96.4"
                  step="0.1"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">12th Stream</label>
                  <select name="stream" value={formData.stream} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg">
                    <option>Commerce</option>
                    <option>Science (PCM)</option>
                    <option>Science (PCB)</option>
                    <option>Humanities/Arts</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Exam Scores Section */}
            <section>
              <h3 className="text-lg font-semibold mb-5">Raw Scores</h3>
              <div className="grid grid-cols-1 gap-6">
                {exam === "indore" && (
                  <>
                    <Input label="QA (SA) – max 60" name="score1" value={formData.score1} onChange={handleChange} max="180" />
                    <Input label="QA (MCQ) – max 120" name="score2" value={formData.score2} onChange={handleChange} max="60" />
                    <Input label="Verbal Ability – max 180" name="score3" value={formData.score3} onChange={handleChange} max="180" />
                  </>
                )}
                {exam === "rohtak" && (
                  <>
                    <Input label="QA – max 160" name="score1" value={formData.score1} onChange={handleChange} max="160" />
                    <Input label="Logical Reasoning – max 160" name="score2" value={formData.score2} onChange={handleChange} max="160" />
                    <Input label="Verbal Ability – max 160" name="score3" value={formData.score3} onChange={handleChange} max="160" />
                  </>
                )}
                {exam === "jipmat" && (
                  <>
                    <Input label="Quant – max 132" name="score1" value={formData.score1} onChange={handleChange} max="132" />
                    <Input label="DI/LR – max 132" name="score2" value={formData.score2} onChange={handleChange} max="132" />
                    <Input label="Verbal Ability – max 136" name="score3" value={formData.score3} onChange={handleChange} max="136" />
                  </>
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white text-xl font-bold rounded-xl shadow-lg transition transform hover:scale-105"
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
        className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
        required
      />
    </div>
  );
}