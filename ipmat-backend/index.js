const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Yay! Connected to toy box 🎁"))
  .catch((err) => console.error("Toy box connection error:", err));

const submissionSchema = new mongoose.Schema({
  exam: String,
  phone: String,
  category: String,
  gender: String,
  isPWD: Boolean,
  tenPercentage: Number,
  tenBoard: String,
  twelvePercentage: Number,
  stream: String,
  score1: Number,
  score2: Number,
  score3: Number,
  totalScore: Number,
  probability: String,
  timestamp: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", submissionSchema);

app.get("/", (req, res) => {
  res.send("Backend is up and running! ✅");
});

app.post("/api/predict", async (req, res) => {
  try {
    const data = req.body;

    const s1 = Number(data.score1) || 0; 
    const s2 = Number(data.score2) || 0; 
    const s3 = Number(data.score3) || 0; 
    const totalScore = s1 + s2 + s3;

    let cutoffs = {};
    let sectionNames = [];
    let maxMarks = [];

    if (data.exam === "indore") {
     
      cutoffs = {
        General: { s1: 24, s2: 28, s3: 112 },
        EWS: { s1: 16, s2: 18, s3: 87 },
        "NC-OBC": { s1: 12, s2: 15, s3: 78 },
        SC: { s1: 12, s2: 10, s3: 65 },
        ST: { s1: 8, s2: 6, s3: 48 },
        PwD: { s1: 8, s2: 5, s3: 47 },
      };
      sectionNames = ["QA (SA)", "QA (MCQ)", "Verbal Ability"];
      maxMarks = [60, 120, 180];
    } else {
      
      return res.status(400).json({ message: "This update only covers IIM Indore." });
    }

    
    let cutoff = { ...(cutoffs[data.category] || cutoffs.General) };

    
    const clearsSectionals = s1 >= cutoff.s1 && s2 >= cutoff.s2 && s3 >= cutoff.s3;

    let probability = "Low";
    if (clearsSectionals) {
      
      const margin = (s1 - cutoff.s1) + (s2 - cutoff.s2) + (s3 - cutoff.s3);
      
     
      probability = margin >= 20 ? "High" : "Borderline";
    }

    const newSubmission = new Submission({
      ...data,
      score1: s1,
      score2: s2,
      score3: s3,
      totalScore,
      probability,
    });

    await newSubmission.save();

    res.json({
      totalScore,
      clearsSectionals,
      probability,
      sectionNames,
      maxMarks,
      required: cutoff 
    });

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend playing on port ${PORT} 🚀`);
});