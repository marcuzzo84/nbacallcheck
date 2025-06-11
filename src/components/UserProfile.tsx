import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  TrendingUp, 
  Award, 
  Settings, 
  LogOut,
  Edit3,
  Save,
  X,
  Shield,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscription: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, onOpenSubscription }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profile?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await updateProfile({
        username: editedUsername
      });

      if (error) {
        setError(error.message);
      } else {
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return Crown;
      case 'premium': return Star;
      default: return Shield;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'text-blue-400';
      case 'premium': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-blue-900 border-blue-600 text-blue-300';
      case 'premium': return 'bg-yellow-900 border-yellow-600 text-yellow-300';
      default: return 'bg-slate-800 border-slate-600 text-slate-300';
    }
  };

  if (!isOpen || !user || !profile) return null;

  const TierIcon = getTierIcon(profile.subscription_tier);
  const accuracyScore = profile.accuracy_score || 0;
  const totalVotes = profile.total_votes || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Basic Info */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg text-sm transition-colors"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUsername(profile.username || '');
                      setError(null);
                    }}
                    className="flex items-center px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-xl font-bold text-white mr-2">
                    {profile.username || user.email?.split('@')[0]}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
            )}

            {error && (
              <div className="mt-3 p-2 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Subscription Tier */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getTierBadgeColor(profile.subscription_tier)}`}>
              <TierIcon className={`w-5 h-5 mr-2 ${getTierColor(profile.subscription_tier)}`} />
              <span className="font-medium capitalize">{profile.subscription_tier}</span>
            </div>
            {profile.subscription_tier === 'free' && (
              <button
                onClick={onOpenSubscription}
                className="block mx-auto mt-2 text-blue-400 hover:text-blue-300 text-sm"
              >
                Upgrade to unlock more features
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalVotes}</div>
              <div className="text-slate-400 text-sm">Total Votes</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{accuracyScore}%</div>
              <div className="text-slate-400 text-sm">Accuracy</div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-slate-800 rounded-lg">
              <Mail className="w-5 h-5 text-slate-400 mr-3" />
              <div>
                <div className="text-white text-sm font-medium">Email</div>
                <div className="text-slate-400 text-sm">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-800 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-400 mr-3" />
              <div>
                <div className="text-white text-sm font-medium">Member Since</div>
                <div className="text-slate-400 text-sm">
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {profile.subscription_expires_at && (
              <div className="flex items-center p-3 bg-slate-800 rounded-lg">
                <Crown className="w-5 h-5 text-slate-400 mr-3" />
                <div>
                  <div className="text-white text-sm font-medium">Subscription Expires</div>
                  <div className="text-slate-400 text-sm">
                    {new Date(profile.subscription_expires_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {profile.subscription_tier !== 'free' && (
              <button
                onClick={onOpenSubscription}
                className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 mr-2" />
                Manage Subscription
              </button>
            )}
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;