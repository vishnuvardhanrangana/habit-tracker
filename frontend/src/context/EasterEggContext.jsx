import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { easterEggConfig } from '../components/easterEggs/easterEggConfig';

const EasterEggContext = createContext(null);

export const EasterEggProvider = ({ children }) => {
  const { user } = useAuth();
  const isStupid = user?.email === 'stupid';

  const [unlockedEggs, setUnlockedEggs] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [specialSequenceActive, setSpecialSequenceActive] = useState(null);

  // Load unlocked eggs on mount or when user changes
  useEffect(() => {
    if (!isStupid) {
      setUnlockedEggs({});
      setActiveModal(null);
      setToasts([]);
      setSpecialSequenceActive(null);
      return;
    }

    try {
      const saved = localStorage.getItem('stupid_easter_eggs');
      if (saved) {
        setUnlockedEggs(JSON.parse(saved));
      } else {
        setUnlockedEggs({});
      }
    } catch (e) {
      console.error('Failed to parse stupid_easter_eggs', e);
      setUnlockedEggs({});
    }
  }, [isStupid]);

  const isUnlocked = (eggId) => {
    if (!isStupid) return false;
    return !!unlockedEggs[eggId];
  };

  const getUnlockedEggs = () => {
    if (!isStupid) return {};
    return unlockedEggs;
  };

  const unlockEgg = (eggId) => {
    if (!isStupid) return false;
    if (unlockedEggs[eggId]) return false; // Already unlocked

    const config = easterEggConfig[eggId];
    if (!config) {
      console.warn(`Easter egg with ID "${eggId}" not found in config.`);
      return false;
    }

    // Update state & persistence
    const updated = { ...unlockedEggs, [eggId]: true };
    setUnlockedEggs(updated);
    localStorage.setItem('stupid_easter_eggs', JSON.stringify(updated));

    // Handle presentation
    if (config.type === 'toast') {
      const toastId = Date.now() + Math.random().toString(36).substr(2, 9);
      
      // Determine message if it's a random choice (like secret-idle)
      let displayContent = { ...config.display };
      if (config.id === 'secret-idle' && config.display.messages) {
        const msgs = config.display.messages;
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        displayContent.title = "Stupid...";
        displayContent.text = randomMsg;
      }

      const newToast = {
        id: toastId,
        eggId: config.id,
        name: config.name,
        display: displayContent,
      };

      setToasts((prev) => [...prev, newToast]);
    } else if (config.type === 'modal') {
      setActiveModal(config);
    } else if (config.type === 'special') {
      setSpecialSequenceActive(config.id);
    }

    return true;
  };

  const removeToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const resetEggs = () => {
    if (!isStupid) return;
    localStorage.removeItem('stupid_easter_eggs');
    localStorage.removeItem('stupid_calendar_visited_dates');
    localStorage.removeItem('stupid_secret_unlocked'); // backward compatibility
    setUnlockedEggs({});
    setActiveModal(null);
    setToasts([]);
    setSpecialSequenceActive(null);
  };

  const value = {
    isUnlocked,
    getUnlockedEggs,
    unlockEgg,
    activeModal,
    closeModal,
    toasts,
    removeToast,
    specialSequenceActive,
    setSpecialSequenceActive,
    resetEggs,
    isStupid,
  };

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEggs = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    // Return a dummy object if context is not loaded (safety fallback)
    return {
      isUnlocked: () => false,
      getUnlockedEggs: () => ({}),
      unlockEgg: () => false,
      activeModal: null,
      closeModal: () => {},
      toasts: [],
      removeToast: () => {},
      specialSequenceActive: false,
      setSpecialSequenceActive: () => {},
      resetEggs: () => {},
      isStupid: false,
    };
  }
  return context;
};
