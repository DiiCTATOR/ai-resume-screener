const ResumeModel = require('../Models/resume');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");

let cohere = null;
if (process.env.COHERE_API_KEY && process.env.COHERE_API_KEY.trim() !== "" && process.env.COHERE_API_KEY !== "your_cohere_api_key_here") {
    try {
        cohere = new CohereClient({
            token: process.env.COHERE_API_KEY,
        });
    } catch (e) {
        console.warn("Cohere init warning:", e.message);
    }
}

exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No resume PDF file uploaded" });
        }
        if (!job_desc || !job_desc.trim()) {
            return res.status(400).json({ error: "Job description is required" });
        }
        if (!user) {
            return res.status(400).json({ error: "User ID is required" });
        }

        let pdfBuffer;
        if (req.file.buffer) {
            pdfBuffer = req.file.buffer;
        } else if (req.file.path && fs.existsSync(req.file.path)) {
            pdfBuffer = fs.readFileSync(req.file.path);
        } else {
            return res.status(400).json({ error: "Could not read uploaded PDF file" });
        }

        const pdfData = await pdfParse(pdfBuffer);
        const resumeText = pdfData.text ? pdfData.text.replace(/\s+/g, ' ').trim() : "";

        let score = "80";
        let feedback = "Strong candidate profile with relevant background.";

        if (cohere) {
            try {
                const prompt = `
You are a resume screening assistant.
Compare the following resume text with the provided Job Description (JD) and give a match score (0-100) and feedback.

Resume:
${resumeText.slice(0, 3000)}

Job Description:
${job_desc.slice(0, 1500)}

Return the score and a brief explanation in this format:
Score: XX
Reason: ...
`;
                const response = await cohere.generate({
                    model: "command",
                    prompt: prompt,
                    max_tokens: 150,
                    temperature: 0.7,
                });

                if (response && response.generations && response.generations[0]) {
                    const result = response.generations[0].text;
                    const scoreMatch = result.match(/Score:\s*(\d+)/i);
                    if (scoreMatch) {
                        score = scoreMatch[1];
                    }
                    const reasonMatch = result.match(/Reason:\s*([\s\S]+)/i);
                    if (reasonMatch) {
                        feedback = reasonMatch[1].trim();
                    } else {
                        feedback = result.trim();
                    }
                }
            } catch (aiErr) {
                console.warn("Cohere generation error, using fallback analysis:", aiErr.message);
            }
        }

        // Fallback intelligent keyword matching if Cohere not available or returned default
        if (feedback === "Strong candidate profile with relevant background.") {
            const jdTerms = (job_desc.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
            const resumeTerms = new Set(resumeText.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
            const stopWords = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "will", "your", "are", "you", "about", "been"]);
            const importantJdTerms = Array.from(new Set(jdTerms.filter(w => !stopWords.has(w))));
            const matched = importantJdTerms.filter(w => resumeTerms.has(w));

            const calculatedScore = importantJdTerms.length > 0
                ? Math.min(96, Math.max(50, Math.round((matched.length / importantJdTerms.length) * 100)))
                : 75;

            score = String(calculatedScore);
            const matchedSample = matched.slice(0, 5).join(", ");
            const missingSample = importantJdTerms.filter(w => !resumeTerms.has(w)).slice(0, 4).join(", ");

            feedback = `Resume matches ${score}% of target requirements. Key strengths: ${matchedSample || "General domain competencies"}. Recommended enhancements: ${missingSample || "Add more quantitative metrics and project accomplishments"}.`;
        }

        const newResume = new ResumeModel({
            user: user,
            resume_name: req.file.originalname,
            job_desc: job_desc,
            score: score,
            feedback: feedback
        });

        await newResume.save();

        if (req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.warn("Temp file cleanup warning:", unlinkErr.message);
            }
        }

        return res.status(200).json({
            message: "Your analysis is ready",
            data: newResume
        });

    } catch (err) {
        console.error("addResume error:", err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        const resumes = await ResumeModel.find({ user: user }).sort({ createdAt: -1 });
        return res.status(200).json({ resumes });
    } catch (err) {
        console.error("getAllResumesForUser error:", err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getResumeForAdmin = async (req, res) => {
    try {
        const resumes = await ResumeModel.find().populate('user', 'name email photoUrl').sort({ createdAt: -1 });
        return res.status(200).json({ resumes });
    } catch (err) {
        console.error("getResumeForAdmin error:", err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};
