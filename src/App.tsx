// @ts-nocheck
import React, { useState, useEffect } from "react";

// --- QUIZ DATA ---
const LIKERT_OPTIONS = [
  { label: "Never", score: 1 },
  { label: "Rarely", score: 2 },
  { label: "Sometimes", score: 3 },
  { label: "Often", score: 4 },
  { label: "Always", score: 5 },
];

const QUIZZES = [
  {
    id: "stressed",
    title: "Are You Actually Stressed?",
    description: "Reveal hidden stress or burnout you might have normalized.",
    questions: [
      { text: "I feel tired even after resting." },
      { text: "I get irritated over incredibly small things." },
      { text: "I don't enjoy the things I used to like." },
      { text: "I find myself staring blankly to escape for a few minutes." },
    ],
    getResult: (score: number) => {
      if (score >= 15)
        return {
          hook: "You're Not Just Tired — You're Emotionally Drained",
          insight:
            "You've normalized chronic stress. Your nervous system is operating in survival mode, mistaking deep exhaustion for a normal baseline.",
          realityCheck:
            "You may think you're just busy or needing a weekend, but your behavior strongly suggests hidden burnout.",
          suggestions: [
            "Schedule 15 minutes of absolute nothingness daily.",
            "Start tracking your physical energy levels, not just your task list.",
            "Consider stepping back from one major commitment.",
          ],
        };
      return {
        hook: "You're Carrying Weight, But Holding Steady",
        insight:
          "You are experiencing friction, but haven't fully tipped into chronic burnout.",
        realityCheck:
          "You are managing, but you might be ignoring the early warning signs of stress accumulation.",
        suggestions: [
          "Set a strict cutoff time for work or stressful tasks.",
          "Practice emotional labeling when you feel irritated.",
        ],
      };
    },
  },
  {
    id: "suppress",
    title: "Do You Suppress Your Emotions?",
    description:
      "Uncover the defense mechanisms keeping you detached from reality.",
    questions: [
      { text: "I say 'I'm fine' even when I'm internally spiraling." },
      {
        text: "I immediately distract myself (phone, work) instead of feeling bad.",
      },
      {
        text: "I avoid talking about my deepest feelings, even with close friends.",
      },
      { text: "I feel numb or empty rather than sad or angry." },
    ],
    getResult: (score: number) => {
      if (score >= 14)
        return {
          hook: "You Are A Master of Evasion",
          insight:
            "You tend to suppress emotions unconsciously. You've built a fortress around your feelings to protect yourself, but it's keeping you isolated.",
          realityCheck:
            "You think you are being strong, but you are actually emotionally detached from your own life.",
          suggestions: [
            "Try a 'brain dump' journaling session for 5 minutes.",
            "Next time someone asks how you are, pause before saying 'fine'.",
            "Practice identifying where you feel tension in your body.",
          ],
        };
      return {
        hook: "Guarded, But Not Closed Off",
        insight:
          "You selectively process emotions, sometimes pushing them away when inconvenient.",
        realityCheck:
          "You have emotional awareness, but you still rely on distraction when things get too heavy.",
        suggestions: [
          "Allow yourself 10 minutes to sit with a negative emotion.",
          "Share a small vulnerability with someone you trust.",
        ],
      };
    },
  },
  {
    id: "pleaser",
    title: "Are You a People Pleaser?",
    description: "Identify approval-seeking behavior and boundary issues.",
    questions: [
      { text: "I feel intensely guilty saying no to requests." },
      { text: "I prioritize others' comfort over my own well-being." },
      { text: "I alter my opinions to match the room I'm in." },
      { text: "I apologize for things that aren't my fault." },
    ],
    getResult: (score: number) => {
      if (score >= 15)
        return {
          hook: "You Are Living for External Validation",
          insight:
            "Your sense of self-worth is dangerously tied to how useful or agreeable you are to others. You are abandoning yourself to keep the peace.",
          realityCheck:
            "You think you are just being kind, but you are actually manipulating situations to avoid conflict and rejection.",
          suggestions: [
            "Say 'Let me check my schedule' instead of an immediate 'yes'.",
            "Practice stating an opposing preference in a low-stakes situation.",
            "Reflect on whose life you are actually living.",
          ],
        };
      return {
        hook: "Empathetic, But Boundaries Need Work",
        insight:
          "You care deeply about others, but sometimes let their needs override your own boundaries.",
        realityCheck:
          "You know how to stand up for yourself, but the guilt often makes you second-guess your decisions.",
        suggestions: [
          "Practice saying 'no' without giving a detailed excuse.",
          "Check in with your own desires before agreeing to plans.",
        ],
      };
    },
  },
  {
    id: "awareness",
    title: "Do You Know Your Emotions?",
    description: "Test your emotional granularity and accuracy.",
    questions: [
      {
        text: "Situation: You've been scrolling for 3 hours, feeling heavy and distant.",
        customOptions: [
          { label: "Just Bored", score: 1 },
          { label: "Anxious", score: 2 },
          { label: "Numb / Disassociating", score: 5 },
          { label: "Lazy", score: 1 },
        ],
      },
      {
        text: "Situation: Someone cancels plans. You immediately feel relieved, then terrible.",
        customOptions: [
          { label: "Angry", score: 1 },
          { label: "Guilty for needing space", score: 5 },
          { label: "Sad they cancelled", score: 2 },
          { label: "Indifferent", score: 1 },
        ],
      },
      {
        text: "Situation: You snap at your partner because they left a cup on the table.",
        customOptions: [
          { label: "Annoyed at the cup", score: 1 },
          { label: "Overwhelmed & overstimulated", score: 5 },
          { label: "Angry at them", score: 2 },
          { label: "Tired", score: 3 },
        ],
      },
    ],
    getResult: (score: number) => {
      if (score >= 12)
        return {
          hook: "High Emotional Granularity",
          insight:
            "You possess a sharp ability to differentiate between complex emotional states rather than just feeling 'bad' or 'good'.",
          realityCheck:
            "You accurately decode your emotional data, meaning you can address the root cause of your feelings effectively.",
          suggestions: [
            "Continue utilizing emotional labeling.",
            "Help others articulate their feelings when they struggle.",
            "Use this clarity to set highly specific boundaries.",
          ],
        };
      return {
        hook: "Lost in the Emotional Fog",
        insight:
          "You tend to group complex emotions into broad categories like 'stressed' or 'tired', masking what's actually wrong.",
        realityCheck:
          "You are misdiagnosing your emotional state, which means you are applying the wrong solutions to your problems.",
        suggestions: [
          "Use an emotion wheel to find the exact word for your feeling.",
          "Stop using 'tired' as a catch-all excuse.",
          "Look for the emotion underneath your immediate anger.",
        ],
      };
    },
  },
  {
    id: "overthinking",
    title: "Overthinking or Intuition?",
    description:
      "Distinguish between anxious spiraling and true inner knowing.",
    questions: [
      { text: "My decisions feel heavy, tense, and forced in my body." },
      { text: "I replay past conversations trying to find hidden meanings." },
      { text: "I need to ask multiple people for advice before deciding." },
      { text: "My 'gut feelings' are usually accompanied by a racing heart." },
    ],
    getResult: (score: number) => {
      if (score >= 14)
        return {
          hook: "Caught in the Analytical Trap",
          insight:
            "You are confusing anxiety with intuition. Your decisions are driven by fear and over-analysis rather than a grounded sense of knowing.",
          realityCheck:
            "You believe thinking harder will protect you from making a mistake, but it's actually paralyzing you.",
          suggestions: [
            "Notice the physical sensation: intuition is calm, anxiety is chaotic.",
            "Limit yourself to asking only ONE person for advice.",
            "Make one small decision today based strictly on your first impulse.",
          ],
        };
      return {
        hook: "Balanced Thinker",
        insight:
          "You know how to gather data without losing your connection to your internal compass.",
        realityCheck:
          "You generally trust yourself, though you occasionally fall into thought-loops under high pressure.",
        suggestions: [
          "Practice trusting your immediate gut reaction on low-stakes choices.",
          "Meditate to quiet the residual mental chatter.",
        ],
      };
    },
  },
];

