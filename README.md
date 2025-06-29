# Saarthi - AI-Powered Mental Health App

A comprehensive mental wellness application that combines ancient wisdom from the Bhagavad Gita with modern mental health practices. Built with Next.js, Firebase, and AI-powered guidance.

## 🌟 Features

### 🤖 AI Life Guidance
- **Personalized Advice**: Get wisdom-based guidance for life's challenges using Bhagavad Gita verses
- **Smart Responses**: Powered by Groq AI with contextual understanding
- **Verse Integration**: Each response includes relevant spiritual teachings

### 🫁 Breathing Exercises
- **Multiple Techniques**: Box breathing, 4-7-8, triangle breathing, and relaxing breath
- **Visual Guidance**: Animated breathing circle with real-time feedback
- **Customizable Sessions**: Set number of cycles and duration
- **Benefits Display**: Learn about each technique's specific benefits

### 📝 Enhanced Journaling
- **Guided Prompts**: Pre-written prompts for gratitude, reflection, goals, and more
- **Categories**: Organize entries by personal, work, health, relationships, etc.
- **Full CRUD**: Create, read, update, and delete journal entries
- **Tips & Benefits**: Educational content about journaling benefits

### 🧘‍♀️ Meditation Timer
- **Guided Sessions**: Beginner's mind, focus & clarity, stress relief, deep relaxation
- **Custom Timer**: Set your own duration (1-120 minutes)
- **Ambient Sounds**: Rain, ocean, forest, white noise options
- **Progress Tracking**: Visual progress bar and completion sounds

### 📊 Mood Tracking
- **Daily Mood Logging**: Rate your mood on a 1-5 scale with notes
- **Activity Tracking**: Log activities like exercise, meditation, socializing
- **Analytics**: View average mood, weekly trends, and patterns
- **Visual Insights**: Charts and statistics for emotional well-being

### 👤 Enhanced Profile
- **Comprehensive Stats**: Journal entries, mood entries, average mood, streaks
- **Activity Feed**: Recent journal and mood entries
- **Insights**: Most active day, favorite activities, current streaks
- **Quick Actions**: Easy access to all app features

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Firebase Auth (Google OAuth)
- **Database**: Firebase Firestore
- **AI**: Groq API for intelligent responses
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

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
   - Enable Authentication (Google provider)
   - Enable Firestore database
   - Add your Firebase config to `src/lib/firebase.ts`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
saarthi/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── components/    # Page-specific components
│   │   ├── breathing/     # Breathing exercises
│   │   ├── dashboard/     # AI guidance
│   │   ├── journaling/    # Journaling feature
│   │   ├── meditation/    # Meditation timer
│   │   ├── mood-tracker/  # Mood tracking
│   │   └── profile/       # User profile
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── Sidebar.tsx   # Navigation sidebar
│   ├── lib/
│   │   ├── auth.tsx      # Authentication
│   │   ├── firebase.ts   # Firebase config
│   │   ├── firestore.ts  # Firestore utilities
│   │   └── groq.ts       # AI API integration
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── verses.csv           # Bhagavad Gita verses data
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Google Authentication
3. Create a Firestore database
4. Update security rules for user data access
5. Add your Firebase config to the application

### Groq API Setup
1. Sign up for a Groq account
2. Get your API key
3. Add it to your environment variables

### Data Import
The app includes a CSV file with Bhagavad Gita verses. Use the `upload_verses_from_csv.js` script to import them to Firestore:

```bash
node upload_verses_from_csv.js
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize shadcn/ui components in `src/components/ui/`

### Features
- Add new breathing techniques in `BreathingExercise.tsx`
- Create new journal prompts in `Journaling.tsx`
- Extend meditation sessions in `MeditationTimer.tsx`

## 🔒 Security

- User authentication required for personal features
- Firestore security rules protect user data
- Environment variables for sensitive API keys
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App (PWA) ready

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Netlify
- Firebase Hosting
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Bhagavad Gita wisdom and teachings
- Modern mental health practices and research
- Open source community and libraries
- Users and contributors

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Saarthi** - Your companion on the journey to mental wellness and spiritual growth. 🌱✨
