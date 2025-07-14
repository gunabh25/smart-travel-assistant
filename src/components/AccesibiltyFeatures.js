/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility,
  X
} from 'lucide-react';

const AccessibilityFeatures = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 16,
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    voiceCommands: false,
    colorBlindMode: 'none',
    cursorSize: 'normal',
    focusIndicator: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const applyAccessibilitySettings = useCallback((settings) => {
    const root = document.documentElement;

    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);

    if (settings.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    root.className = root.className.replace(/colorblind-\w+/g, '');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${settings.colorBlindMode}`);
    }

    root.classList.remove('cursor-large', 'cursor-xl');
    if (settings.cursorSize === 'large') {
      root.classList.add('cursor-large');
    } else if (settings.cursorSize === 'xl') {
      root.classList.add('cursor-xl');
    }

    if (settings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!settings.keyboardNavigation) return;

      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }

      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [settings.keyboardNavigation, isOpen]);

  const announce = useCallback((message) => {
    if (settings.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [settings.screenReader]);

  useEffect(() => {
    if (!settings.voiceCommands || !('webkitSpeechRecognition' in window)) return;

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (command.includes('open accessibility')) {
        setIsOpen(true);
        announce('Accessibility panel opened');
      } else if (command.includes('close accessibility')) {
        setIsOpen(false);
        announce('Accessibility panel closed');
      } else if (command.includes('increase font size')) {
        setSettings(prev => ({
          ...prev,
          fontSize: Math.min(prev.fontSize + 2, 24)
        }));
        announce('Font size increased');
      } else if (command.includes('decrease font size')) {
        setSettings(prev => ({
          ...prev,
          fontSize: Math.max(prev.fontSize - 2, 12)
        }));
        announce('Font size decreased');
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [settings.voiceCommands, announce]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    announce(`${key} updated to ${value}`);
  };

  const AccessibilityToggle = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(!isOpen)}
      className="fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Open accessibility settings"
      title="Accessibility Settings (Alt+A)"
    >
      <Accessibility className="w-5 h-5" />
    </motion.button>
  );

  const SettingSlider = ({ label, value, min, max, step, onChange, unit = '' }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm text-gray-500 dark:text-gray-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
        aria-label={`${label}: ${value}${unit}`}
      />
    </div>
  );

  const SettingSelect = ({ label, value, options, onChange }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        aria-label={label}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const SettingToggle = ({ label, value, onChange, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        aria-label={`${label}: ${value ? 'enabled' : 'disabled'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <AccessibilityToggle />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Accessibility className="w-6 h-6 mr-2" />
                  Accessibility
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close accessibility settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <SettingSlider
                  label="Font Size"
                  value={settings.fontSize}
                  min={12}
                  max={24}
                  step={1}
                  unit="px"
                  onChange={(value) => updateSetting('fontSize', value)}
                />

                <SettingSelect
                  label="Contrast"
                  value={settings.contrast}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High Contrast' }
                  ]}
                  onChange={(value) => updateSetting('contrast', value)}
                />

                <SettingSelect
                  label="Color Blind Support"
                  value={settings.colorBlindMode}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'deuteranopia', label: 'Deuteranopia' },
                    { value: 'protanopia', label: 'Protanopia' },
                    { value: 'tritanopia', label: 'Tritanopia' }
                  ]}
                  onChange={(value) => updateSetting('colorBlindMode', value)}
                />

                <SettingSelect
                  label="Cursor Size"
                  value={settings.cursorSize}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'large', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' }
                  ]}
                  onChange={(value) => updateSetting('cursorSize', value)}
                />

                <div className="space-y-4">
                  <SettingToggle
                    label="Keyboard Navigation"
                    value={settings.keyboardNavigation}
                    onChange={(value) => updateSetting('keyboardNavigation', value)}
                    description="Enhanced keyboard navigation support"
                  />
                  <SettingToggle
                    label="Voice Commands"
                    value={settings.voiceCommands}
                    onChange={(value) => updateSetting('voiceCommands', value)}
                    description="Enable voice control (Chrome only)"
                  />
                  <SettingToggle
                    label="Focus Indicator"
                    value={settings.focusIndicator}
                    onChange={(value) => updateSetting('focusIndicator', value)}
                    description="Enhanced focus indicators for navigation"
                  />
                  <SettingToggle
                    label="Reduced Motion"
                    value={settings.reducedMotion}
                    onChange={(value) => updateSetting('reducedMotion', value)}
                    description="Reduces animations and transitions"
                  />
                  <SettingToggle
                    label="Screen Reader Support"
                    value={settings.screenReader}
                    onChange={(value) => updateSetting('screenReader', value)}
                    description="Enables screen reader announcements"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Keyboard Shortcuts
                  </h3>
                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Open accessibility panel:</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Alt + A</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Close panel:</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Escape</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Navigate elements:</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Tab</kbd>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSettings({
                      fontSize: 16,
                      contrast: 'normal',
                      reducedMotion: false,
                      screenReader: false,
                      keyboardNavigation: true,
                      voiceCommands: false,
                      colorBlindMode: 'none',
                      cursorSize: 'normal',
                      focusIndicator: true
                    });
                    announce('Accessibility settings reset to default');
                  }}
                  className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityFeatures;
