import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import '@/styles/index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface-100)',
              border: '1px solid var(--color-surface-200)',
              color: 'var(--color-surface-900)',
              borderRadius: 'var(--radius-lg)',
            },
          }}
          richColors
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
