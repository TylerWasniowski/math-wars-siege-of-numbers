import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx: Starting app mount...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('main.tsx: Root element not found!');
  } else {
    console.log('main.tsx: Root element found', rootElement);
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log('main.tsx: Render called');
  }
} catch (e) {
  console.error('main.tsx: Error mounting app', e);
}
