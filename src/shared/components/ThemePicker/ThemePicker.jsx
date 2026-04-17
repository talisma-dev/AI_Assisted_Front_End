import React, { useState, useEffect, useRef } from 'react';
import './ThemePicker.css';

const ThemePicker = () => {
  const defaultColor = '#aa3bff';
  // Theme state
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accent-color') || defaultColor);
  const [tempAccent, setTempAccent] = useState(accentColor);

  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const getRGBA = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const updateStyles = (color) => {
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-bg', getRGBA(color, 0.15));
    document.documentElement.style.setProperty('--accent-border', getRGBA(color, 0.4));
  };

  useEffect(() => {
    updateStyles(accentColor);
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (isOpen) cancelPicker();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accentColor, isOpen]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('theme-picker-toggle', {
      detail: { isOpen }
    }));
  }, [isOpen]);

  const previewColor = (color) => {
    setTempAccent(color);
    updateStyles(color);
  };

  const applyChanges = () => {
    setAccentColor(tempAccent);
    localStorage.setItem('accent-color', tempAccent);

    window.dispatchEvent(new CustomEvent('theme-settings-changed', {
      detail: {
        accentColor: tempAccent
      }
    }));

    setIsOpen(false);
  };

  const resetToDefault = () => {
    previewColor(defaultColor);
    setTempAccent(defaultColor);
    setAccentColor(defaultColor);
    localStorage.setItem('accent-color', defaultColor);
    setIsOpen(false);
  };

  const cancelPicker = () => {
    updateStyles(accentColor);
    setTempAccent(accentColor);
    setIsOpen(false);
  };

  return (
    <div className="theme-picker-container" ref={pickerRef}>
      <button
        className={`theme-icon-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme Settings"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="dropdown-header">
            <h4>Settings</h4>
          </div>

          <div className="dropdown-body">
            <div className="section-label">Brand Color</div>
            <div className="preset-grid">
              {['#aa3bff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#1f2937'].map(color => (
                <button
                  key={color}
                  className={`preset-swatch ${tempAccent === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => previewColor(color)}
                />
              ))}
            </div>

            <div className="color-row">
              <div className="color-picker-wrapper" style={{ backgroundColor: tempAccent }}>
                <input type="color" value={tempAccent} onChange={(e) => previewColor(e.target.value)} />
              </div>
              <span className="color-label">Custom Accent</span>
            </div>

          </div>

          <div className="dropdown-footer">
            <button className="reset-link" onClick={resetToDefault}>Restore Defaults</button>
            <div className="footer-actions">
              <button className="btn-cancel" onClick={cancelPicker}>Cancel</button>
              <button className="btn-apply" onClick={applyChanges}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
