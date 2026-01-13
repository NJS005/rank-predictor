import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl mb-4">No data found. Please fill the form first.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Go Back to Form
        </button>
      </div>
    );
  }

  const scores = [Number(data.score1 || 0), Number(data.score2 || 0), Number(data.score3 || 0)];
  const totalScore = data.totalScore || scores.reduce((a, b) => a + b, 0);
  const probability = data.probability || "Low";
  const clearsSectionals = data.clearsSectionals ?? false;

  const sectionNames = data.sectionNames || ["Section 1", "Section 2", "Section 3"];
  const maxMarks = data.maxMarks || [0, 0, 0];

  const probabilityStyles = {
    High: "text-green-700 bg-green-50 border-green-200",
    Borderline: "text-yellow-700 bg-yellow-50 border-yellow-200",
    Low: "text-red-700 bg-red-50 border-red-200",
  };

  const examName = { indore: "IPMAT Indore", rohtak: "IPMAT Rohtak", jipmat: "JIPMAT" }[data.exam] || "IPMAT";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#1E1E1E] p-8 text-white text-center">
          <p className="text-sm uppercase tracking-widest text-blue-400 font-bold mb-2">{examName} 2026 Prediction</p>
          <h1 className="text-3xl font-bold">Your Call Chances</h1>
        </div>

        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
              <p className="text-xs uppercase text-gray-500 font-bold mb-1">Total Score</p>
              <p className="text-4xl font-black text-blue-700">{totalScore}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl text-center">
              <p className="text-xs uppercase text-gray-500 font-bold mb-1">Category</p>
              <p className="text-xl font-bold text-gray-800">{data.category || "General"}</p>
            </div>

            <div className={`border p-6 rounded-xl text-center ${probabilityStyles[probability]}`}>
              <p className="text-xs uppercase opacity-70 font-bold mb-1">Probability</p>
              <p className="text-3xl font-black">{probability}</p>
            </div>
          </div>

          {/* Sectional Scores */}
          <div className="bg-white border border-gray-100 p-6 rounded-xl mb-8 shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-6 flex justify-between">
              Sectional Breakdown
              {data.exam === "indore" && (
                <span className={`text-xs px-2 py-1 rounded ${clearsSectionals ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {clearsSectionals ? "Sectionals Cleared ✅" : "Sectionals Not Met ❌"}
                </span>
              )}
            </h3>

            <div className="space-y-6">
              {sectionNames.map((name, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-600">{name}</span>
                    <span className="font-bold">{scores[index]} / {maxMarks[index]}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                         style={{ width: `${Math.min(100, (scores[index] / maxMarks[index]) * 100)}%` }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice Box */}
          <div className={`p-6 rounded-xl border-l-8 ${probabilityStyles[probability]}`}>
            <h4 className="font-bold text-lg mb-2">
              {probability === "High" && "🎉 Keep Up the Momentum!"}
              {probability === "Borderline" && "⚖️ It's a Close Call!"}
              {probability === "Low" && "💡 Don't Lose Heart!"}
            </h4>
            <p className="text-sm leading-relaxed">
              {probability === "High" && "Your scores are significantly above the expected cutoff. Focus on PI & WAT preparation."}
              {probability === "Borderline" && "You are right on the edge. Every mark in the interview will count."}
              {probability === "Low" && "Use this as a diagnostic tool—identify weak sections for improvement."}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              Try Different Scores
            </button>
            <p className="text-[10px] text-center text-gray-400">
              Note: Data is based on historical trends. IIMs do not officially release all cutoff data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
