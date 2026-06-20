/**
 * Blog seed — runs once on server startup.
 * Inserts 4 blog posts if they don't already exist.
 */
import Post from './models/Post.js'
import User from './models/User.js'

const BLOGS = [
  {
    title: 'Building VisionTrack: Real-Time Object Detection on Android with YOLOv8',
    slug:  'visiontrack-yolov8-android',
    excerpt: 'How I built a real-time AI camera app that runs YOLOv8 on-device with under 30ms inference — no internet required.',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80',
    tags: ['Android', 'AI', 'YOLOv8', 'TensorFlow Lite', 'Kotlin'],
    publishedAt: new Date('2024-11-10'),
    content: `## The Problem

Mobile AI apps are almost always cloud-dependent. You take a photo, it goes to a server, results come back. I wanted something that ran *entirely on-device* — no network calls, no cold starts.

The result was **VisionTrack**: a real-time object detection app for Android that runs YOLOv8 nano at 24+ FPS on mid-range hardware.

## Choosing the Model

YOLOv8 has four sizes: nano, small, medium, large. For mobile, nano is the only practical choice:

| Model | Size | mAP50 | Inference |
|-------|------|-------|-----------|
| YOLOv8n | 6.3 MB | 37.3 | ~28ms |
| YOLOv8s | 22 MB | 44.9 | ~90ms |

I also applied **INT8 quantization** — halved the model size, cut inference time by ~35%, negligible accuracy drop.

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
model.export(format='tflite', int8=True, data='coco128.yaml')
\`\`\`

## Android Integration with CameraX

\`\`\`kotlin
val imageAnalysis = ImageAnalysis.Builder()
    .setTargetResolution(Size(640, 480))
    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
    .build()

imageAnalysis.setAnalyzer(cameraExecutor) { imageProxy ->
    val bitmap = imageProxy.toBitmap()
    val results = detector.detect(bitmap)
    overlay.postResults(results)
    imageProxy.close()
}
\`\`\`

Key insight: **STRATEGY_KEEP_ONLY_LATEST** drops frames if the GPU is busy instead of queuing them. Keeps latency consistent under load.

## GPU Delegate

Without the GPU delegate: ~85ms. With it:

\`\`\`kotlin
val options = Interpreter.Options().apply {
    addDelegate(GpuDelegate())
    setNumThreads(4)
}
\`\`\`

Down to **28ms**. That's the difference between 12 FPS and 35 FPS.

## Post-Processing

YOLOv8 outputs a \`[1, 84, 8400]\` tensor (84 = 4 bbox coords + 80 class scores). You need to transpose, filter by confidence, then run Non-Maximum Suppression.

\`\`\`kotlin
fun processOutput(output: Array<Array<FloatArray>>): List<Detection> {
    val transposed = transpose(output[0])
    val candidates = transposed.filter { it[4] > CONFIDENCE_THRESHOLD }
    return nonMaxSuppression(candidates, IOU_THRESHOLD)
}
\`\`\`

## Results

- **28ms** average inference on Snapdragon 665
- **80 COCO classes** detected in real-time
- Runs completely **offline**
- **24+ FPS** sustained camera preview

## What I Learned

- Quantization matters more than model architecture for mobile
- CameraX handles rotation and lifecycle automatically — use it
- Canvas overlays outperform View-based overlays for real-time bounding boxes
- Benchmark both GPU delegate and NNAPI — the winner varies by device`,
  },
  {
    title: 'Transfer Learning Done Right: 96.3% Accuracy on Crop Disease Detection',
    slug:  'cropmd-transfer-learning-resnet',
    excerpt: 'A deep dive into how I fine-tuned ResNet-50 on PlantVillage — the mistakes I made, and what actually got me to 96.3% validation accuracy.',
    coverImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80',
    tags: ['TensorFlow', 'Deep Learning', 'Python', 'Computer Vision', 'Flask'],
    publishedAt: new Date('2024-09-20'),
    content: `## Why Crop Disease Detection?

Smallholder farmers lose 20–40% of crop yield to diseases every season. An agronomist visit takes days. A phone doesn't.

**CropMD** lets farmers photograph a crop leaf and get instant AI diagnosis with treatment advice. The model: ResNet-50 fine-tuned on PlantVillage, 38 disease classes across 14 crops.

## The Dataset

PlantVillage has 54,306 images — clean, lab-photographed, consistent lighting. Class distribution is heavily skewed, so I used class weights:

\`\`\`python
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(y_train),
    y=y_train
)
\`\`\`

## Phase 1: Feature Extraction

Freeze all ResNet-50 layers, train only the classification head:

\`\`\`python
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(38, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)
model.compile(optimizer=Adam(1e-3), loss='categorical_crossentropy', metrics=['accuracy'])
\`\`\`

After 10 epochs: **~89% validation accuracy**. Good start.

## Phase 2: Fine-Tuning

Unfreeze the top 20 layers and train with a much lower learning rate:

\`\`\`python
base_model.trainable = True
for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(optimizer=Adam(1e-5), ...)  # 100x smaller
\`\`\`

Why 1e-5? The pretrained weights encode rich ImageNet features. A high learning rate destroys them. You want to *nudge*, not retrain.

After 15 more epochs: **96.3% validation accuracy**.

## Data Augmentation

\`\`\`python
train_datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.1,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    zoom_range=0.15,
    preprocessing_function=preprocess_input,
)
\`\`\`

Don't over-augment. Extreme transforms hurt on clean datasets like PlantVillage.

## The Cold Start Problem

On Render's free tier, Flask sleeps. First request: 12 seconds. Fix: a cron job (UptimeRobot) pings the health endpoint every 14 minutes. Average inference time with warm server: **1.8 seconds**.

## Final Numbers

| Metric | Value |
|--------|-------|
| Validation Accuracy | 96.3% |
| Inference Time | ~1.8s |
| Classes | 38 (14 crops) |
| Training Images | 43,000 |

## What I'd Do Differently

1. **EfficientNetV2** instead of ResNet-50 — better accuracy, smaller model
2. **Field data augmentation** — simulate shadows, soil, motion blur for real-world robustness
3. **TFLite export** — on-device inference for offline use`,
  },
  {
    title: 'XGBoost to Production: Building a Customer Churn Predictor',
    slug:  'churn-prediction-xgboost-mlops',
    excerpt: 'From messy CRM data to a Flask API serving real-time predictions — the full ML engineering workflow from my internship.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    tags: ['Machine Learning', 'XGBoost', 'Python', 'Flask', 'MLOps'],
    publishedAt: new Date('2024-07-15'),
    content: `## The Business Problem

Which customers will cancel in the next 30 days? The data: 2 years of CRM exports, inconsistent column names, three date formats, 23% missing values.

This post covers the full pipeline: messy data → production API.

## Data Validation First

Before any modelling, write validation that catches upstream bugs:

\`\`\`python
def validate_schema(df):
    issues = {}
    if df['customer_id'].duplicated().sum() > 0:
        issues['duplicate_ids'] = df['customer_id'].duplicated().sum()
    if (df['monthly_spend'] < 0).sum() > 0:
        issues['negative_spend'] = (df['monthly_spend'] < 0).sum()
    if (df['last_login'] > pd.Timestamp.now()).sum() > 0:
        issues['future_dates'] = (df['last_login'] > pd.Timestamp.now()).sum()
    return issues
\`\`\`

This caught **3 upstream data bugs** before they corrupted the model.

## Feature Engineering

Raw CRM data has almost no signal. The value is in derived features:

\`\`\`python
def engineer_features(df):
    df['days_since_login'] = (pd.Timestamp.now() - df['last_login']).dt.days
    df['login_frequency']  = df['login_count_30d'] / 30
    df['spend_trend']      = df['spend_last_30d'] / (df['spend_prev_30d'] + 1)
    df['engagement']       = (
        df['feature_usage_count'] * 0.4 +
        df['support_tickets_resolved'] * 0.3 +
        df['login_frequency'] * 30 * 0.3
    )
    df['days_to_renewal'] = (df['contract_end'] - pd.Timestamp.now()).dt.days
    return df
\`\`\`

Most signal came from **spend trend**, **days since login**, and **support ticket volume**.

## Model Selection

| Model | ROC-AUC |
|-------|---------|
| Logistic Regression | 0.71 |
| Random Forest | 0.85 |
| **XGBoost** | **0.89** |

XGBoost won. Most important hyperparameter:

\`\`\`python
model = XGBClassifier(
    scale_pos_weight=3.2,  # Critical for 18% churn rate imbalance
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    early_stopping_rounds=50,
)
\`\`\`

## Cutting Inference Time by 35%

The initial model: 500 trees, 40 features, ~45ms per request.

**Feature selection** — drop near-zero importance features (40 → 24 features):
\`\`\`python
importances = pd.Series(model.feature_importances_, index=feature_cols)
keep = importances[importances > 0.01].index.tolist()
\`\`\`

**Tree pruning** — use early stopping's best iteration:
\`\`\`python
model_prod = XGBClassifier(n_estimators=model.best_iteration, ...)
\`\`\`

Result: **29ms** inference (35% faster), 0.88 ROC-AUC.

## Production API

\`\`\`python
@app.route('/predict', methods=['POST'])
def predict():
    df   = pd.DataFrame([request.json])
    df   = engineer_features(df)
    X    = scaler.transform(df[FEATURE_COLS])
    prob = float(model.predict_proba(X)[0][1])
    risk = 'high' if prob > 0.65 else 'medium' if prob > 0.35 else 'low'
    return jsonify({'churn_probability': prob, 'risk_level': risk})
\`\`\`

## Key Takeaways

1. Data validation before modelling — always
2. Feature engineering matters more than algorithm choice
3. \`scale_pos_weight\` is essential for imbalanced targets
4. Build for the consumer — the Streamlit dashboard got more usage than the API`,
  },
  {
    title: 'MERN Stack in Practice: Lessons from Building DevConnect',
    slug:  'devconnect-mern-fullstack-lessons',
    excerpt: 'Real lessons from shipping a full-stack social platform — JWT auth done right, MongoDB query optimization, and why I dropped Redux.',
    coverImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80',
    tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack', 'JavaScript'],
    publishedAt: new Date('2024-05-05'),
    content: `## What Is DevConnect?

A social platform for developers — profiles, project showcases, collaboration requests, and a developer feed. Built with the MERN stack as a way to prove I could ship a production-grade full-stack application end to end.

## JWT Auth: The Right Way

Naive implementations store tokens in localStorage. XSS attacks steal them trivially. The right way: short-lived access tokens in memory, refresh tokens in httpOnly cookies.

\`\`\`javascript
// Server
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
})
res.json({ accessToken, user })

// Client — store access token in React state, NEVER localStorage
const [accessToken, setAccessToken] = useState(null)

useEffect(() => {
  api.post('/auth/refresh').then(({ data }) => {
    setAccessToken(data.accessToken)
  })
}, [])
\`\`\`

## The MongoDB Query Killing Performance

The feed query naively fetched all posts and sorted in memory. At 1,000 users: **400ms**.

\`\`\`javascript
// Fix: compound index
postSchema.index({ author: 1, createdAt: -1 })

// And use .lean() — returns plain JS objects, ~2x faster
const posts = await Post.find({ author: { $in: followingIds } })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean()
\`\`\`

Result: **400ms → 42ms**.

## Why I Dropped Redux

After two weeks: 8 slices, 40 actions, 3 files to add a single feature. I switched to React Context + useReducer.

For a CRUD app without deeply nested cross-component state, Context is sufficient. Redux shines with complex derived state, time-travel debugging, or 10+ engineers on the codebase.

## Notifications Without WebSockets

Polling with exponential backoff:

\`\`\`javascript
function useNotifications() {
  const intervalRef = useRef(1000)

  useEffect(() => {
    const poll = async () => {
      try {
        const { data } = await api.get('/notifications/unread')
        setNotifications(data.notifications)
        intervalRef.current = 1000  // Reset on success
      } catch {
        intervalRef.current = Math.min(intervalRef.current * 2, 30000)  // Back off
      }
      setTimeout(poll, intervalRef.current)
    }
    poll()
  }, [])
}
\`\`\`

Active: checks every second. On errors: backs off to 30s. Server load stays manageable without WebSocket infrastructure.

## Deployment

- **Frontend**: Vercel (auto-deploy on push)
- **Backend**: Render (Docker, free tier)
- **Database**: MongoDB Atlas (M0 free)

Total monthly cost: **$0**.

## What I'd Do Differently

1. TypeScript from day one — painful to add later
2. Write tests before shipping — debugged 3 production bugs that tests would have caught
3. Add Sentry early — observability is not optional in production`,
  },
]

export async function seedBlogs() {
  try {
    const author = await User.findOne({ email: 'kartikjaywantsonawane@gmail.com' })
    if (!author) { console.log('Seed: owner account not found, skipping blog seed'); return }

    let seeded = 0
    for (const blog of BLOGS) {
      const exists = await Post.findOne({ slug: blog.slug })
      if (exists) continue
      await Post.create({ ...blog, author: author._id, published: true })
      seeded++
    }
    if (seeded > 0) console.log(`Seeded ${seeded} blog posts`)
  } catch (err) {
    console.error('Blog seed error:', err.message)
  }
}
