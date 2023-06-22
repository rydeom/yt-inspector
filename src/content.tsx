import { App } from './App';
import { createRoot } from 'react-dom/client'

window.onload = async function () {
    const url = window.location.href;
    if (!url.includes('youtube.com/watch?v=')) {
        return;
    }

    const youtubeInspector = document.createElement('div');
    youtubeInspector.id = 'youtube-inspector';
    document.body.appendChild(youtubeInspector);
    const container = document.getElementById('youtube-inspector');
    if (!container) {
        return;
    }
    const react = createRoot(container);
    react.render(<App />);

    setTimeout(() => {
        const secondary = document.getElementById('secondary-inner');
        const sidebar = secondary?.lastChild;
        if (sidebar) {
            sidebar.insertBefore(youtubeInspector, sidebar.firstChild);
        }
    }, 500);
};
