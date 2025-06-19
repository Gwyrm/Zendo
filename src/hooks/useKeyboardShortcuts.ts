import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNewCard?: () => void;
  onNewList?: () => void;
  onSearch?: () => void;
  onToggleDarkMode?: () => void;
  onArchiveCard?: () => void;
  onBulkSelect?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isModifierPressed = ctrlKey || metaKey;

      switch (true) {
        case isModifierPressed && key === 'n':
          event.preventDefault();
          shortcuts.onNewCard?.();
          break;
        case isModifierPressed && shiftKey && key === 'L':
          event.preventDefault();
          shortcuts.onNewList?.();
          break;
        case isModifierPressed && key === 'k':
          event.preventDefault();
          shortcuts.onSearch?.();
          break;
        case isModifierPressed && key === 'd':
          event.preventDefault();
          shortcuts.onToggleDarkMode?.();
          break;
        case key === 'a' && shiftKey:
          event.preventDefault();
          shortcuts.onBulkSelect?.();
          break;
        case key === 'Escape':
          // Handle escape key for closing modals, etc.
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};