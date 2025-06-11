import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Maximize2, 
  Minimize2,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Palette,
  Globe,
  Shield,
  Info
} from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onToggleConnection: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  sound: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  showConfidenceScores: boolean;
  showPlayerStats: boolean;
  compactMode: boolean;
  language: string;
  dataSource: 'live' | 'demo';
  privacyMode: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  isConnected,
  onToggleConnection,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    notifications: true,
    sound: true,
    autoRefresh: true,
    refreshInterval: 30,
    showConfidenceScores: true,
    showPlayerStats: true,
    compactMode: false,
    language: 'en',
    dataSource: 'demo',
    privacyMode: false
  });

  const [activeTab, setActiveTab] = useState<'general' | 'display' | 'data' | 'privacy'>('general');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('nba-callcheck-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('nba-callcheck-settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    const defaultSettings: AppSettings = {
      theme: 'dark',
      notifications: true,
      sound: true,
      autoRefresh: true,
      refreshInterval: 30,
      showConfidenceScores: true,
      showPlayerStats: true,
      compactMode: false,
      language: 'en',
      dataSource: 'demo',
      privacyMode: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('nba-callcheck-settings', JSON.stringify(defaultSettings));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nba-callcheck-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        localStorage.setItem('nba-callcheck-settings', JSON.stringify(importedSettings));
      } catch (error) {
        console.error('Failed to import settings:', error);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-[500px] max-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-slate-400" />
            <h2 className="text-white font-semibold">Settings</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? 
                <Minimize2 className="w-4 h-4 text-slate-400" /> : 
                <Maximize2 className="w-4 h-4 text-slate-400" />
              }
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center p-3 text-sm font-medium transition-colors ${
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
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Notifications</div>
                  <div className="text-slate-400 text-sm">Get notified about new calls and votes</div>
                </div>
                <button
                  onClick={() => updateSetting('notifications', !settings.notifications)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.notifications ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {settings.notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Sound Effects</div>
                  <div className="text-slate-400 text-sm">Play sounds for interactions</div>
                </div>
                <button
                  onClick={() => updateSetting('sound', !settings.sound)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.sound ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto Refresh</div>
                  <div className="text-slate-400 text-sm">Automatically refresh data</div>
                </div>
                <button
                  onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.autoRefresh ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {settings.autoRefresh && (
                <div>
                  <div className="text-white font-medium mb-2">Refresh Interval</div>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                  >
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              )}

              <div>
                <div className="text-white font-medium mb-2">Language</div>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-4">
              <div>
                <div className="text-white font-medium mb-2">Theme</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'auto', label: 'Auto', icon: Palette }
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updateSetting('theme', theme.value as any)}
                      className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                        settings.theme === theme.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <theme.icon className="w-4 h-4 mr-2" />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Show Confidence Scores</div>
                  <div className="text-slate-400 text-sm">Display AI confidence ratings</div>
                </div>
                <button
                  onClick={() => updateSetting('showConfidenceScores', !settings.showConfidenceScores)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.showConfidenceScores ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {settings.showConfidenceScores ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Show Player Statistics</div>
                  <div className="text-slate-400 text-sm">Display detailed player stats</div>
                </div>
                <button
                  onClick={() => updateSetting('showPlayerStats', !settings.showPlayerStats)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.showPlayerStats ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {settings.showPlayerStats ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Compact Mode</div>
                  <div className="text-slate-400 text-sm">Reduce spacing and padding</div>
                </div>
                <button
                  onClick={() => updateSetting('compactMode', !settings.compactMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.compactMode ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Live Data Connection</div>
                  <div className="text-slate-400 text-sm">Connect to Supabase for real-time data</div>
                </div>
                <button
                  onClick={onToggleConnection}
                  className={`p-2 rounded-lg transition-colors ${
                    isConnected ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <div className="text-white font-medium mb-2">Data Source</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'live', label: 'Live Data', icon: Wifi },
                    { value: 'demo', label: 'Demo Mode', icon: WifiOff }
                  ].map((source) => (
                    <button
                      key={source.value}
                      onClick={() => updateSetting('dataSource', source.value as any)}
                      className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                        settings.dataSource === source.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <source.icon className="w-4 h-4 mr-2" />
                      {source.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="text-white font-medium mb-3">Settings Management</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={exportSettings}
                    className="flex items-center justify-center p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                  <label className="flex items-center justify-center p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  onClick={resetSettings}
                  className="w-full mt-2 flex items-center justify-center p-3 rounded-lg bg-red-800 border border-red-600 text-red-300 hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Privacy Mode</div>
                  <div className="text-slate-400 text-sm">Hide personal voting history</div>
                </div>
                <button
                  onClick={() => updateSetting('privacyMode', !settings.privacyMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.privacyMode ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-2">Data Collection</div>
                    <div className="text-slate-400 text-sm space-y-2">
                      <p>• Voting data is stored anonymously using IP addresses</p>
                      <p>• No personal information is collected or stored</p>
                      <p>• Settings are stored locally in your browser</p>
                      <p>• Extension usage analytics are not collected</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-2">Open Source</div>
                    <div className="text-slate-400 text-sm">
                      This extension is open source. You can review the code and contribute on GitHub.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-500">
              NBA CallCheck v0.3.0
            </div>
            <div className="text-slate-500">
              Made with ❤️ by the community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;