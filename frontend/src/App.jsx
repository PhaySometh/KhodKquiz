import './App.css';
import AppRoutes from './routes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import AuthLoadingScreen from './components/AuthLoadingScreen';

// Inner component that has access to auth context
function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <AuthLoadingScreen />;
    }

    return (
        <div className="min-h-screen w-full bg-base-100 text-base-content">
            <AppRoutes />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </AuthProvider>
    );
}

export default App;
