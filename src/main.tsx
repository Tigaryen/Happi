import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AIAudit from './AIaudit.tsx';
import './index.css';

const Root = window.location.pathname === '/audit' ? AIAudit : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
