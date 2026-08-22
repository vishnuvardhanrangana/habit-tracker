import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StupidQuote = ({ progressToday = 0, daysToBirthday = null }) => {
  const quote = useMemo(() => {
    // 1. Birthday specific quotes have priority
    if (daysToBirthday !== null) {
      if (daysToBirthday === 0) {
        return "HAPPY BIRTHDAY STUPID! 🎂🎉❤️ From Idiot, with love. ❤️";
      }
      if (daysToBirthday === 1) return "TOMORROW. 🎂🎁";
      if (daysToBirthday === 3) return "THREE DAYS. The secret is getting harder to hide. 🤫";
      if (daysToBirthday === 5) return "Bro... FIVE DAYS. 😭🎁";
      if (daysToBirthday === 10) return "10 DAYS. 👀🎁";
      if (daysToBirthday > 1 && daysToBirthday < 10) {
        return `${daysToBirthday} DAYS TO GO. Idiot is getting nervous. 🤫`;
      }
      if (daysToBirthday >= 10 && daysToBirthday <= 20) {
        return "Still time to prepare... 👀";
      }
      if (daysToBirthday > 20 && daysToBirthday <= 30) {
        return "Something special is getting closer. 🎁";
      }
      if (daysToBirthday > 30 && daysToBirthday <= 45) {
        return "Your birthday is getting closer... 👀";
      }
    }

    // 2. Progress based quotes
    const percentage = Math.round(progressToday * 100);
    if (percentage === 100) return "STUPID DID IT! Idiot is proud. 🥹🏆";
    
    // Choose between progress quote or a random general/habit quote
    const rand = Math.random();
    if (rand < 0.4) {
      if (percentage <= 20) return "Okay Stupid... let's actually start. 😭";
      if (percentage <= 40) return "Not bad, Stupid. Keep going. 👀";
      if (percentage <= 60) return "You're getting there. 🔥";
      if (percentage <= 80) return "Okayyy Stupid, you're cooking. 🔥";
      return "SO CLOSE. DON'T STOP NOW. 😤";
    }

    const generalQuotes = [
      "Idiot made this just for you. 👀",
      "Stupid, someone is thinking about you. 💜",
      "Hey Stupid, Idiot is watching. 👀",
      "You found this? Idiot definitely didn't expect that. 😭",
      "A little something from Idiot → Stupid ❤️",
      "Come on Stupid, Idiot believes in you. ❤️",
      "One more habit, Stupid. You've got this. 🔥",
      "Idiot is proud of you already. 🥹",
      "Look at you actually being productive. 👀",
      "Keep going, Stupid. 🔥"
    ];

    const idx = Math.floor(Math.random() * generalQuotes.length);
    return generalQuotes[idx];
  }, [progressToday, daysToBirthday]);

  return (
    <motion.div
      key={quote} // key triggers anim re-run on quote change
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-sm md:text-base font-extrabold italic text-purple-650 dark:text-purple-300 bg-purple-50/40 dark:bg-purple-950/20 px-4 py-2.5 rounded-2xl border border-purple-100/50 dark:border-purple-900/30 text-center inline-block max-w-md backdrop-blur-sm shadow-sm"
    >
      "{quote}"
    </motion.div>
  );
};

export default StupidQuote;
