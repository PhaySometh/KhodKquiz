import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { LogOut, Settings, UserPen, Menu } from 'lucide-react';

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="navbar bg-base-100 shadow-xl z-10 w-full px-4 py-2 flex justify-between items-center fixed top-0">
            {/* Left - Burger button for small screens */}
            <div className="flex items-center gap-3">
                {/* Burger button (small screens only) */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden md:hidden block text-blue-950"
                >
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <a className="text-xl font-bold text-shadow-black font-Niradei">
                    <span className="text-blue-950">Khod</span>
                    <span className="text-orange-400">Kquiz</span>
                </a>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex gap-5 items-center text-sm font-bold text-[#111729]">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? 'text-orange-400' : 'text-blue-950 hover:text-orange-400'
                    }
                    end
                >
                    HOME
                </NavLink>
                <NavLink
                    to="/quiz"
                    className={({ isActive }) =>
                        isActive ? 'text-orange-400' : 'text-blue-950 hover:text-orange-400'
                    }
                >
                    TEST YOUR SKILLS
                </NavLink>
                <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                        isActive ? 'text-orange-400' : 'text-blue-950 hover:text-orange-400'
                    }
                >
                    LEADERBOARD
                </NavLink>
            </div>

            {/* Right - Sign Up + Avatar */}
            <div className="flex items-center gap-4">
                {/* Sign Up button (only visible on lg and up) */}
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
                            <img
                                alt="User Avatar"
                                src="https://scontent.fpnh19-1.fna.fbcdn.net/v/t39.30808-6/432759543_969817604505212_1503739999874549244_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGVQCCiPOJ1mGct3ycOxUjSs4Kd30N1Klqzgp3fQ3UqWuGvDEwpigL7GwtrB6vV9WtyQiR8VJR8zd6zSOsLWWXt&_nc_ohc=bCdt6PkNOIsQ7kNvwGfFhzs&_nc_oc=Adnq08dfgA_bqcByAEgXt9jwzIi46z0Tex4ML9tJl0T5tgk-NXuFiBYvVJ2Eab8lbkw&_nc_zt=23&_nc_ht=scontent.fpnh19-1.fna&_nc_gid=akzNWYG26-eL1zFiZVOGfg&oh=00_AfN-2gpxqFmlzwV7xdCTEfFJYJFAJnRdmxV3dUGflaAEZQ&oe=6849A6AB"
                            />
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
            </div>

            {/* Mobile menu (shown when burger is clicked) */}
            {isMenuOpen && (
                <div className="absolute top-16 left-4 right-4 bg-white shadow-md rounded-lg p-4 z-20 md:hidden">
                    <nav className="flex flex-col gap-4 text-sm font-bold text-[#111729]">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? 'text-orange-400' : 'text-blue-950 hover:text-orange-400'
                            }
                            onClick={() => setIsMenuOpen(false)}
                            end
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            to="/quiz"
                            className={({ isActive }) =>
                                isActive ? 'text-orange-400' : 'text-blue-950 hover:text-orange-400'
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            TEST YOUR SKILLS
                        </NavLink>
                        <NavLink
                            to="/leaderboard"
                            className={({ isActive }) =>
                                isActive ? 'text-orange-400' : 'text-blue-950 hover:text-orange-400'
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            LEADERBOARD
                        </NavLink>
                        <Button
                            to="signup"
                            label="Sign Up"
                            bgColor="bg-orange-400"
                            textColor="text-white"
                        />
                    </nav>
                </div>
            )}
        </div>
    );
}
