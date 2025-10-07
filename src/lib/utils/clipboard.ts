import { PASSWORD_CONFIG } from '@/config/constants';

let clearTimeoutId: NodeJS.Timeout | null = null;

/**
 * Copy text to clipboard with auto-clear functionality
 */
export async function copyToClipboard(
  text: string,
  autoClearMs: number = PASSWORD_CONFIG.autoClipboardClearTime
): Promise<{ success: boolean; error?: string }> {
  try {
    // Clear any existing timeout
    if (clearTimeoutId) {
      clearTimeout(clearTimeoutId);
      clearTimeoutId = null;
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(text);

    // Set auto-clear timeout
    if (autoClearMs > 0) {
      clearTimeoutId = setTimeout(async () => {
        try {
          // Clear clipboard by writing empty string
          await navigator.clipboard.writeText('');
          clearTimeoutId = null;
        } catch (error) {
          console.error('Failed to clear clipboard:', error);
        }
      }, autoClearMs);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Clipboard copy failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to copy to clipboard',
    };
  }
}

/**
 * Manually clear clipboard
 */
export async function clearClipboard(): Promise<void> {
  try {
    if (clearTimeoutId) {
      clearTimeout(clearTimeoutId);
      clearTimeoutId = null;
    }
    await navigator.clipboard.writeText('');
  } catch (error) {
    console.error('Failed to clear clipboard:', error);
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

/**
 * Get remaining time before clipboard auto-clears (in seconds)
 */
export function getClipboardClearTime(): number {
  return PASSWORD_CONFIG.autoClipboardClearTime / 1000;
}