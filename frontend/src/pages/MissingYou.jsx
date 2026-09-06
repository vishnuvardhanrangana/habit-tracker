import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import AuroraBackground from '../components/reactbits/AuroraBackground';
import StarfieldParticles from '../components/reactbits/StarfieldParticles';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import StarBorder from '../components/reactbits/StarBorder';
import StaggeredText from '../components/reactbits/StaggeredText';
import BlurText from '../components/reactbits/BlurText';
import stupidConfig from '../components/stupid/stupidConfig';

// ============================================================================
// CONFIGURATION: Set the date and time when you last saw each other.
// Change this value to adjust the starting date/time for the live counter.
// Format: "YYYY-MM-DDTHH:mm:ss"
// ============================================================================
export const LAST_SEEN_DATE = "2021-05-06T00:00:00";

// Primary emotional quote cards
const emotionalCards = [
  {
    tag: 'Missing You',
    icon: '❤️',
    quote: 'Some absences are louder than words.',
    detail: 'Even in a crowded room, the quiet space where you should be is the only thing I notice.',
  },
  {
    tag: 'Every Day',
    icon: '✨',
    quote: 'I may not see you every day, but somehow I still look for you everywhere.',
    detail: 'In every crowd, every quiet glance, every passing shadow—part of me is still hoping it’s you.',
  },
  {
    tag: '🫠',
    icon: '🫠',
    quote: 'Some days I don’t even know how to explain how much I miss you.',
    detail: 'Words just feel too small for how heavy the day feels without getting to see you.',
  },
  {
    tag: '🥹',
    icon: '🥹',
    quote: 'I just wish I could see you, even for a few minutes.',
    detail: 'Just a single moment, a brief smile, or a quiet glance would turn my entire day around.',
  },
  {
    tag: '🙁',
    icon: '🙁',
    quote: 'The hardest part isn’t being far away. It’s knowing that I can’t simply see you whenever I want.',
    detail: 'It’s the simple things—not being able to walk over, not being able to just say hello in person.',
  },
  {
    tag: 'Always',
    icon: '💭',
    quote: 'There isn’t even a second I spend without thinking about you.',
    detail: 'You exist quietly in the back of my mind through every conversation, every task, every hour.',
  },
];

// List of emotional rotating messages with emojis
const emotionalMessages = [
  "I wish I could see you, even for a minute. 🥹",
  "Every day feels a little longer without you. 🙁",
  "I don’t need anything special… I just want to see you. 🫠",
  "I keep looking for you without even realizing it. 🙁",
  "I miss the little moments more than the big ones. 🥹",
  "A normal day would feel complete if you were here.",
  "Sometimes I just sit there and realize how badly I want to see you again. 🫠",
  "I wish I could pause everything and just spend a little time with you. 🥹",
];

// Selectable emotional moods
const emotionalThemes = [
  {
    id: 'presence',
    icon: '🫠',
    title: 'I Miss Your Presence',
    message: "It’s strange how someone’s absence can make an ordinary day feel completely hollow.",
  },
  {
    id: 'moment',
    icon: '🥹',
    title: 'Just One Moment',
    message: "I don’t need an entire day with you. Sometimes I just wish I could have one quiet moment.",
  },
  {
    id: 'without',
    icon: '🙁',
    title: 'Without You',
    message: "Everything looks normal on the surface… but deep down, something always feels missing.",
  },
  {
    id: 'night',
    icon: '🌙',
    title: 'At Night',
    message: "When the noise of the day fades and everything gets still, that’s when I miss you most. 🥹",
  },
  {
    id: 'thinking',
    icon: '💭',
    title: 'Always Thinking',
    message: "No matter how busy the day gets, there isn’t a single second that you aren’t on my mind.",
  },
];

