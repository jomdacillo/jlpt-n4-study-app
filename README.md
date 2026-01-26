# JLPT N4 Study App 📚

A comprehensive Japanese study app for JLPT N4 exam preparation with:
- **SRS (Spaced Repetition System)** - Smart flashcards that adapt to your learning
- **Active Recall** - Type answers to strengthen memory
- **Listening Practice** - Dialogues and dictation with audio
- **Daily Missions** - Real-world tasks for Japan residents
- **Progress Tracking** - XP, levels, and streaks saved locally

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone or download this project**
   ```bash
   git clone https://github.com/YOUR_USERNAME/jlpt-n4-study-app.git
   cd jlpt-n4-study-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📱 Deploy to Cloudflare Pages (Access on Phone)

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/jlpt-n4-study-app.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click **Workers & Pages** → **Create application** → **Pages**
   - Click **Connect to Git**
   - Select your GitHub repository
   - Configure build settings:
     - **Framework preset**: Vite
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click **Save and Deploy**

3. **Access your app**
   - Cloudflare will give you a URL like: `https://jlpt-n4-study-app.pages.dev`
   - Open this URL on your phone!

### Method 2: Direct Upload

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to Cloudflare**
   - Go to Cloudflare Dashboard → Workers & Pages → Create application → Pages
   - Click **Upload assets**
   - Drag and drop the `dist` folder
   - Deploy!

## 📂 Project Structure

```
jlpt-n4-study-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 💾 Data Storage

Your progress is saved in your browser's **localStorage**:
- SRS card levels
- XP and Level
- Streak count
- Mistake log
- Study history

**Note:** Data is stored per device/browser. If you want to sync across devices, you'll need to implement a backend (future enhancement).

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## 📖 Features

### Study Modes
- **Vocabulary** - 1,500 N4 words with readings and examples
- **Kanji** - 300 characters with onyomi/kunyomi readings
- **Grammar** - 130+ essential patterns

### Smart Session (15-30 min)
1. SRS Cards with Active Recall
2. Shadowing Practice (3 phrases)
3. Quick Journal Writing

### Listening Practice
- JLPT-style dialogue comprehension
- Dictation exercises
- Text-to-speech audio

### Gamification
- XP for every action
- Level progression
- Daily streaks
- Daily missions

## 🎯 JLPT N4 Exam Info

- **Date**: July 6, 2026
- **Duration**: 125 minutes total
- **Passing Score**: 90/180 overall + section minimums
- **Content**: ~1,500 vocab, ~300 kanji, ~130 grammar patterns

## 📱 Mobile Tips

For the best mobile experience:
1. Add to Home Screen (iOS: Share → Add to Home Screen)
2. This creates an app-like experience
3. Works offline after first load

## 🤝 Contributing

Feel free to fork and improve! Ideas:
- Add more vocabulary/kanji/grammar
- Implement cloud sync
- Add more listening exercises
- Create practice tests

## 📄 License

MIT License - Use freely for your studies!

---

頑張って！ Good luck with your JLPT N4! 🍀