// --- TECHNIQUES DATA ---
const TECHNIQUE_CATEGORIES = [
  "All",
  "Anxiety & Stress",
  "Overthinking",
  "Low Mood / Burnout",
  "Emotional Confusion",
  "Social & Avoidance",
];

const TECHNIQUES = [
  {
    id: "478-breathing",
    title: "4-7-8 Breathing",
    category: "Anxiety & Stress",
    whenToUse: "Feeling anxious, overwhelmed, or unable to calm down.",
    whyItWorks:
      "Activates the parasympathetic nervous system, signaling your body that it's safe to relax.",
    timeRequired: "2 mins",
    steps: [
      "Inhale quietly through your nose for 4 seconds.",
      "Hold your breath for a count of 7 seconds.",
      "Exhale completely through your mouth, making a whoosh sound, for 8 seconds.",
      "Repeat this cycle 4 times.",
    ],
    quickVersion: "Just slow your breathing intentionally for 1 solid minute.",
    interactiveMode: "breathing",
  },
  {
    id: "emotion-labeling",
    title: "Emotion Labeling",
    category: "Emotional Confusion",
    whenToUse:
      "You feel 'off' but don't know why, or emotions feel too big to handle.",
    whyItWorks:
      "Naming emotions reduces their intensity because it shifts brain activity from the emotional center (amygdala) to the rational center (prefrontal cortex).",
    timeRequired: "1 min",
    steps: [
      "Pause and ask: 'What am I feeling right now?'",
      "Choose a specific word (e.g., frustrated, lonely, drained, resentful).",
      "Say it out loud or write it down.",
      "Add: '...because' to identify the trigger (e.g., 'I feel drained because of that meeting').",
    ],
    quickVersion: "Say out loud: 'I am feeling [emotion] right now.'",
    interactiveMode: null,
  },
  {
    id: "54321-grounding",
    title: "5-4-3-2-1 Grounding",
    category: "Anxiety & Stress",
    whenToUse: "During panic attacks, racing thoughts, or disassociation.",
    whyItWorks:
      "Forces your brain to process sensory data, instantly bringing your attention back to the present moment and breaking the anxiety loop.",
    timeRequired: "3 mins",
    steps: [
      "Look around and name 5 things you can SEE.",
      "Notice 4 things you can TOUCH around you.",
      "Listen for 3 things you can HEAR.",
      "Find 2 things you can SMELL.",
      "Acknowledge 1 thing you can TASTE.",
    ],
    quickVersion: "Find 5 things in the room that are the color blue.",
    interactiveMode: "grounding",
  },
  {
    id: "brain-dump",
    title: "Brain Dump Journaling",
    category: "Overthinking",
    whenToUse: "Your mind feels crowded, chaotic, or you can't fall asleep.",
    whyItWorks:
      "Externalizes abstract anxieties into concrete words. It clears mental clutter and reduces cognitive load.",
    timeRequired: "5–10 mins",
    steps: [
      "Set a timer for 5 to 10 minutes.",
      "Write out everything in your head with zero filter.",
      "Do not worry about grammar, spelling, or making sense.",
      "Stop exactly when the timer ends.",
    ],
    quickVersion:
      "Write down the 3 biggest things taking up space in your brain.",
    interactiveMode: null,
  },
  {
    id: "name-distortion",
    title: "Name the Distortion",
    category: "Overthinking",
    whenToUse:
      "Thinking 'I'm useless', 'Everything is going wrong', or assuming the worst.",
    whyItWorks:
      "Based on CBT (Cognitive Behavioral Therapy). It separates facts from feelings, proving that your thoughts are not always reality.",
    timeRequired: "3 mins",
    steps: [
      "Write down the negative thought exactly as it sounds.",
      "Label it: Is it 'All-or-nothing thinking'? 'Catastrophizing'? 'Overgeneralizing'?",
      "Rewrite the thought based strictly on the facts.",
    ],
    quickVersion:
      "Ask yourself: 'Is this thought a 100% undeniable fact, or is it a feeling?'",
    interactiveMode: null,
  },
  {
    id: "10-min-reset",
    title: "10-Minute Reset",
    category: "Low Mood / Burnout",
    whenToUse:
      "Feeling physically drained, unmotivated, or hitting an afternoon slump.",
    whyItWorks:
      "Breaks the physical stress cycle by moving your body, and restores mental energy through a rapid dopamine shift.",
    timeRequired: "10 mins",
    steps: [
      "Minutes 1-3: Do deep breathing or sit in total silence.",
      "Minutes 4-6: Stretch your body or go for a brisk walk around the space.",
      "Minutes 7-10: Do something purely enjoyable (listen to a hype song, eat a snack).",
    ],
    quickVersion:
      "Stand up, stretch your arms to the ceiling, and take 5 deep breaths.",
    interactiveMode: null,
  },
  {
    id: "opposite-action",
    title: "Opposite Action",
    category: "Social & Avoidance",
    whenToUse:
      "Avoiding tasks, dreading social situations, or wanting to isolate.",
    whyItWorks:
      "Emotions drive behavior. By deliberately changing your behavior first, you can reverse-engineer a shift in your emotional state.",
    timeRequired: "Instant",
    steps: [
      "Identify the exact action your emotion is telling you to do (e.g., 'Hide in bed').",
      "Identify the exact opposite action (e.g., 'Get out of bed and text one friend').",
      "Do a small, manageable version of the opposite action immediately.",
    ],
    quickVersion:
      "Do the thing you are avoiding for just 2 minutes, then you have permission to stop.",
    interactiveMode: null,
  },
];

