import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// In AI Studio iframe preview, HMR WebSocket is disabled.
// Suppress benign WebSocket closure notices from @vite/client.
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('WebSocket') ||
      event.message?.includes('ws://') ||
      event.message?.includes('wss://')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.message?.includes('WebSocket') ||
      event.reason?.message?.includes('ws://') ||
      event.reason?.message?.includes('wss://')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