const MissingYou = () => {
  // Safe date resolver: uses LAST_SEEN_DATE if valid, or falls back to stupidConfig's last meeting date
  const parsedDate = new Date(LAST_SEEN_DATE);
  const effectiveDate = !isNaN(parsedDate.getTime())
    ? parsedDate
    : (stupidConfig?.lastMeetingDate ? new Date(stupidConfig.lastMeetingDate) : new Date("2021-05-06T00:00:00"));

  // Real-time elapsed time calculation
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - effectiveDate.getTime());

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [effectiveDate]);

  // Rotating emotional messages state
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % emotionalMessages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrevMessage = () => {
    setMessageIndex((prev) => (prev - 1 + emotionalMessages.length) % emotionalMessages.length);
  };

  const handleNextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % emotionalMessages.length);
  };

  // Selected emotional theme state
  const [activeThemeId, setActiveThemeId] = useState('presence');
  const activeTheme = emotionalThemes.find((t) => t.id === activeThemeId) || emotionalThemes[0];

  return (
    <AuroraBackground className="min-h-full -m-6 md:-m-8 p-6 md:p-12 relative overflow-hidden">
      {/* Distant warm ember stars drifting softly */}
      <StarfieldParticles count={50} />

      <div className="max-w-4xl mx-auto space-y-16 py-6 relative z-10 font-sans">
        {/* Top subtle emotional badge */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-rose-900/40 bg-rose-950/30 backdrop-blur-md text-xs font-medium text-rose-200/90 tracking-wide select-none shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Missing You Every Day 🥹</span>
          </motion.div>
        </div>

        {/* Section 1: Main Emotional Heading */}
        <header className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-3">
            <span className="text-3xl md:text-5xl select-none animate-pulse">❤️</span>
            <StaggeredText
              text="Missing You"
              as="h1"
              staggerDelay={0.05}
              initialDelay={0.2}
              className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-rose-50 font-serif"
            />
          </div>
          <div className="pt-2">
            <BlurText
              text="“I am unable to see you every day. There isn't even a second I spend without thinking about you.”"
              delay={100}
              className="text-base md:text-lg text-rose-200/85 font-light italic tracking-wide max-w-2xl mx-auto"
            />
          </div>
        </header>

        {/* Section 2: Core Emotional Hero Card (Spotlight Card with Star Border in Deep Red) */}
        <section className="relative">
          <StarBorder color="#be123c" speed="16s" className="shadow-[0_0_35px_rgba(190,18,60,0.15)]">
            <SpotlightCard
              spotlightColor="rgba(244, 63, 94, 0.12)"
              className="p-8 md:p-12 border border-rose-950/60 bg-[#170408]/85 text-center"
            >
              <div className="space-y-6 max-w-2xl mx-auto">
                <p className="text-xl md:text-2xl lg:text-[1.65rem] font-light leading-relaxed text-rose-50 tracking-normal">
                  “I don’t just miss you sometimes…
                  <br />
                  <span className="text-rose-200 font-normal">
                    I miss you in every single moment you’re not here. 🥹
                  </span>”
                </p>

                <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent mx-auto" />

                <p className="text-base md:text-lg text-rose-200/85 font-light leading-relaxed">
                  “The hardest truth of my day is having so much to share, but not having you right in front of me.”
                </p>
              </div>
            </SpotlightCard>
          </StarBorder>
        </section>

        {/* Section 3: Time Since I Saw You Live Counter */}
        <section className="space-y-6 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2 text-xs uppercase tracking-widest text-rose-300/80 font-semibold">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Time Since I Saw You</span>
            </div>
            <p className="text-xs text-rose-300/60 italic">
              Counting every second without you 🙁
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Days', value: timeElapsed.days },
              { label: 'Hours', value: timeElapsed.hours },
              { label: 'Minutes', value: timeElapsed.minutes },
              { label: 'Seconds', value: timeElapsed.seconds },
            ].map((unit, idx) => (
              <div
                key={unit.label}
                className="relative overflow-hidden rounded-2xl border border-rose-950/70 bg-[#160307]/75 backdrop-blur-md p-4 sm:p-5 text-center shadow-lg transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.12)]"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-light text-rose-50 tracking-tight flex items-center justify-center">
                  <span>{String(unit.value).padStart(2, '0')}</span>
                  {idx < 3 && (
                    <span className="hidden sm:inline-block ml-3 text-rose-500/40 text-lg font-light select-none">
                      :
                    </span>
                  )}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-rose-300/75 mt-1.5 font-medium">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Emotional Sections & Cards (Step 5 Specific Content) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-rose-300/80 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Feelings That Linger</span>
            </div>
            <p className="text-xs text-rose-300/60 italic">
              What stays in the quiet moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emotionalCards.map((card, idx) => (
              <SpotlightCard
                key={idx}
                spotlightColor="rgba(244, 63, 94, 0.08)"
                className="p-6 md:p-7 border border-rose-950/60 bg-[#180408]/75 backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-rose-800/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border border-rose-900/30 bg-rose-950/40 text-rose-300">
                      <span>{card.icon}</span>
                      <span>{card.tag}</span>
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-light text-rose-100 italic leading-snug font-serif">
                    “{card.quote}”
                  </h3>
                  <p className="text-xs md:text-sm text-rose-300/70 font-light leading-relaxed">
                    {card.detail}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* Section 5: Emotional Messages Carousel */}
        <section
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="relative rounded-2xl border border-rose-950/60 bg-[#180408]/60 backdrop-blur-md px-8 py-10 min-h-[140px] flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.06)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, filter: 'blur(8px)', y: 6 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -6 }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-lg md:text-xl font-light text-rose-100 italic tracking-wide px-4"
              >
                “{emotionalMessages[messageIndex]}”
              </motion.div>
            </AnimatePresence>

            {/* Carousel navigation buttons */}
            <button
              onClick={handlePrevMessage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-rose-400/60 hover:text-rose-100 hover:bg-rose-900/30 transition-colors"
              title="Previous message"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-rose-400/60 hover:text-rose-100 hover:bg-rose-900/30 transition-colors"
              title="Next message"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-1.5 mt-4">
            {emotionalMessages.map((_, i) => (
              <button
                key={i}
                onClick={() => setMessageIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === messageIndex
                    ? 'w-6 bg-rose-400/80'
                    : 'w-1.5 bg-rose-950/80 hover:bg-rose-800/60'
                }`}
                title={`Message ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Section 6: Deep Emotional Letter ("What I Can't Say") */}
        <section className="max-w-2xl mx-auto">
          <SpotlightCard
            spotlightColor="rgba(225, 29, 72, 0.08)"
            className="p-8 md:p-10 border border-rose-950/70 bg-gradient-to-b from-[#1b050a]/75 to-[#120205]/90"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-rose-400/90 font-medium">
                <span className="text-base select-none">💭</span>
                <span>What I Can’t Say Out Loud</span>
              </div>

              <p className="text-lg md:text-xl font-light text-rose-100 italic">
                “I don’t know how to explain it properly…”
              </p>

              <div className="pt-1 text-rose-200/90 font-light leading-relaxed text-base md:text-[1.05rem] space-y-3">
                <BlurText
                  text="“I just know that when I don't see you, my day feels different. I miss your presence, your little expressions, your voice, and those ordinary moments that never felt ordinary to me. I wish I could see you every day. And honestly, even seeing you for a few minutes would be enough to make my entire day better. 🥹”"
                  delay={55}
                  className="leading-relaxed font-light text-rose-200/90"
                />
              </div>
            </div>
          </SpotlightCard>
        </section>

        {/* Section 7: Selectable Moods & Emotional Themes */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs uppercase tracking-widest text-rose-300/80 font-semibold">
              Selectable Themes
            </h2>
            <p className="text-sm text-rose-300/60 font-light">
              Moments and moods that linger quietly
            </p>
          </div>

          {/* Theme selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {emotionalThemes.map((theme) => {
              const isSelected = theme.id === activeThemeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all duration-300 flex items-center space-x-3 ${
                    isSelected
                      ? 'border-rose-500/60 bg-rose-950/40 text-rose-50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                      : 'border-rose-950/70 bg-[#160307]/50 text-rose-300/70 hover:border-rose-800/50 hover:bg-rose-950/20 hover:text-rose-200'
                  }`}
                >
                  <span className="text-xl select-none">{theme.icon}</span>
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {theme.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Theme Display Card */}
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTheme.id}
                initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="rounded-2xl border border-rose-900/40 bg-rose-950/25 backdrop-blur-md p-6 text-center"
              >
                <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-rose-300/80 mb-2 font-medium">
                  <span>{activeTheme.icon}</span>
                  <span>{activeTheme.title}</span>
                </div>
                <p className="text-base md:text-lg font-light text-rose-100/95 italic leading-relaxed">
                  “{activeTheme.message}”
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Section 8: Quiet Closing Note */}
        <footer className="pt-8 pb-12 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="space-y-2.5"
          >
            <p className="text-sm md:text-base font-light text-rose-300/60 tracking-wide">
              Until I see you again…
            </p>
            <motion.p
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
              className="text-xl md:text-2xl font-light text-rose-100 font-serif italic tracking-wide"
            >
              “I’ll keep missing you. 🥹❤️”
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 1.2, ease: 'easeOut' }}
              className="text-xs md:text-sm font-light text-rose-300/70 tracking-wide italic pt-1"
            >
              “Maybe that’s the problem… I don’t know how to stop missing you. 🫠”
            </motion.p>
          </motion.div>

          <div className="pt-6 flex justify-center items-center space-x-2 text-rose-900/60 text-xs">
            <span className="w-8 h-px bg-rose-950" />
            <Heart className="w-3.5 h-3.5 text-rose-600/50 fill-rose-600/20" />
            <span className="w-8 h-px bg-rose-950" />
          </div>
        </footer>
      </div>
    </AuroraBackground>
  );
};

export default MissingYou;
