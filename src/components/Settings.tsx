import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import config from '../config';
import logger from '../lib/utils/logger';

interface Settings {
  theme: string;
  ollamaEndpoint: string;
  openaiKey: string;
  anthropicKey: string;
  perplexityKey: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  searchEngines: string[];
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: config.ui.theme,
    ollamaEndpoint: config.agent.ollamaUrl,
    openaiKey: config.api.openai || '',
    anthropicKey: config.api.anthropic || '',
    perplexityKey: config.api.perplexity || '',
    maxFileSize: config.storage.maxFileSize,
    allowedFileTypes: config.storage.allowedFileTypes,
    searchEngines: config.search.engines,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      localStorage.setItem('dexterSettings', JSON.stringify(settings));
      
      // Update environment variables
      Object.entries(settings).forEach(([key, value]) => {
        if (key.endsWith('Key')) {
          const envKey = `VITE_${key.toUpperCase()}`;
          import.meta.env[envKey] = value;
        }
      });

      setSaveMessage('Settings saved successfully!');
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
    } catch (error) {
      logger.error('Error saving settings:', error);
      setSaveMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      theme: config.ui.theme,
      ollamaEndpoint: config.agent.ollamaUrl,
      openaiKey: '',
      anthropicKey: '',
      perplexityKey: '',
      maxFileSize: config.storage.maxFileSize,
      allowedFileTypes: config.storage.allowedFileTypes,
      searchEngines: config.search.engines,
    });
    setSaveMessage('Settings reset to defaults');
  };

  return (
    <div className="space-y-6 theme-cyberpunk">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold glitch">Settings</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleReset}
            className="button flex items-center px-4 py-2"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="button flex items-center px-4 py-2"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`card p-4 ${
          saveMessage.includes('Error') ? 'border-neon-pink' : 'border-neon-blue'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 typing">UI Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="input mt-1 block w-full"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cyberpunk">Cyberpunk</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 typing">API Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Ollama Endpoint</label>
              <input
                type="text"
                value={settings.ollamaEndpoint}
                onChange={(e) => setSettings({ ...settings, ollamaEndpoint: e.target.value })}
                className="input mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">OpenAI API Key</label>
              <input
                type="password"
                value={settings.openaiKey}
                onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                className="input mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Anthropic API Key</label>
              <input
                type="password"
                value={settings.anthropicKey}
                onChange={(e) => setSettings({ ...settings, anthropicKey: e.target.value })}
                className="input mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Perplexity API Key</label>
              <input
                type="password"
                value={settings.perplexityKey}
                onChange={(e) => setSettings({ ...settings, perplexityKey: e.target.value })}
                className="input mt-1 block w-full"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 typing">File Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Max File Size (bytes)</label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })}
                className="input mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Allowed File Types</label>
              <input
                type="text"
                value={settings.allowedFileTypes.join(',')}
                onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value.split(',') })}
                className="input mt-1 block w-full"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 typing">Search Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Search Engines</label>
              <input
                type="text"
                value={settings.searchEngines.join(',')}
                onChange={(e) => setSettings({ ...settings, searchEngines: e.target.value.split(',') })}
                className="input mt-1 block w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="scanline" />
    </div>
  );
};

export default Settings;