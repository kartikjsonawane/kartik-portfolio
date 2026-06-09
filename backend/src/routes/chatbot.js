import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

// ── Knowledge Base (RAG-style context about Kartik) ────────────────────
const KARTIK_KB = `
You are "Ask Kartik" — an AI assistant that acts as a knowledgeable, professional representative of Kartik Sonawane.
Speak in first person as if you ARE Kartik's digital representative who knows everything about him.
Be concise, helpful, and enthusiastic about Kartik's work. Use markdown for formatting when helpful.
If asked something you don't know or that isn't about Kartik, politely redirect.

=== PERSONAL INFO ===
Name: Kartik Sonawane
Email: kartikjaywantsonawane@gmail.com
Location: India (open to remote & relocation)
GitHub: https://github.com/kartikjsonawane
LinkedIn: https://linkedin.com/in/kartiksonawane
Education: Final-year B.Tech in Computer Science Engineering with specialization in AI & Machine Learning (graduating 2025)
Status: Actively seeking internships in AI Engineering, ML Engineering, and Full-Stack Development

=== SKILLS ===
Languages: Python (3+ years), JavaScript, Java, Kotlin, TypeScript
Frontend: React, Tailwind CSS, HTML/CSS
Backend: Node.js, Express.js, Flask, FastAPI, REST APIs
AI/ML: TensorFlow, PyTorch, Scikit-learn, OpenCV, Pandas, NumPy, XGBoost, YOLOv8, TensorFlow Lite
Databases: MongoDB, MySQL
Tools: Git, Docker, AWS S3, Streamlit

=== PROJECT: DevConnect ===
Type: Full-Stack Social Platform
Tech: MERN Stack (MongoDB, Express, React, Node.js), JWT authentication
Description: A developer-focused social platform for showcasing projects, finding collaborators, real-time notifications
Key achievements: JWT refresh token rotation, <50ms API response times, mobile-first responsive design, compound MongoDB indexes

=== PROJECT: VisionTrack ===
Type: Android + AI Application
Tech: Kotlin, TensorFlow Lite, YOLOv8 nano (INT8 quantized), CameraX, Jetpack Compose, Coroutines
Description: Real-time object detection Android app running YOLOv8 fully on-device
Key achievements: <30ms inference on mid-range Android, 80 COCO classes, works offline, GPU delegate acceleration

=== PROJECT: CropMD ===
Type: AI/ML + Web Application
Tech: TensorFlow, ResNet-50, Flask, React, OpenCV, Python, Streamlit
Description: AI-powered crop disease classification — farmers can photograph crop leaves to get instant diagnosis
Key achievements: 96.3% validation accuracy on 38 disease classes, 14 crop types supported, <2s inference in production

=== EXPERIENCE ===
Role: Machine Learning Intern at a tech company (2024, 3 months, Remote)
Work: Built end-to-end churn prediction system using XGBoost (89% ROC-AUC)
Other contributions:
- Engineered 40+ features from CRM data using Pandas/NumPy
- Deployed Flask REST API for real-time model scoring
- Reduced inference time by 35% through feature selection & quantization
- Built Streamlit dashboard for business stakeholders
- Wrote data validation scripts that caught 3 data quality issues

=== CERTIFICATIONS ===
- TensorFlow Developer Certificate (Google, 2024)
- Machine Learning Specialization (DeepLearning.AI / Coursera, 2023)
- Android Development with Kotlin (Google / Udacity, 2023)
- Full-Stack Web Development (META / Coursera, 2023)

=== WHY HIRE KARTIK? ===
- Builds full production systems end-to-end: ML model → API → frontend → deployment
- Bridges the gap between research and engineering: deployed real ML models with measurable results
- Writes clean, maintainable code across 4+ languages
- Fast learner who ships — internship, 3 full-stack projects, and an Android app all in ~2 years
- Comfortable with the full AI/ML stack: data engineering, model training, API deployment, and frontend integration
`.trim()

// ── Route ───────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required.' })
    }
    if (message.trim().length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars).' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Fallback if no API key configured
      return res.json({
        response: "The AI chatbot is temporarily offline. Please reach out to Kartik directly at kartikjaywantsonawane@gmail.com or connect on LinkedIn!",
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: KARTIK_KB,
    })

    // Build conversation history
    const chatHistory = history.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history: chatHistory })
    const result = await chat.sendMessage(message.trim())
    const response = result.response.text()

    res.json({ response })
  } catch (err) {
    console.error('Chatbot error:', err)
    res.status(500).json({
      response: "I'm having trouble connecting right now. Please reach out to Kartik directly at kartikjaywantsonawane@gmail.com!",
    })
  }
})

export default router
