import './App.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthenticationProvider } from './providers/AuthenticationProvider';

import RenderRoutes from './routes';


function App() {
    return (
        <AuthenticationProvider>
            <BrowserRouter>
                <RenderRoutes />
            </BrowserRouter>
        </AuthenticationProvider>
    );
}

export default App;
