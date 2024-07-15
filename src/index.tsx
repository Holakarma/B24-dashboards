import { createRoot } from 'react-dom/client';
import Providers from 'app/providers/Providers';
import App from 'app/App';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);

root.render(
    <Providers>
        <App />
    </Providers>,
);
