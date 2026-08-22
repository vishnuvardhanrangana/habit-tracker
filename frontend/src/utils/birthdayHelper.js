import stupidConfig from '../components/stupid/stupidConfig';

/**
 * Gets the next birthday Date based on stupidConfig.birthday (MM-DD)
 */
export const getNextBirthday = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Parse month and day from stupidConfig.birthday (e.g. "09-28")
  const [monthStr, dayStr] = stupidConfig.birthday.split('-');
  const month = parseInt(monthStr, 10) - 1; // 0-indexed month
  const day = parseInt(dayStr, 10);
  
  let target = new Date(currentYear, month, day, 0, 0, 0, 0);
  
  if (now > target) {
    target = new Date(currentYear + 1, month, day, 0, 0, 0, 0);
  }
  return target;
};

/**
 * Checks if today is the birthday
 */
export const isBirthdayToday = () => {
  const now = new Date();
  const [monthStr, dayStr] = stupidConfig.birthday.split('-');
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return now.getMonth() === month && now.getDate() === day;
};

/**
 * Gets details for the birthday countdown progress
 */
export const getBirthdayCountdownDetails = () => {
  const today = new Date();
  const isToday = isBirthdayToday();
  const target = getNextBirthday();
  
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = target.getTime() - todayDateOnly.getTime();
  const daysToGo = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalWindow = 60; // 60 days progress tracking window
  const daysPassed = Math.max(0, Math.min(totalWindow, totalWindow - daysToGo));
  const progressPercent = Math.round((daysPassed / totalWindow) * 100);

  return {
    isToday,
    daysToGo: isToday ? 0 : daysToGo,
    daysPassed,
    progressPercent,
    targetYear: target.getFullYear()
  };
};
