// NBA CallCheck Background Service Worker
// Handles extension lifecycle and background tasks

// Extension installation and update handling
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First time installation
    console.log('NBA CallCheck installed successfully');
    
    // Set default settings
    chrome.storage.local.set({
      'nba-callcheck-settings': {
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
      },
      'nba-callcheck-version': '1.0.0',
      'nba-callcheck-install-date': new Date().toISOString()
    });

    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'https://nbacallcheck.com/welcome' });
    
  } else if (details.reason === 'update') {
    // Extension updated
    console.log(`NBA CallCheck updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`);
    
    // Handle any migration logic here
    handleVersionUpdate(details.previousVersion);
  }
});

// Handle version updates and migrations
async function handleVersionUpdate(previousVersion) {
  try {
    // Get current settings
    const result = await chrome.storage.local.get(['nba-callcheck-settings']);
    const currentSettings = result['nba-callcheck-settings'] || {};
    
    // Add any new default settings that might be missing
    const defaultSettings = {
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
    
    // Merge with defaults for any missing settings
    const updatedSettings = { ...defaultSettings, ...currentSettings };
    
    // Save updated settings
    await chrome.storage.local.set({
      'nba-callcheck-settings': updatedSettings,
      'nba-callcheck-version': chrome.runtime.getManifest().version,
      'nba-callcheck-last-update': new Date().toISOString()
    });
    
    console.log('Settings migrated successfully');
  } catch (error) {
    console.error('Error during version update:', error);
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically due to default_popup in manifest
  // But we can add additional logic here if needed
  console.log('NBA CallCheck icon clicked');
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVersion') {
    sendResponse({ version: chrome.runtime.getManifest().version });
  } else if (request.action === 'openFullscreen') {
    // Open fullscreen view in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html?fullscreen=true')
    });
  } else if (request.action === 'trackEvent') {
    // Handle analytics events (if implemented)
    console.log('Event tracked:', request.event, request.data);
  }
  
  return true; // Keep message channel open for async responses
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === 'nba-callcheck-settings') {
        console.log('Settings updated:', newValue);
        
        // Handle specific setting changes
        if (oldValue?.notifications !== newValue?.notifications) {
          console.log('Notifications setting changed:', newValue.notifications);
        }
        
        if (oldValue?.dataSource !== newValue?.dataSource) {
          console.log('Data source changed:', newValue.dataSource);
        }
      }
    }
  }
});

// Periodic cleanup and maintenance
chrome.alarms.create('maintenance', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'maintenance') {
    performMaintenance();
  }
});

async function performMaintenance() {
  try {
    // Clean up old cached data
    const result = await chrome.storage.local.get();
    const keysToRemove = [];
    
    for (const [key, value] of Object.entries(result)) {
      // Remove old cache entries (older than 24 hours)
      if (key.startsWith('nba-callcheck-cache-')) {
        const timestamp = value.timestamp;
        if (timestamp && Date.now() - timestamp > 24 * 60 * 60 * 1000) {
          keysToRemove.push(key);
        }
      }
    }
    
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
      console.log(`Cleaned up ${keysToRemove.length} old cache entries`);
    }
  } catch (error) {
    console.error('Error during maintenance:', error);
  }
}

// Handle extension uninstall (for cleanup)
chrome.runtime.setUninstallURL('https://nbacallcheck.com/uninstall-feedback');

// Error handling
self.addEventListener('error', (event) => {
  console.error('Background script error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('NBA CallCheck background service worker loaded');