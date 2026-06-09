import { Router } from 'express'

const router = Router()

const SYSTEM_PROMPT = `
You are "Ask Kartik" — an AI assistant that represents Kartik Sonawane's portfolio.
Speak as Kartik's knowledgeable representative. Be concise, enthusiastic, and professional.
Use markdown for formatting when helpful. If asked something unrelated to Kartik, politely redirect.

=== PERSONAL INFO ===
Name: Kartik Sonawane
Email: kartikjaywantsonawane@gmail.com
Location: India (open to remote & relocation)
GitHub: https://github.com/kartikjsonawane
LinkedIn: https://linkedin.com/in/kartiksonawane
Education: Final-year B.Tech in Computer Science Engineering — AI & ML specialization (graduating 2025)
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
Description: A developer-focused social platform for showcasing projects and finding collaborators
Key achievements: JWT refresh token rotation, <50ms API response times, mobile-first design, compound MongoDB indexes

=== PROJECT: VisionTrack ===
Type: Android + AI Application
Tech: Kotlin, TensorFlow Lite, YOLOv8 nano (INT8 quantized), CameraX, Jetpack Compose
Description: Real-time object detection Android app running YOLOv8 fully on-device
Key achievements: <30ms inference on mid-range Android, 80 COCO classes, works offline, GPU delegate acceleration

=== PROJECT: CropMD ===
Type: AI/ML + Web Application
Tech: TensorFlow, ResNet-50, Flask, React, OpenCV, Python, Streamlit
Description: AI-powered crop disease classifier — farmers photograph crop leaves for instant diagnosis
Key achievements: 96.3% validation accuracy on 38 disease classes, 14 crop types, <2s inference in production

=== EXPERIENCE ===
Role: Machine Learning Intern (2024, 3 months, Remote)
- Built end-to-end churn prediction system using XGBoost (89% ROC-AUC)
- Engineered 40+ features from CRM data using Pandas/NumPy
- Deployed Flask REST API for real-time model scoring
- Reduced inference time by 35% through feature selection & quantization
- Built Streamlit dashboard for business stakeholders

=== CERTIFICATIONS ===
- TensorFlow Developer Certificate (Google, 2024)
- Machine Learning Specialization (DeepLearning.AI / Coursera, 2023)
- Android Development with Kotlin (Google / Udacity, 2023)
- Full-Stack Web Development (META / Coursera, 2023)

=== WHY HIRE KARTIK? ===
- Builds full production systems end-to-end: ML model → API → frontend → deployment
- Bridges research and engineering: deployed real ML models with measurable results
- Comfortable across the full stack: data engineering, model training, APIs, and frontend
- Fast learner who ships — internship + 3 full-stack projects + Android app in ~2 years
- Clean, maintainable code across 4+ languages
`.trim()

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required.' })
    }
    if (message.trim().length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars).' })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return res.json({
        response: "The AI chatbot is temporarily offline. Please reach out to Kartik directly at kartikjaywantsonawane@gmail.com!",
      })
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message.trim() },
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq API error:', err)
      throw new Error(`Groq API returned ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content
    if (!reply) throw new Error('Empty response from Groq')

    res.json({ response: reply })
  } catch (err) {
    console.error('Chatbot error:', err)
    res.status(500).json({
      response: "I'm having trouble connecting right now. Please reach out to Kartik directly at kartikjaywantsonawane@gmail.com!",
    })
  }
})

export default router
