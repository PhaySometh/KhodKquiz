import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, UserPen, LogIn } from 'lucide-react';
import hourPNG from '../../assets/image/hour.png';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../ConfirmationDialog';
import LoadingSpinner from '../LoadingSpinner';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProfile() {
    const navigate = useNavigate();
    const { logout: authLogout, logoutLoading } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            // Clear axios headers
            axios.defaults.headers.common['Authorization'] = null;

            // Use AuthContext logout which handles all authentication state
            await authLogout();

            // Navigate to home page after successful logout
            navigate('/');
        } catch (error) {
            toast.error('Error logging out. Please try again.');
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    return (
        <>
            <div className="hidden lg:block text-sm text-blue-950 font-medium">
                Welcome, Admin!
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
                            src={hourPNG}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 p-2 shadow"
                >
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
