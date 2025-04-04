import { createRoot } from 'react-dom/client';
import { MainCanvas } from './canvas';

const root = document.getElementById('root');
root && createRoot(root).render(<MainCanvas />);
