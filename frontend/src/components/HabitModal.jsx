import React, { useState, useEffect } from 'react';
import { X, BookOpen, Heart, Dumbbell, User, Briefcase, GraduationCap, Flame, Sparkles, Coffee, Target } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Study', 'Health', 'Fitness', 'Personal', 'Work', 'Learning', 'Other'];

const ICONS = [
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Heart', icon: Heart },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'User', icon: User },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Flame', icon: Flame },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Coffee', icon: Coffee },
  { name: 'Target', icon: Target },
];

const COLORS = [
  { name: 'Emerald', value: 'emerald', class: 'bg-emerald-500 text-emerald-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500 text-indigo-500' },
  { name: 'Rose', value: 'rose', class: 'bg-rose-500 text-rose-500' },
  { name: 'Amber', value: 'amber', class: 'bg-amber-500 text-amber-500' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-500 text-blue-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500 text-purple-500' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-500 text-teal-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500 text-orange-500' },
];

const HabitModal = ({ isOpen, onClose, onSave, habit = null }) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Study');
  const [frequency, setFrequency] = useState('Daily');
  const [targetCount, setTargetCount] = useState(1);
  const [selectedColor, setSelectedColor] = useState('emerald');
  const [selectedIcon, setSelectedIcon] = useState('BookOpen');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setCategory(habit.category || 'Study');
      setFrequency(habit.frequency || 'Daily');
      setTargetCount(habit.targetCount || 1);
      setSelectedColor(habit.color || 'emerald');
      setSelectedIcon(habit.icon || 'BookOpen');
    } else {
      setName('');
      setDescription('');
      setCategory('Study');
      setFrequency('Daily');
      setTargetCount(1);
      setSelectedColor('emerald');
      setSelectedIcon('BookOpen');
    }
  }, [habit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Habit name is required', 'warning');
      return;
    }

    setIsSubmitting(true);
    const success = await onSave({
      id: habit?.id,
      name: name.trim(),
      description: description.trim(),
      category,
      frequency,
      targetCount,
      color: selectedColor,
      icon: selectedIcon,
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-fade-scale">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink 3L Water"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
              maxLength={50}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Stay hydrated throughout the work hours"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium h-20 resize-none"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:outline-none dark:text-white transition-all text-sm font-medium focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Count */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Goal
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:outline-none dark:text-white transition-all text-sm font-medium focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20"
              />
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => {
                let ringColor = 'ring-emerald-500';
                if (c.value === 'indigo') ringColor = 'ring-indigo-500';
                else if (c.value === 'rose') ringColor = 'ring-rose-500';
                else if (c.value === 'amber') ringColor = 'ring-amber-500';
                else if (c.value === 'blue') ringColor = 'ring-blue-500';
                else if (c.value === 'purple') ringColor = 'ring-purple-500';
                else if (c.value === 'teal') ringColor = 'ring-teal-500';
                else if (c.value === 'orange') ringColor = 'ring-orange-500';

                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-7 h-7 rounded-full transition-all duration-200 ${
                      c.class.split(' ')[0]
                    } ${
                      selectedColor === c.value
                        ? `ring-4 ring-offset-2 dark:ring-offset-slate-900 ${ringColor} scale-110`
                        : 'hover:scale-105'
                    }`}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {ICONS.map((ico) => {
                const IconComponent = ico.icon;
                const isSelected = selectedIcon === ico.name;
                return (
                  <button
                    key={ico.name}
                    type="button"
                    onClick={() => setSelectedIcon(ico.name)}
                    className={`p-3 rounded-xl flex items-center justify-center border transition-all duration-205 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-450 scale-105'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-semibold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all text-sm"
            >
              {isSubmitting ? 'Saving...' : habit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale {
          animation: fadeScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default HabitModal;
export { ICONS, COLORS };
