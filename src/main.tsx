import ReactDOM from 'react-dom/client';
import { MainCanvas } from './canvas';

(function () {
  const root = document.getElementById('root');
  if (root == null) {
    return;
  }

  ReactDOM.createRoot(root).render(<MainCanvas />);
})();
