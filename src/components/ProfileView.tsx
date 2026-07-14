import React, { useState, useRef } from 'react';
import { Award, Trophy, Star, Bookmark, Hash, ShieldAlert, Edit2, Check, X, Camera, Upload, Link as LinkIcon } from 'lucide-react';
import { UserProfile } from '../types';
import { GlassCard } from './GlassCard';

interface ProfileViewProps {
  user: UserProfile;
  onSetRole: (role: 'member' | 'admin') => void;
  onUpdateName: (newName: string) => void;
  onUpdateInterests: (newInterests: string[]) => void;
  onUpdateAvatar: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
];

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  onSetRole, 
  onUpdateName, 
  onUpdateInterests,
  onUpdateAvatar 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [successAvatarMsg, setSuccessAvatarMsg] = useState(false);

  const [newInterest, setNewInterest] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Avatar states
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = () => {
    const parts = user.name.split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (fullName) {
      onUpdateName(fullName);
      setIsEditing(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newInterest.trim();
    if (trimmed && !user.interests.includes(trimmed)) {
      onUpdateInterests([...user.interests, trimmed]);
      setNewInterest('');
      setShowInput(false);
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    onUpdateInterests(user.interests.filter((item) => item !== interestToRemove));
  };

  return (
    <div id="profile-view-container" className="space-y-8 animate-fade-in font-sans">
      <div id="profile-header">
        <h1 id="profile-title" className="text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p id="profile-subtitle" className="text-gray-800 dark:text-slate-200 mt-1 font-medium">
          Your personal library statistics and earned badges.
        </p>
      </div>

      {/* Main Profile Showcase Card (Glassmorphism card exactly like Screen 5) */}
      <GlassCard id="profile-showcase-card" className="p-8 border-white/30 bg-white/15 dark:bg-black/10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="relative">
          <img
            id="profile-big-avatar"
            src={user.avatarUrl}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white/40 shadow-xl object-cover"
          />
          <button
            id="edit-avatar-overlay-btn"
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            className="absolute bottom-0 left-0 bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 text-white transition-all transform hover:scale-110"
            title="Profil şəklini dəyiş"
          >
            <Camera className="w-4 h-4" />
          </button>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-yellow-500 to-amber-500 p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
            <Trophy className="w-5 h-5 text-white" />
          </div>
        </div>

        {isEditingAvatar && (
          <div id="avatar-editor-panel" className="w-full max-w-md mt-6 p-4 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/20 space-y-4 animate-fade-in text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Profil şəklini yenilə</span>
              <button 
                onClick={() => setIsEditingAvatar(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Predefined Avatars Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-800 dark:text-slate-300 block">Hazır profillərdən seç:</span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateAvatar(url);
                      setSuccessAvatarMsg(true);
                      setTimeout(() => setSuccessAvatarMsg(false), 3000);
                    }}
                    className={`relative rounded-full overflow-hidden border-2 transition-all ${
                      user.avatarUrl === url ? 'border-blue-500 scale-105 shadow-md' : 'border-white/20 hover:border-white/55'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover aspect-square" />
                    {user.avatarUrl === url && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white font-bold" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload and URL Input Side-by-side or Stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* File Upload */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-850 dark:text-slate-200 block">Kompüterdən yüklə:</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          onUpdateAvatar(reader.result);
                          setSuccessAvatarMsg(true);
                          setTimeout(() => setSuccessAvatarMsg(false), 3000);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-600/20 rounded-xl text-xs font-bold transition-all"
                >
                  <Upload className="w-4 h-4" /> Şəkil Seç
                </button>
              </div>

              {/* URL input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (avatarUrlInput.trim()) {
                    onUpdateAvatar(avatarUrlInput.trim());
                    setAvatarUrlInput('');
                    setSuccessAvatarMsg(true);
                    setTimeout(() => setSuccessAvatarMsg(false), 3000);
                  }
                }}
                className="space-y-2"
              >
                <span className="text-xs font-bold text-gray-850 dark:text-slate-200 block">Şəkil URL-i yapışdır:</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    className="flex-1 bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    OK
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {successAvatarMsg && (
          <div className="text-xs font-bold text-green-600 dark:text-green-400 mt-3 flex items-center gap-1 justify-center animate-pulse">
            <Check className="w-4 h-4" /> Profil şəkli uğurla yeniləndi!
          </div>
        )}

        {!isEditing ? (
          <>
            <h2 id="profile-user-name" className="text-3xl font-bold text-gray-900 dark:text-white mt-6 tracking-tight flex items-center gap-2 justify-center">
              {user.name}
              <button
                id="edit-name-btn"
                onClick={handleStartEdit}
                className="p-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-gray-600 dark:text-slate-300 transition-colors"
                title="Ad və Soyadı dəyiş"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </h2>
            {successMsg && (
              <span id="name-update-success" className="text-xs font-bold text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 animate-pulse">
                <Check className="w-4 h-4" /> Ad və Soyad yeniləndi!
              </span>
            )}
          </>
        ) : (
          <form onSubmit={handleSave} className="w-full max-w-sm mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <label className="text-xs font-bold text-gray-850 dark:text-slate-200 block mb-1">Ad</label>
                <input
                  id="first-name-input"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-left">
                <label className="text-xs font-bold text-gray-850 dark:text-slate-200 block mb-1">Soyad</label>
                <input
                  id="last-name-input"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button
                id="cancel-edit-btn"
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white/10 dark:bg-white/5 hover:bg-white/20 border border-white/10 text-gray-800 dark:text-white font-semibold text-xs rounded-xl transition-all"
              >
                Ləğv et
              </button>
              <button
                id="save-edit-btn"
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Yadda saxla
              </button>
            </div>
          </form>
        )}

        <span id="profile-member-badge" className="inline-block bg-white/20 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-white/10 text-xs font-semibold px-4 py-1.5 rounded-full mt-3">
          Member since {user.memberSince}
        </span>

        {/* Action Toggle to Switch Roles (Librarian/Admin perspective vs Member perspective) */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-xs text-gray-800 dark:text-slate-200 font-bold uppercase tracking-wider">View Mode:</span>
          <div className="flex bg-gray-100 dark:bg-slate-800/80 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => onSetRole('member')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.role === 'member'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-800 dark:text-slate-200 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              Member View
            </button>
            <button
              onClick={() => onSetRole('admin')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                user.role === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-800 dark:text-slate-200 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              Admin View
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Grid: Reading Achievements & Interests */}
      <div id="profile-stats-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Achievements list */}
        <div id="achievements-column" className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> Reading Achievements
          </h2>
          <GlassCard id="achievements-card" className="p-6 border-white/20 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {user.achievements.map((item) => (
                <div
                  key={item.id}
                  id={`achievement-item-${item.id}`}
                  className="p-3 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/5 flex flex-col items-center hover:scale-105 transition-all"
                >
                  <span className="text-4xl filter drop-shadow-md mb-2">{item.icon}</span>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-800 dark:text-slate-200 mt-1 line-clamp-1 leading-snug font-semibold">
                    {item.description}
                  </p>
                </div>
              ))}

              {/* Locked Achievement Placeholders */}
              <div className="p-3 rounded-2xl bg-gray-200/5 dark:bg-black/5 border border-dashed border-gray-300 dark:border-white/5 flex flex-col items-center opacity-40">
                <span className="text-4xl mb-2 filter grayscale select-none">🔥</span>
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-slate-200">Streak Master</h4>
                <p className="text-[10px] text-gray-800 dark:text-slate-200 mt-1 font-semibold">Keep 30 days streak</p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-200/5 dark:bg-black/5 border border-dashed border-gray-300 dark:border-white/5 flex flex-col items-center opacity-40">
                <span className="text-4xl mb-2 filter grayscale select-none">👑</span>
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-slate-200">Elite Scholar</h4>
                <p className="text-[10px] text-gray-800 dark:text-slate-200 mt-1 font-semibold">Read 50+ books</p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-200/5 dark:bg-black/5 border border-dashed border-gray-300 dark:border-white/5 flex flex-col items-center opacity-40">
                <span className="text-4xl mb-2 filter grayscale select-none">🗺️</span>
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-slate-200">Globetrotter</h4>
                <p className="text-[10px] text-gray-800 dark:text-slate-200 mt-1 font-semibold">Explore 5+ categories</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Interests list */}
        <div id="interests-column" className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-500" /> Interests
          </h2>
          <GlassCard id="interests-card" className="p-6 border-white/20 min-h-[190px] flex flex-col justify-between">
            <div className="flex flex-wrap gap-2.5 items-start content-start">
              {user.interests.map((tag, i) => (
                <span
                  key={i}
                  id={`interest-tag-${i}`}
                  className="group px-3 py-1.5 bg-white/10 dark:bg-white/5 border border-white/15 hover:border-red-500/30 text-xs font-semibold text-gray-800 dark:text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(tag)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title={`${tag} marağını sil`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              {!showInput && (
                <button
                  id="add-interest-btn"
                  onClick={() => setShowInput(true)}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  + Add Interest
                </button>
              )}
            </div>

            {showInput && (
              <form onSubmit={handleAddInterest} className="flex items-center gap-2 w-full max-w-sm mt-4 pt-4 border-t border-white/10 animate-fade-in">
                <input
                  id="new-interest-input"
                  type="text"
                  required
                  placeholder="E.g. Science Fiction, Tech..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 bg-white/10 dark:bg-black/30 border border-white/15 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  id="save-interest-btn"
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center"
                  title="Yadda saxla"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  id="cancel-interest-btn"
                  type="button"
                  onClick={() => {
                    setShowInput(false);
                    setNewInterest('');
                  }}
                  className="p-2 bg-white/15 hover:bg-white/25 dark:bg-white/5 border border-white/15 text-gray-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Ləğv et"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
