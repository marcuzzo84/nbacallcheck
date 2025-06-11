import React, { useState } from 'react';
import { X, Crown, Star, Zap, Check, CreditCard, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<'pro' | 'premium'>('pro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { profile, upgradeSubscription, hasFeatureAccess } = useAuth();

  const plans = {
    free: {
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Shield,
      color: 'text-slate-400',
      bgColor: 'bg-slate-800',
      borderColor: 'border-slate-600',
      features: [
        'Basic call analysis',
        'Community voting',
        'Limited daily votes (10)',
        'Standard statistics',
        'Basic themes'
      ]
    },
    pro: {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      icon: Crown,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900',
      borderColor: 'border-blue-600',
      features: [
        'Everything in Free',
        'Unlimited voting',
        'Advanced analytics',
        'Export voting data',
        'Custom themes',
        'Priority support',
        'Historical data access'
      ]
    },
    premium: {
      name: 'Premium',
      price: '$19.99',
      period: 'per month',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900',
      borderColor: 'border-yellow-600',
      features: [
        'Everything in Pro',
        'AI-powered insights',
        'Referee performance tracking',
        'Advanced statistics dashboard',
        'Real-time notifications',
        'API access',
        'White-label options',
        'Dedicated support'
      ]
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await upgradeSubscription(selectedTier);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentTier = profile?.subscription_tier || 'free';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-slate-400 mt-1">Unlock advanced features and support the community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {success && (
          <div className="p-4 bg-green-900 border-b border-green-700">
            <div className="flex items-center text-green-300">
              <Check className="w-5 h-5 mr-2" />
              <span>Successfully upgraded! Welcome to {selectedTier === 'pro' ? 'Pro' : 'Premium'}!</span>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([tier, plan]) => {
              const Icon = plan.icon;
              const isCurrentTier = currentTier === tier;
              const isUpgrade = tier !== 'free' && (
                (currentTier === 'free') ||
                (currentTier === 'pro' && tier === 'premium')
              );

              return (
                <div
                  key={tier}
                  className={`relative rounded-lg border-2 p-6 transition-all ${
                    selectedTier === tier && tier !== 'free'
                      ? `${plan.borderColor} ${plan.bgColor} bg-opacity-20`
                      : isCurrentTier
                      ? 'border-green-600 bg-green-900 bg-opacity-20'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                >
                  {/* Popular Badge */}
                  {tier === 'pro' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentTier && (
                    <div className="absolute -top-3 right-4">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${plan.color}`} />
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                    <div className="text-slate-400 text-sm">{plan.period}</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier !== 'free' && (
                    <button
                      onClick={() => setSelectedTier(tier as 'pro' | 'premium')}
                      disabled={isCurrentTier || loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        selectedTier === tier
                          ? `${plan.bgColor} ${plan.color} border ${plan.borderColor}`
                          : isCurrentTier
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {isCurrentTier ? 'Current Plan' : isUpgrade ? 'Select Plan' : 'Downgrade'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upgrade Button */}
          {selectedTier && currentTier !== selectedTier && (
            <div className="mt-8 text-center">
              {error && (
                <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Upgrade to {plans[selectedTier].name} - {plans[selectedTier].price}/month
                  </>
                )}
              </button>

              <p className="text-slate-400 text-sm mt-3">
                Secure payment processing • Cancel anytime • 30-day money-back guarantee
              </p>
            </div>
          )}

          {/* Features Comparison */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Why Upgrade?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Advanced Analytics</h4>
                <p className="text-slate-400 text-sm">
                  Get detailed insights into referee performance, voting trends, and historical data.
                </p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Unlimited Access</h4>
                <p className="text-slate-400 text-sm">
                  Vote on unlimited calls, access all features, and export your data.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Priority Support</h4>
                <p className="text-slate-400 text-sm">
                  Get priority customer support and early access to new features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;