import { NavLink } from 'react-router-dom';
import Button from './Button';
import { LogOut, Settings, UserPen, UserRoundPen } from 'lucide-react';

export default function NavBar() {
    return (
        <div className="navbar bg-base-100 shadow-sm w-full mx-auto px-4 py-2 flex justify-between items-center">
            {/* left div Logo */}
            <div className="flex-1">
                <a className="text-xl font-bold text-shadow-black font-Niradei">
                    <span className="text-blue-950">Khod</span>
                    <span className="text-orange-400">Kquiz</span>
                </a>
            </div>
            {/* right div */}
            <div className="flex gap-5 items-center justify-end">
                <div className="flex justify-between items-center mr-2 gap-5 text-sm font-bold text-[#111729]">
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
                {/* search */}
                <Button
                    to="signup"
                    label="Sign Up"
                    bgColor="bg-orange-400"
                    textColor="text-white"
                />
                {/* avartar */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                    >
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://z-p3-scontent.fpnh18-4.fna.fbcdn.net/v/t39.30808-6/432759543_969817604505212_1503739999874549244_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGVQCCiPOJ1mGct3ycOxUjSs4Kd30N1Klqzgp3fQ3UqWuGvDEwpigL7GwtrB6vV9WtyQiR8VJR8zd6zSOsLWWXt&_nc_ohc=nM0J52h3yiEQ7kNvwH1Q8XF&_nc_oc=AdmWrIF_s6NgEeTJ-UOQoZjXd4JooN8Ur37TXAmJGNqvagP7KRNsoWndtJmyIWZzE44&_nc_zt=23&_nc_ht=z-p3-scontent.fpnh18-4.fna&_nc_gid=a_vVzDbNAqQYylsVAjtxQQ&oh=00_AfJpyQFfNZJ4ib1XOU5WhAfhftIsaAhbECokC_sqPJ2ByA&oe=68422E2B"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-30 p-2 shadow"
                    >
                        <li>
                            <a className="">
                                <span>
                                    <UserPen size={16} />
                                </span>
                                Profile
                            </a>
                        </li>
                        <li>
                            <a>
                                <span>
                                    <Settings size={16} />
                                </span>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a>
                                <span>
                                    <LogOut size={16} />
                                </span>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
