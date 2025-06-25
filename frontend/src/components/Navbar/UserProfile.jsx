import Button from '../Button';
import { LogOut, Settings, UserPen } from 'lucide-react';
import hourPNG from '../../assets/image/hour.png'

export default function UserProfile() {
    return (
        <>
            <div className="hidden lg:block">
                <Button
                    to="signup"
                    label="Sign Up"
                    bgColor="bg-orange-400"
                    textColor="text-white"
                />
            </div>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                >
                    <div className="w-10 rounded-full">
                        <img alt="User Avatar" src={hourPNG} />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-40 p-2 shadow"
                >
                    <li>
                        <a>
                            <UserPen size={16} />
                            Profile
                        </a>
                    </li>
                    <li>
                        <a>
                            <Settings size={16} />
                            Settings
                        </a>
                    </li>
                    <li>
                        <a>
                            <LogOut size={16} />
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
