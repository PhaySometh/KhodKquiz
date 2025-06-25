import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../Button';
import { Menu } from 'lucide-react';
import UserProfile from './UserProfile';

export default function Navbar() {
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
                        isActive
                            ? 'text-orange-400'
                            : 'text-blue-950 hover:text-orange-400'
                    }
                    end
                >
                    HOME
                </NavLink>
                <NavLink
                    to="/quiz"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-orange-400'
                            : 'text-blue-950 hover:text-orange-400'
                    }
                >
                    TEST YOUR SKILLS
                </NavLink>
                <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-orange-400'
                            : 'text-blue-950 hover:text-orange-400'
                    }
                >
                    LEADERBOARD
                </NavLink>
            </div>

            {/* Right - Sign Up + Avatar */}
            <div className="flex items-center gap-4">
                {/* Sign Up button (only visible on lg and up) */}
                <UserProfile />
            </div>

            {/* Mobile menu (shown when burger is clicked) */}
            {isMenuOpen && (
                <div className="absolute top-16 left-4 right-4 bg-white shadow-md rounded-lg p-4 z-20 md:hidden">
                    <nav className="flex flex-col gap-4 text-sm font-bold text-[#111729]">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-orange-400'
                                    : 'text-blue-950 hover:text-orange-400'
                            }
                            onClick={() => setIsMenuOpen(false)}
                            end
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            to="/quiz"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-orange-400'
                                    : 'text-blue-950 hover:text-orange-400'
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            TEST YOUR SKILLS
                        </NavLink>
                        <NavLink
                            to="/leaderboard"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-orange-400'
                                    : 'text-blue-950 hover:text-orange-400'
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
