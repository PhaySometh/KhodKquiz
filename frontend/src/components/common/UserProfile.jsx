import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { LogOut, Settings, UserPen, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DefaultProfilePicture from '../DefaultProfilePicture';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../ConfirmationDialog';
import LoadingSpinner from '../LoadingSpinner';

export default function UserProfile() {
    const {
        user,
        isAuthenticated,
        logout,
        logoutLoading,
        switchAccount,
        loading,
    } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            toast.error('Error logging out. Please try again.');
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    const handleSwitchToAdmin = async () => {
        try {
            const redirectPath = await switchAccount('admin');
            if (redirectPath) {
                navigate(redirectPath);
            }
        } catch (error) {
            toast.error('Failed to switch to admin account');
        }
    };

    const handleProfileClick = () => {
        navigate('/dashboard');
    };

    const handleUserProfileClick = () => {
        navigate('/profile');
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
                        {user?.picture && user.picture.trim() !== '' ? (
                            <img
                                alt="User Avatar"
                                src={user.picture}
                                className="rounded-full object-cover w-full h-full border-2 "
                            />
                        ) : (
                            <DefaultProfilePicture
                                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
                                size={16}
                                name={user?.name}
                            />
                        )}
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
                        <button onClick={handleUserProfileClick}>
                            <Settings size={16} />
                            Profile Settings
                        </button>
                    </li>
                    {/* Show admin switch option if user has admin access */}
                    {(user?.role === 'admin' ||
                        localStorage.getItem('adminToken')) && (
                        <li>
                            <button
                                onClick={handleSwitchToAdmin}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <LogIn size={16} />
                                Switch to Admin
                            </button>
                        </li>
                    )}
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
                isLoading={logoutLoading}
            />

            {/* Full Screen Loading for Logout */}
            {logoutLoading && (
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
