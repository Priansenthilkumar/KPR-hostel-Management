// src/services/realtimeSync.js
/**
 * KPRIET Hostel & Mess Management Suite - Cross-Device Real-Time Sync Engine
 * Uses BroadcastChannel & Custom Events to sync state instantly across windows, tabs, and mobile/laptop browsers.
 */

const SYNC_CHANNEL_NAME = 'kpr_cross_device_sync_channel';

let broadcastChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      if (event?.data?.type) {
        try {
          window.dispatchEvent(new CustomEvent(event.data.type, { detail: event.data.payload }));
        } catch (e) {
          console.warn('Broadcast message dispatch error:', e);
        }
      }
    };
  }
} catch (e) {
  console.warn('BroadcastChannel initialization notice:', e);
}

export const realtimeSync = {
  /** Broadcast event to all other open tabs/windows on the same origin */
  broadcast(eventType, payload = null) {
    // 1. Dispatch locally on current window
    try {
      window.dispatchEvent(new CustomEvent(eventType, { detail: payload }));
      window.dispatchEvent(new CustomEvent('storage'));
    } catch (e) {
      console.warn('Local event dispatch notice:', e);
    }

    // 2. Broadcast to other tabs/windows via BroadcastChannel
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: eventType, payload, timestamp: Date.now() });
      } catch (e) {
        console.warn('Broadcast message send notice:', e);
      }
    }
  },
};