export default function App() {
  // State Management
  const [emotionInput, setEmotionInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    myth: string;
    reality: string;
    explanation: string;
  } | null>(null);

  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTechniqueId, setActiveTechniqueId] = useState<string | null>(
    null
  );
  const [isFading, setIsFading] = useState(false);

  const activeQuiz = QUIZZES.find((q) => q.id === activeQuizId);
  const isResultView = activeQuiz && quizStep > activeQuiz.questions.length;
  const activeTechnique = TECHNIQUES.find((t) => t.id === activeTechniqueId);

  // Core Functions
  const handleStartQuiz = (id: string) => {
    setActiveQuizId(id);
    setQuizStep(0);
    setAnswers([]);
    document.body.style.overflow = "hidden";
  };
  const openTechnique = (id: string) => {
    setActiveTechniqueId(id);
    document.body.style.overflow = "hidden";
  };
  const closeModals = () => {
    setActiveQuizId(null);
    setActiveTechniqueId(null);
    document.body.style.overflow = "auto";
  };

  const handleAnswer = (score: number) => {
    setIsFading(true);
    setTimeout(() => {
      setAnswers([...answers, score]);
      setQuizStep((prev) => prev + 1);
      setIsFading(false);
    }, 400);
  };

  const calculateTotalScore = () => answers.reduce((a, b) => a + b, 0);

  // Gemini API Integration
  const handleAnalyze = async () => {
    if (!emotionInput.trim() || isLoading) return;
    setIsLoading(true);

    // 5 different professional psychological answers
    const MOCK_ANSWERS = [
      {
        reality:
          "You might be experiencing emotional burnout rather than just physical exhaustion.",
        explanation:
          "When we constantly push past our limits without processing our feelings, our brain interprets emotional overload as physical tiredness. This is a protective mechanism forcing you to pause.",
      },
      {
        reality:
          "You may be using emotional suppression as a defense mechanism.",
        explanation:
          "Downplaying your feelings is a common way to protect yourself from vulnerability. Over time, however, this disconnects you from your true psychological needs.",
      },
      {
        reality:
          "What feels like 'just stress' might actually be high-functioning anxiety.",
        explanation:
          "Your mind is constantly running simulations to maintain control. This drains your mental bandwidth, leaving you feeling perpetually overwhelmed.",
      },
      {
        reality: "Your feeling of 'guilt' might actually be masked resentment.",
        explanation:
          "When you constantly prioritize others, you betray your own boundaries. The heavy feeling isn't always guilt, it's often exhaustion from always saying yes.",
      },
      {
        reality:
          "You might be experiencing emotional numbness rather than genuine peace.",
        explanation:
          "A lack of strong feelings doesn't always mean you are calm. It can signify that your nervous system has temporarily shut down to avoid processing complex emotions.",
      },
    ];

    setTimeout(() => {
      // Randomly pick one of the answers (0 to 4)
      const randomIndex = Math.floor(Math.random() * MOCK_ANSWERS.length);
      const selectedAnswer = MOCK_ANSWERS[randomIndex];

      setAnalysis({
        myth: emotionInput, // This keeps whatever you typed in the box
        reality: selectedAnswer.reality,
        explanation: selectedAnswer.explanation,
      });
      setIsLoading(false);
    }, 1500);
  };
  // Interactive Guided Breathing
  const GuidedBreathing = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [timeLeft, setTimeLeft] = useState(4);

    useEffect(() => {
      let timer: any;
      if (isActive) {
        timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev > 1) return prev - 1;
            if (phase === "inhale") {
              setPhase("hold");
              return 7;
            }
            if (phase === "hold") {
              setPhase("exhale");
              return 8;
            }
            if (phase === "exhale") {
              setPhase("inhale");
              return 4;
            }
            return 0;
          });
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [isActive, phase]);

    const getScale = () => {
      if (phase === "inhale") return "scale-150 bg-emerald-400/20";
      if (phase === "hold") return "scale-150 bg-emerald-400/40";
      return "scale-100 bg-white/10";
    };

    const getMessage = () => {
      if (phase === "inhale") return "Inhale...";
      if (phase === "hold") return "Hold...";
      return "Exhale...";
    };

    return (
      <div className="flex flex-col items-center justify-center py-10 border-y border-white/10 my-8">
        {!isActive ? (
          <button
            onClick={() => setIsActive(true)}
            className="liquid-glass px-8 py-4 rounded-full text-[hsl(var(--foreground))] hover:bg-white/10 transition-colors shadow-lg"
          >
            Start Guided Breathing
          </button>
        ) : (
          <div className="relative w-48 h-48 flex items-center justify-center my-6">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ease-linear ${getScale()}`}
            />
            <div className="relative z-10 text-center">
              <div className="text-4xl font-display text-white mb-2">
                {timeLeft}
              </div>
              <div className="text-sm uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                {getMessage()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Interactive Guided Grounding
  const GuidedGrounding = () => {
    const [step, setStep] = useState(0);
    const prompts = [
      {
        num: 5,
        action: "SEE",
        desc: "Look around and mentally name 5 things you can see.",
      },
      {
        num: 4,
        action: "TOUCH",
        desc: "Notice the texture of 4 things you can physically touch.",
      },
      {
        num: 3,
        action: "HEAR",
        desc: "Listen closely for 3 distinct sounds around you.",
      },
      {
        num: 2,
        action: "SMELL",
        desc: "Try to identify 2 things you can smell right now.",
      },
      {
        num: 1,
        action: "TASTE",
        desc: "Acknowledge 1 thing you can taste in this moment.",
      },
    ];

    if (step >= prompts.length) {
      return (
        <div className="text-center py-12 animate-fade-rise border-y border-white/10 my-8">
          <div className="w-16 h-16 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h4 className="text-xl text-white mb-2">Grounding Complete</h4>
          <p className="text-[hsl(var(--muted-foreground))]">
            Notice if your racing thoughts have slowed down.
          </p>
          <button
            onClick={() => setStep(0)}
            className="mt-6 text-sm text-white/50 hover:text-white underline decoration-white/30 underline-offset-4"
          >
            Restart
          </button>
        </div>
      );
    }

    const current = prompts[step];

    return (
      <div className="py-8 animate-fade-rise border-y border-white/10 my-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="text-6xl font-display text-white/20 w-16 text-center">
            {current.num}
          </div>
          <div>
            <h4 className="text-xl text-white tracking-widest uppercase mb-2">
              {current.action}
            </h4>
            <p className="text-[hsl(var(--muted-foreground))]">
              {current.desc}
            </p>
          </div>
        </div>
        <button
          onClick={() => setStep((s) => s + 1)}
          className="w-full liquid-glass rounded-xl py-4 text-sm text-[hsl(var(--foreground))] hover:bg-white/10 transition-colors"
        >
          I've completed this step →
        </button>
      </div>
    );
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap');

        :root {
          --font-display: 'Instrument Serif', serif;
          --font-body: 'Inter', sans-serif;
          --background: 201 100% 13%;
          --foreground: 0 0% 100%;
          --muted-foreground: 240 4% 66%;
        }

        body {
          font-family: var(--font-body);
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          margin: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .font-display { font-family: var(--font-display); }
        h1 em { font-style: normal; color: hsl(var(--muted-foreground)); }

        .liquid-glass {
          background: rgba(255, 255, 255, 0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease-in-out, background 0.2s ease, opacity 0.2s ease;
        }

        .liquid-glass::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }

        @keyframes fade-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-rise { animation: fade-rise 0.8s ease-out both; }
        .animate-fade-rise-delay { animation: fade-rise 0.8s ease-out 0.2s both; }
        .animate-fade-rise-delay-2 { animation: fade-rise 0.8s ease-out 0.4s both; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      `,
        }}
      />

      <div className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--background))]/80 to-[hsl(var(--background))] z-0 pointer-events-none" />

        <nav className="relative z-10 flex flex-row justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
          <div
            className="font-display text-3xl tracking-tight text-[hsl(var(--foreground))] select-none cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Aletheia<sup className="text-xs">®</sup>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm text-[hsl(var(--foreground))] transition-colors"
            >
              Home
            </a>
            <a
              href="#reality-check"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("reality-check")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Reality Check
            </a>
            <a
              href="#quizzes"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("quizzes")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Quizzes
            </a>
            <a
              href="#techniques"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("techniques")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Techniques
            </a>
          </div>
          <button
            onClick={() => openTechnique("54321-grounding")}
            className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-full px-6 py-2.5 text-sm hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />{" "}
            1-Click Help
          </button>
        </nav>

        <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 w-full mx-auto min-h-[80vh]">
          <div className="animate-fade-rise">
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl mx-auto font-normal text-[hsl(var(--foreground))]">
              Do you really{" "}
              <em className="not-italic text-[hsl(var(--muted-foreground))]">
                know
              </em>{" "}
              yourself?
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-base sm:text-lg max-w-2xl mx-auto mt-8 leading-relaxed animate-fade-rise-delay">
              You might not be as self-aware as you think. We reveal hidden
              emotions, blind spots, and self-misconceptions beneath the
              surface.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-rise-delay-2">
              <button
                onClick={() =>
                  document
                    .getElementById("reality-check")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="liquid-glass rounded-full px-10 py-4 text-sm text-[hsl(var(--foreground))] hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-lg"
              >
                Discover Your Emotions
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("quizzes")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border border-white/10 rounded-full px-10 py-4 text-sm text-[hsl(var(--foreground))] hover:bg-white/5 active:scale-[0.98] cursor-pointer transition-colors backdrop-blur-sm"
              >
                Test Yourself
              </button>
            </div>
          </div>
        </main>

        <section
          id="reality-check"
          className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 flex flex-col items-center"
        >
          <div className="text-center mb-12 animate-fade-rise-delay">
            <h2 className="font-display text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4">
              Emotion Reality Check
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              Tell us what you're feeling right now, or a common excuse you use.
              We'll reveal the psychological reality.
            </p>
          </div>
          <div className="w-full max-w-2xl animate-fade-rise-delay-2">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="e.g., 'I'm just tired' or 'I feel fine'"
                className="liquid-glass rounded-2xl px-6 py-4 text-base text-[hsl(var(--foreground))] w-full focus:outline-none placeholder:text-[hsl(var(--muted-foreground))] placeholder:opacity-70 shadow-lg"
                value={emotionInput}
                onChange={(e) => setEmotionInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                disabled={isLoading}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !emotionInput.trim()}
                className="liquid-glass rounded-2xl px-8 py-4 text-base text-[hsl(var(--foreground))] hover:scale-[1.03] active:scale-[0.98] cursor-pointer whitespace-nowrap disabled:opacity-40 transition-all font-medium shadow-lg"
              >
                {isLoading ? "Analyzing..." : "Reveal Truth"}
              </button>
            </div>
            {analysis && (
              <div className="liquid-glass rounded-3xl p-8 mt-8 animate-fade-rise text-left border border-white/10 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2 block">
                      The Myth
                    </span>
                    <p className="text-xl font-display text-white/70">
                      "{analysis.myth}"
                    </p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[hsl(var(--foreground))] mb-2 block">
                      The Reality
                    </span>
                    <p className="text-xl font-display text-white">
                      {analysis.reality}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
                    {analysis.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          id="quizzes"
          className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5"
        >
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4">
              Self-Discovery Quizzes
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              Reveal the gap between what you think about yourself and what you
              actually feel.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUIZZES.map((quiz, idx) => (
              <div
                key={quiz.id}
                onClick={() => handleStartQuiz(quiz.id)}
                className="liquid-glass p-8 rounded-3xl hover:bg-white/5 transition-colors cursor-pointer group flex flex-col h-full border border-transparent hover:border-white/10"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="font-display text-2xl text-[hsl(var(--foreground))] mb-3 group-hover:text-white transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed flex-1">
                  {quiz.description}
                </p>
                <div className="mt-6 text-xs font-medium text-white/50 group-hover:text-white flex items-center gap-2 transition-colors">
                  Take Assessment{" "}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="techniques"
          className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 mb-32 border-t border-white/5 bg-black/20 rounded-[3rem] mt-10 backdrop-blur-md"
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4">
              Tips & Techniques
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              Don't just understand your emotions. Learn exactly how to handle
              them with science-based tools.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {TECHNIQUE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm transition-all border ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-[hsl(var(--muted-foreground))] border-white/10 hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TECHNIQUES.filter(
              (t) => activeCategory === "All" || t.category === activeCategory
            ).map((tech, idx) => (
              <div
                key={tech.id}
                onClick={() => openTechnique(tech.id)}
                className="border border-white/10 bg-white/[0.02] p-8 rounded-3xl hover:bg-white/[0.05] hover:border-white/20 transition-colors cursor-pointer group relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {tech.interactiveMode && (
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                )}

                <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 block">
                  {tech.category}
                </span>
                <h3 className="font-display text-3xl text-[hsl(var(--foreground))] mb-2 group-hover:text-white transition-colors">
                  {tech.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mt-4">
                  {tech.whenToUse}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs text-white/50 flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>{" "}
                    {tech.timeRequired}
                  </span>
                  <span className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Guide →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL OVERLAYS */}
      {(activeQuizId || activeTechniqueId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-rise">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={closeModals}
          />

          <div className="relative w-full max-w-2xl liquid-glass rounded-[2rem] p-8 sm:p-12 overflow-hidden flex flex-col min-h-[400px] max-h-[90vh]">
            <button
              onClick={closeModals}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-20 bg-black/50 p-2 rounded-full backdrop-blur-sm"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* QUIZ CONTENT */}
            {activeQuiz && (
              <div
                className={`flex-1 flex flex-col justify-center transition-opacity duration-300 ${
                  isFading ? "opacity-0" : "opacity-100"
                }`}
              >
                {quizStep === 0 && (
                  <div className="text-center animate-fade-rise">
                    <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
                      {activeQuiz.title}
                    </h2>
                    <p className="text-[hsl(var(--muted-foreground))] mb-10 text-lg">
                      {activeQuiz.description}
                    </p>
                    <button
                      onClick={() => {
                        setIsFading(true);
                        setTimeout(() => {
                          setQuizStep(1);
                          setIsFading(false);
                        }, 400);
                      }}
                      className="bg-white text-black rounded-full px-10 py-4 text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition-transform"
                    >
                      Begin Assessment
                    </button>
                  </div>
                )}

                {quizStep > 0 && !isResultView && (
                  <div className="w-full flex flex-col h-full animate-fade-rise">
                    <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
                      <div
                        className="h-full bg-white transition-all duration-500 ease-out"
                        style={{
                          width: `${
                            (quizStep / activeQuiz.questions.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-6 block">
                      Question {quizStep} of {activeQuiz.questions.length}
                    </span>
                    <h3 className="font-display text-3xl sm:text-4xl text-white mb-10 leading-tight">
                      {activeQuiz.questions[quizStep - 1].text}
                    </h3>
                    <div className="flex flex-col gap-3 mt-auto">
                      {activeQuiz.questions[quizStep - 1].customOptions ? (
                        activeQuiz.questions[quizStep - 1].customOptions.map(
                          (opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswer(opt.score)}
                              className="w-full text-left p-4 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-[hsl(var(--foreground))] text-sm group flex items-center justify-between"
                            >
                              {opt.label}{" "}
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                              </span>
                            </button>
                          )
                        )
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          {LIKERT_OPTIONS.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswer(opt.score)}
                              className="p-4 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-[hsl(var(--foreground))] text-sm flex flex-col items-center justify-center gap-2"
                            >
                              <span className="w-4 h-4 rounded-full border border-white/30 group-hover:bg-white" />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isResultView &&
                  (() => {
                    const result = activeQuiz.getResult(calculateTotalScore());
                    return (
                      <div className="animate-fade-rise text-left w-full h-full flex flex-col">
                        <span className="text-xs uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
                          Assessment Complete
                        </span>
                        <h2 className="font-display text-4xl sm:text-5xl text-white mb-6 leading-none">
                          {result.hook}
                        </h2>
                        <div className="space-y-6 mb-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">
                              Psychological Insight
                            </h4>
                            <p className="text-[hsl(var(--foreground))] leading-relaxed">
                              {result.insight}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">
                              The Reality Check
                            </h4>
                            <p className="text-[hsl(var(--foreground))] leading-relaxed">
                              {result.realityCheck}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-4">
                              Suggested Actions
                            </h4>
                            <ul className="space-y-3">
                              {result.suggestions.map((sug, i) => (
                                <li
                                  key={i}
                                  className="flex gap-3 text-sm text-[hsl(var(--foreground))] items-start"
                                >
                                  <span className="text-emerald-400 mt-0.5">
                                    ↳
                                  </span>{" "}
                                  {sug}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex gap-4 pt-6 border-t border-white/10 mt-auto">
                          <button
                            onClick={closeModals}
                            className="flex-1 liquid-glass rounded-xl py-4 text-sm text-[hsl(var(--foreground))] hover:bg-white/5 transition-colors text-center"
                          >
                            Close
                          </button>
                          <button
                            onClick={() =>
                              alert("Result link copied to clipboard!")
                            }
                            className="flex-1 bg-white text-black rounded-xl py-4 text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
                          >
                            Share Insight{" "}
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="18" cy="5" r="3"></circle>
                              <circle cx="6" cy="12" r="3"></circle>
                              <circle cx="18" cy="19" r="3"></circle>
                              <line
                                x1="8.59"
                                y1="13.51"
                                x2="15.42"
                                y2="17.49"
                              ></line>
                              <line
                                x1="15.41"
                                y1="6.51"
                                x2="8.59"
                                y2="10.49"
                              ></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
              </div>
            )}

            {/* TECHNIQUE CONTENT */}
            {activeTechnique && (
              <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-2 animate-fade-rise">
                <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 block">
                  {activeTechnique.category}
                </span>
                <h2 className="font-display text-4xl sm:text-5xl text-white mb-6 leading-none">
                  {activeTechnique.title}
                </h2>

                {activeTechnique.interactiveMode === "breathing" && (
                  <GuidedBreathing />
                )}
                {activeTechnique.interactiveMode === "grounding" && (
                  <GuidedGrounding />
                )}

                <div className="grid sm:grid-cols-2 gap-4 mb-8 border-t border-b border-white/10 py-6 mt-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">
                      When to use
                    </h4>
                    <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
                      {activeTechnique.whenToUse}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">
                      Why it works
                    </h4>
                    <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
                      {activeTechnique.whyItWorks}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xs uppercase tracking-widest text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    Step-by-Step Guide
                  </h4>
                  <ul className="space-y-4">
                    {activeTechnique.steps.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-[hsl(var(--foreground))] pt-0.5">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-400 mb-2">
                    ⚡ The Quick Version
                  </h4>
                  <p className="text-sm text-[hsl(var(--foreground))]">
                    {activeTechnique.quickVersion}
                  </p>
                </div>

                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-white text-black rounded-xl py-4 text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition-transform"
                  >
                    Done Reading
                  </button>
                  <button
                    onClick={() => {
                      alert("Saved to your personal toolkit!");
                      closeModals();
                    }}
                    className="liquid-glass rounded-xl px-6 py-4 text-sm text-[hsl(var(--foreground))] hover:bg-white/5 transition-colors flex items-center justify-center"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
