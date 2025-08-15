# Saarthi - AI-Powered Mental Health App

A comprehensive mental wellness application that combines ancient wisdom from the Bhagavad Gita with modern mental health practices. Built with Next.js and Firebase.

## Features

### 🤖 AI Life Guidance
- Personalized advice using Bhagavad Gita verses
- Smart responses powered by Groq AI
- Each response includes relevant spiritual teachings

### 🫁 Breathing Exercises
- Multiple techniques: box breathing, 4-7-8, triangle, relaxing breath
- Animated breathing circle with real-time feedback
- Customizable sessions and benefits display

### 📝 Enhanced Journaling
- Guided prompts for gratitude, reflection, goals, etc.
- Organize entries by category
- Full CRUD for journal entries

### 🧘‍♀️ Meditation Timer
- Guided sessions for focus, stress relief, relaxation
- Custom timer (1-120 minutes)
- Ambient sounds and progress tracking

### 📊 Mood Tracking
- Daily mood logging (1-5 scale) with notes
- Activity tracking and analytics
- Visual insights with charts and statistics

### 👤 Enhanced Profile
- Stats: journal entries, mood entries, average mood, streaks
- Activity feed and insights
- Quick access to all features

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Auth:** Firebase Auth (Google OAuth)
- **Database:** Firebase Firestore
- **AI:** Groq API
- **Icons:** Lucide React
- 

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saarthi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Firebase Configuration**
   - Create a Firebase project
   - Enable Google Authentication
   - Enable Firestore database
   - Add your Firebase config to `src/lib/firebase.ts`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Go to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
saarthi/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   ├── breathing/
│   │   ├── dashboard/
│   │   ├── journaling/
│   │   ├── meditation/
│   │   ├── mood-tracker/
│   │   └── profile/
│   ├── components/
│   │   ├── ui/
│   │   └── Sidebar.tsx
│   ├── lib/
│   │   ├── auth.tsx
│   │   ├── firebase.ts
│   │   ├── firestore.ts
│   │   └── groq.ts
│   └── hooks/
├── public/
└── verses.csv
```

## 🔧 Configuration

### Firebase Setup
- Create a Firebase project
- Enable Google Authentication
- Create a Firestore database
- Add your Firebase config to the app

### Groq API Setup
- Sign up for Groq
- Get your API key
- Add it to your environment variables

### Data Import
Import Bhagavad Gita verses to Firestore:
```bash
node upload_verses_from_csv.js
```

## 🎨 Customization

- Edit `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize UI components in `src/components/ui/`


---

**Saarthi** - Your companion on the journey to mental wellness and spiritual growth.  
Developed by Divyansh Saxena. 🌱✨