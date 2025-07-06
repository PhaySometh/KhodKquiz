import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { LogOut, Settings, UserPen, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import hourPNG from '../../assets/image/hour.png';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../ConfirmationDialog';
import LoadingSpinner from '../LoadingSpinner';

export default function UserProfile() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);

        try {
            // Add a brief delay for better UX
            await new Promise((resolve) => setTimeout(resolve, 1500));

            logout();
            navigate('/');
        } catch (error) {
            toast.error('Error logging out. Please try again.');
        } finally {
            setIsLoggingOut(false);
            setShowLogoutConfirm(false);
        }
    };

    const handleProfileClick = () => {
        navigate('/dashboard');
    };

    const handleUserProfileClick = () => {
        navigate('/user');
    };

    if (!isAuthenticated) {
        return (
            <>
                <div className="hidden lg:flex gap-2">
                    <Button
                        to="login"
                        label="Sign In"
                        bgColor="bg-blue-950"
                        textColor="text-white"
                    />
                    <Button
                        to="signup"
                        label="Sign Up"
                        bgColor="bg-orange-400"
                        textColor="text-white"
                    />
                </div>

                {/* Mobile login button */}
                <div className="lg:hidden">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-ghost btn-circle"
                    >
                        <LogIn size={20} className="text-blue-950" />
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="hidden lg:block text-sm text-blue-950 font-medium">
                Welcome, {user?.name?.split(' ')[0] || 'User'}!
            </div>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                >
                    <div className="w-10 rounded-full">
                        <img
                            alt="User Avatar"
                            src={user?.picture || hourPNG}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 p-2 shadow"
                >
                    <li className="menu-title">
                        <span className="text-xs text-gray-500 truncate">
                            {user?.email}
                        </span>
                    </li>
                    <li>
                        <button onClick={handleProfileClick}>
                            <UserPen size={16} />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button onClick={handleUserProfileClick}>
                            <Settings size={16} />
                            Profile Settings
                        </button>
                    </li>
                    <li>
                        <button onClick={handleLogoutClick}>
                            <LogOut size={16} />
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Logout Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout? You'll need to sign in again to access your account."
                confirmText="Logout"
                cancelText="Cancel"
                variant="warning"
                isLoading={isLoggingOut}
            />

            {/* Full Screen Loading for Logout */}
            {isLoggingOut && (
                <LoadingSpinner
                    fullScreen={true}
                    text="Logging out..."
                    size="lg"
                    variant="spinner"
                />
            )}
        </>
    );
}
