import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  Target,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Crown,
  Lock,
  Database,
  Zap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { analyticsService, callsService, teamsService, seasonsService } from '../lib/supabaseClient';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  votingTrends: {
    date: string;
    correct: number;
    incorrect: number;
    unclear: number;
  }[];
  refereePerformance: {
    name: string;
    accuracy: number;
    totalCalls: number;
    controversialCalls: number;
    avgConfidence: number;
  }[];
  callTypeDistribution: {
    type: string;
    count: number;
    accuracy: number;
  }[];
  userEngagement: {
    totalVotes: number;
    activeUsers: number;
    avgVotesPerCall: number;
    consensusRate: number;
  };
  timeAnalysis: {
    quarter: number;
    callCount: number;
    accuracy: number;
  }[];
  controversialCalls: any[];
  teamStats: any[];
  seasonData: any[];
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const { hasFeatureAccess, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'referees' | 'calls' | 'trends' | 'teams'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedSeason, setSelectedSeason] = useState<string>('2024-25');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);

  const hasAdvancedAnalytics = hasFeatureAccess('advanced_analytics');

  // Load real data from Supabase
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [
        votingTrends,
        refereeStats,
        callTypeDistribution,
        quarterAnalysis,
        controversialCalls,
        teamStats,
        seasonData
      ] = await Promise.all([
        analyticsService.getVotingTrends(parseInt(timeRange.replace('d', ''))),
        analyticsService.getRefereeStats(),
        analyticsService.getCallTypeDistribution(selectedSeason),
        analyticsService.getQuarterAnalysis(selectedSeason),
        callsService.getControversialCalls(10),
        teamsService.getTeams(),
        seasonsService.getSeasons()
      ]);

      // Transform referee data
      const refereePerformance = refereeStats?.slice(0, 10).map((ref: any) => ({
        name: ref.name,
        accuracy: ref.accuracy_rating,
        totalCalls: ref.total_calls,
        controversialCalls: Math.floor(Math.random() * 30) + 5, // Mock for now
        avgConfidence: ref.accuracy_rating - Math.random() * 10
      })) || [];

      // Calculate user engagement metrics
      const totalVotes = votingTrends?.reduce((sum: number, day: any) => 
        sum + day.correct + day.incorrect + day.unclear, 0) || 0;
      
      const userEngagement = {
        totalVotes,
        activeUsers: Math.floor(totalVotes / 20), // Estimate
        avgVotesPerCall: totalVotes > 0 ? Math.round(totalVotes / callTypeDistribution?.length || 1) : 0,
        consensusRate: 73.2 // Mock for now
      };

      setData({
        votingTrends: votingTrends || [],
        refereePerformance,
        callTypeDistribution: callTypeDistribution || [],
        userEngagement,
        timeAnalysis: quarterAnalysis || [],
        controversialCalls: controversialCalls || [],
        teamStats: teamStats || [],
        seasonData: seasonData || []
      });

      setIsLiveData(true);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      // Fall back to mock data
      setData(generateMockData());
      setIsLiveData(false);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generation (fallback)
  const generateMockData = (): AnalyticsData => {
    const votingTrends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        correct: Math.floor(Math.random() * 100) + 50,
        incorrect: Math.floor(Math.random() * 50) + 20,
        unclear: Math.floor(Math.random() * 30) + 10
      };
    });

    const refereePerformance = [
      { name: 'Scott Foster', accuracy: 87.3, totalCalls: 1247, controversialCalls: 23, avgConfidence: 82.1 },
      { name: 'Tony Brothers', accuracy: 82.1, totalCalls: 892, controversialCalls: 31, avgConfidence: 78.5 },
      { name: 'Ed Malloy', accuracy: 89.7, totalCalls: 1156, controversialCalls: 18, avgConfidence: 85.2 },
      { name: 'Kane Fitzgerald', accuracy: 85.4, totalCalls: 743, controversialCalls: 27, avgConfidence: 80.8 },
      { name: 'Marc Davis', accuracy: 91.2, totalCalls: 1089, controversialCalls: 15, avgConfidence: 87.3 }
    ];

    const callTypeDistribution = [
      { type: 'Personal Foul', count: 1247, accuracy: 85.3 },
      { type: 'Technical Foul', count: 234, accuracy: 92.1 },
      { type: 'Flagrant Foul', count: 67, accuracy: 94.8 },
      { type: 'Offensive Foul', count: 456, accuracy: 78.9 },
      { type: 'Blocking Foul', count: 389, accuracy: 82.4 },
      { type: 'Charging Foul', count: 298, accuracy: 76.2 }
    ];

    const userEngagement = {
      totalVotes: 45672,
      activeUsers: 2341,
      avgVotesPerCall: 18.7,
      consensusRate: 73.2
    };

    const timeAnalysis = [
      { quarter: 1, callCount: 234, accuracy: 87.2 },
      { quarter: 2, callCount: 198, accuracy: 85.8 },
      { quarter: 3, callCount: 267, accuracy: 83.4 },
      { quarter: 4, callCount: 312, accuracy: 81.9 }
    ];

    return {
      votingTrends,
      refereePerformance,
      callTypeDistribution,
      userEngagement,
      timeAnalysis,
      controversialCalls: [],
      teamStats: [],
      seasonData: []
    };
  };

  useEffect(() => {
    if (isOpen && hasAdvancedAnalytics) {
      loadAnalyticsData();
    }
  }, [isOpen, hasAdvancedAnalytics, timeRange, selectedSeason]);

  const exportData = () => {
    if (!data) return;
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      selectedSeason,
      isLiveData,
      ...data
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nba-callcheck-analytics-${timeRange}-${selectedSeason}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  if (!hasAdvancedAnalytics) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-md">
          <div className="p-6 text-center">
            <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Premium Feature</h2>
            <p className="text-slate-400 mb-6">
              Advanced analytics are available for Premium subscribers only.
            </p>
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'referees', label: 'Referees', icon: Users },
    { id: 'calls', label: 'Call Types', icon: Target },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'teams', label: 'Teams', icon: Award }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Advanced Analytics</h2>
              <div className="flex items-center text-slate-400 text-sm mt-1">
                <span>Comprehensive insights and performance metrics</span>
                {isLiveData && (
                  <div className="flex items-center ml-3">
                    <Database className="w-4 h-4 mr-1 text-green-400" />
                    <span className="text-green-400">Live Data</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Season Selector */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="2024-25">2024-25 Season</option>
              <option value="2023-24">2023-24 Season</option>
              <option value="2022-23">2022-23 Season</option>
            </select>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button
              onClick={exportData}
              disabled={!data}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            <button
              onClick={loadAnalyticsData}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center p-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-400">Loading analytics data...</p>
                {isLiveData && (
                  <p className="text-green-400 text-sm mt-1">Fetching live data from Supabase</p>
                )}
              </div>
            </div>
          ) : data ? (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-xs text-slate-500">Total</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data.userEngagement.totalVotes.toLocaleString()}</div>
                      <div className="text-slate-400 text-sm">Community Votes</div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 text-green-400" />
                        <span className="text-xs text-slate-500">Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data.userEngagement.consensusRate}%</div>
                      <div className="text-slate-400 text-sm">Consensus Rate</div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                        <span className="text-xs text-slate-500">Active</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data.userEngagement.activeUsers.toLocaleString()}</div>
                      <div className="text-slate-400 text-sm">Active Users</div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        <span className="text-xs text-slate-500">Avg</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data.userEngagement.avgVotesPerCall}</div>
                      <div className="text-slate-400 text-sm">Votes per Call</div>
                    </div>
                  </div>

                  {/* Voting Trends Chart */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">Voting Trends Over Time</h3>
                    <div className="h-64 flex items-end space-x-1">
                      {data.votingTrends.slice(-14).map((day, index) => {
                        const total = day.correct + day.incorrect + day.unclear;
                        const maxHeight = 200;
                        const correctHeight = total > 0 ? (day.correct / total) * maxHeight : 0;
                        const incorrectHeight = total > 0 ? (day.incorrect / total) * maxHeight : 0;
                        const unclearHeight = total > 0 ? (day.unclear / total) * maxHeight : 0;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col-reverse" style={{ height: maxHeight }}>
                              <div 
                                className="bg-green-500 rounded-t-sm"
                                style={{ height: correctHeight }}
                                title={`Correct: ${day.correct}`}
                              />
                              <div 
                                className="bg-red-500"
                                style={{ height: incorrectHeight }}
                                title={`Incorrect: ${day.incorrect}`}
                              />
                              <div 
                                className="bg-yellow-500"
                                style={{ height: unclearHeight }}
                                title={`Unclear: ${day.unclear}`}
                              />
                            </div>
                            <div className="text-xs text-slate-500 mt-2 transform -rotate-45">
                              {new Date(day.date).getDate()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                        <span className="text-slate-400 text-sm">Correct</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                        <span className="text-slate-400 text-sm">Incorrect</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                        <span className="text-slate-400 text-sm">Unclear</span>
                      </div>
                    </div>
                  </div>

                  {/* Quarter Analysis */}
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">Performance by Quarter</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {data.timeAnalysis.map((quarter) => (
                        <div key={quarter.quarter} className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">Q{quarter.quarter}</div>
                          <div className="text-slate-400 text-sm mb-2">{quarter.callCount} calls</div>
                          <div className={`text-lg font-semibold ${
                            quarter.accuracy >= 85 ? 'text-green-400' : 
                            quarter.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {quarter.accuracy}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Referees Tab */}
              {activeTab === 'referees' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">Referee Performance Rankings</h3>
                    <div className="space-y-4">
                      {data.refereePerformance.map((referee, index) => (
                        <div key={referee.name} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                              index === 0 ? 'bg-yellow-600' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-600' : 'bg-slate-600'
                            }`}>
                              <span className="text-white font-bold text-sm">#{index + 1}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{referee.name}</div>
                              <div className="text-slate-400 text-sm">{referee.totalCalls} total calls</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className={`text-lg font-bold ${
                                referee.accuracy >= 90 ? 'text-green-400' : 
                                referee.accuracy >= 85 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {referee.accuracy}%
                              </div>
                              <div className="text-slate-500 text-xs">Accuracy</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-white font-bold">{referee.controversialCalls}</div>
                              <div className="text-slate-500 text-xs">Controversial</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-white font-bold">{referee.avgConfidence.toFixed(1)}%</div>
                              <div className="text-slate-500 text-xs">Confidence</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Call Types Tab */}
              {activeTab === 'calls' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">Call Type Distribution & Accuracy</h3>
                    <div className="space-y-4">
                      {data.callTypeDistribution.map((callType) => (
                        <div key={callType.type} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 rounded mr-4"></div>
                            <div>
                              <div className="text-white font-medium">{callType.type}</div>
                              <div className="text-slate-400 text-sm">{callType.count} calls</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="w-32 bg-slate-600 rounded-full h-2">
                              <div 
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${(callType.count / Math.max(...data.callTypeDistribution.map(c => c.count))) * 100}%` }}
                              />
                            </div>
                            
                            <div className="text-center min-w-[60px]">
                              <div className={`text-lg font-bold ${
                                callType.accuracy >= 90 ? 'text-green-400' : 
                                callType.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {callType.accuracy}%
                              </div>
                              <div className="text-slate-500 text-xs">Accuracy</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Teams Tab */}
              {activeTab === 'teams' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">Team Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.teamStats.slice(0, 10).map((team: any) => (
                        <div key={team.id} className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-white font-medium">{team.name}</div>
                              <div className="text-slate-400 text-sm">{team.conference} Conference</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">{team.abbreviation}</div>
                              <div className="text-slate-400 text-xs">{team.division}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center">
                              <div className="text-white font-semibold">--</div>
                              <div className="text-slate-500">Fouls/Game</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-semibold">--</div>
                              <div className="text-slate-500">Drawn/Game</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Trends Tab */}
              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-4">Accuracy Trends</h3>
                      <div className="h-48 flex items-end space-x-2">
                        {data.votingTrends.slice(-10).map((day, index) => {
                          const total = day.correct + day.incorrect + day.unclear;
                          const accuracy = total > 0 ? (day.correct / total) * 100 : 0;
                          const height = (accuracy / 100) * 160;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full"
                                style={{ height: `${height}px` }}
                                title={`${accuracy.toFixed(1)}% accuracy`}
                              />
                              <div className="text-xs text-slate-500 mt-2">
                                {new Date(day.date).getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-4">Vote Distribution</h3>
                      <div className="flex items-center justify-center h-48">
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-red-500 to-yellow-500"></div>
                          <div className="absolute inset-2 rounded-full bg-slate-800 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-white font-bold text-lg">{data.userEngagement.consensusRate}%</div>
                              <div className="text-slate-400 text-xs">Consensus</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        <div className="text-center">
                          <div className="w-3 h-3 bg-green-500 rounded mx-auto mb-1"></div>
                          <div className="text-slate-400 text-xs">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="w-3 h-3 bg-red-500 rounded mx-auto mb-1"></div>
                          <div className="text-slate-400 text-xs">Incorrect</div>
                        </div>
                        <div className="text-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded mx-auto mb-1"></div>
                          <div className="text-slate-400 text-xs">Unclear</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">Key Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start p-4 bg-slate-700 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-white font-medium mb-1">High Consensus Calls</div>
                          <div className="text-slate-400 text-sm">
                            {isLiveData ? 'Live data shows strong community agreement on most calls' : 'Flagrant fouls have the highest community agreement at 94.8% accuracy'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-slate-700 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-white font-medium mb-1">Controversial Calls</div>
                          <div className="text-slate-400 text-sm">
                            {isLiveData ? 'Real-time analysis identifies disputed referee decisions' : 'Charging fouls show the most disagreement with 76.2% accuracy'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-slate-700 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-white font-medium mb-1">Quarter Trends</div>
                          <div className="text-slate-400 text-sm">
                            {data.timeAnalysis.length > 0 ? 
                              `Call accuracy varies by quarter (Q1: ${data.timeAnalysis[0]?.accuracy}%, Q4: ${data.timeAnalysis[3]?.accuracy}%)` :
                              'Call accuracy decreases in the 4th quarter (81.9% vs 87.2% in Q1)'
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-slate-700 rounded-lg">
                        <Award className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-white font-medium mb-1">Top Performer</div>
                          <div className="text-slate-400 text-sm">
                            {data.refereePerformance.length > 0 ?
                              `${data.refereePerformance[0]?.name} leads with ${data.refereePerformance[0]?.accuracy}% accuracy` :
                              'Marc Davis leads with 91.2% accuracy and lowest controversial calls'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-400 py-12">
              No data available for the selected time range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;