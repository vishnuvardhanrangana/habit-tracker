import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import HabitModal, { ICONS } from '../components/HabitModal';
import { Search, Plus, Flame, Award, Trash2, Archive, ArchiveRestore, Edit3, CheckCircle, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Study', 'Health', 'Fitness', 'Personal', 'Work', 'Learning', 'Other'];

const Habits = () => {
  const { showToast } = useToast();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // name, streak, rate
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [currentHabit, setCurrentHabit] = useState(null);

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits', { params: { includeArchived: true } });
      if (res.data.success) {
        setHabits(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      showToast("Could not load habits.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreate = () => {
    setCurrentHabit(null);
    setModalOpen(true);
  };

  const handleEdit = (habit) => {
    setCurrentHabit(habit);
    setModalOpen(true);
  };

  const handleSave = async (habitData) => {
    try {
      let res;
      if (habitData.id) {
        res = await api.put(`/habits/${habitData.id}`, habitData);
        if (res.data.success) {
          showToast('Habit updated successfully!', 'success');
        }
      } else {
        res = await api.post('/habits', habitData);
        if (res.data.success) {
          showToast('Habit created successfully!', 'success');
        }
      }
      fetchHabits();
      return true;
    } catch (err) {
      console.error("Failed to save habit:", err);
      showToast(err.response?.data?.message || 'Could not save habit', 'error');
      return false;
    }
  };

  const handleArchive = async (id, archive) => {
    const action = archive ? 'archive' : 'restore';
    if (archive && !window.confirm("Are you sure you want to archive this habit? It will be hidden from the active routine checklist.")) {
      return;
    }

    try {
      const res = await api.patch(`/habits/${id}/archive`, null, { params: { archive } });
      if (res.data.success) {
        showToast(archive ? 'Habit archived successfully' : 'Habit restored successfully', 'success');
        fetchHabits();
      }
    } catch (err) {
      console.error(`Failed to ${action} habit:`, err);
      showToast(`Could not ${action} habit`, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete "${name}"? This action is destructive and will erase all completion and streak history.`)) {
      return;
    }

    try {
      const res = await api.delete(`/habits/${id}`);
      if (res.data.success) {
        showToast('Habit deleted permanently', 'success');
        fetchHabits();
      }
    } catch (err) {
      console.error("Failed to delete habit:", err);
      showToast("Could not delete habit", 'error');
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Study': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Health': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Fitness': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Personal': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Work': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Learning': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      default: return 'bg-slate-50 text-slate-650 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  // Filter & Sort Logic
  const filteredHabits = habits
    .filter(habit => {
      if (showArchived) {
        return !habit.active;
      } else {
        return habit.active;
      }
    })
    .filter(habit => {
      if (selectedCategory === 'All') return true;
      return habit.category === selectedCategory;
    })
    .filter(habit => {
      return habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'streak') {
        return b.currentStreak - a.currentStreak;
      } else if (sortBy === 'rate') {
        return b.completionRate - a.completionRate;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Your Habits</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage, track, and analyze your routines.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl shadow-sm hover:shadow-lg transition-all text-sm active:scale-98"
        >
          <Plus className="w-5 h-5" />
          <span>Create Habit</span>
        </button>
      </div>

      {/* Filters & Search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark space-y-4 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search habits by name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
            />
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:outline-none dark:text-white transition-all text-sm font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="streak">Sort by Current Streak</option>
              <option value="rate">Sort by Completion Rate</option>
            </select>
          </div>

          {/* Archive Toggle */}
          <div className="flex items-center justify-start md:justify-end gap-2 px-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                showArchived
                  ? 'bg-rose-50 border-rose-200 text-rose-650 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {showArchived ? 'Showing Archived' : 'Show Archived'}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800/50 pt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-50/40 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habits Cards Grid */}
      {filteredHabits.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center transition-colors duration-300 shadow-premium dark:shadow-premium-dark">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">No habits found</h3>
          <p className="text-slate-450 dark:text-slate-500 text-sm mt-1 mb-5">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search filters.'
              : showArchived
              ? 'You do not have any archived habits.'
              : 'Start building your routine by creating your first habit.'}
          </p>
          {!searchTerm && selectedCategory === 'All' && !showArchived && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Habit</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => {
            const IconComponent = ICONS.find(ico => ico.name === habit.icon)?.icon || Sparkles;

            const colorThemeClass = 'text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400';

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover flex flex-col justify-between transition-all duration-300"
              >
                {/* Upper Section */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorThemeClass}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(habit.category)}`}>
                          {habit.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white truncate mt-0.5 text-base" title={habit.name}>
                          {habit.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed min-h-[2.5rem] line-clamp-2">
                    {habit.description || 'No description provided.'}
                  </p>

                  {/* Habit Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-800/40">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 block uppercase tracking-wider">Streak</span>
                      <span className="text-xs font-bold text-emerald-650 flex items-center justify-center gap-0.5 mt-0.5">
                        <Flame className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-600" />
                        {habit.currentStreak}d
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 block uppercase tracking-wider">Best</span>
                      <span className="text-xs font-bold text-emerald-650 flex items-center justify-center gap-0.5 mt-0.5">
                        <Award className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-600" />
                        {habit.bestStreak}d
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 block uppercase tracking-wider">Rate</span>
                      <span className="text-xs font-bold text-emerald-650 flex items-center justify-center gap-0.5 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-500/10 text-emerald-600" />
                        {Math.round(habit.completionRate * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lower Action buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 mt-6 pt-4 gap-2">
                  <button
                    onClick={() => handleEdit(habit)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleArchive(habit.id, habit.active)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all"
                  >
                    {habit.active ? (
                      <>
                        <Archive className="w-4 h-4" />
                        <span>Archive</span>
                      </>
                    ) : (
                      <>
                        <ArchiveRestore className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-500">Restore</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(habit.id, habit.name)}
                    className="p-2 text-slate-405 hover:text-rose-600 dark:hover:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <HabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        habit={currentHabit}
      />
    </div>
  );
};

export default Habits;
