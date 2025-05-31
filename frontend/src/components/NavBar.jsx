import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <div className="navbar bg-base-100 shadow-sm w-full mx-auto px-4 py-2 flex justify-between items-center">
            {/* left div Logo */}
            <div className="flex-1">
                <a className="text-xl font-bold text-shadow-black font-Niradei">
                    <span className='text-[#111729]'>Khod</span><span className='text-[#e79142]'>Kquiz</span>
                </a>
            </div>
            {/* right div */}
            <div className="flex gap-2 items-center justify-end">
                <div className="flex justify-between items-center gap-5 text-sm font-bold text-[#111729]">
                    <Link to="/" className="font-Niradei">
                        HOME
                    </Link>
                    <Link to="/leaderboard" className="">
                        LEADERBOARD
                    </Link>
                </div>
                {/* search */}
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-24 md:w-auto"
                />
                <div className="bg-[#1b274db8] p-2 rounded-2xl text-white hover:bg-[#e79242be] hover:text-[#111729]">
                    Sign Up
                </div>
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
                                src="https://z-p3-scontent.fpnh18-4.fna.fbcdn.net/v/t39.30808-1/432759543_969817604505212_1503739999874549244_n.jpg?stp=c0.82.480.480a_dst-jpg_s480x479_tt6&_nc_cat=102&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeGVQCCiPOJ1mGct3ycOxUjSs4Kd30N1Klqzgp3fQ3UqWuGvDEwpigL7GwtrB6vV9WtyQiR8VJR8zd6zSOsLWWXt&_nc_ohc=__T8dAChLyQQ7kNvwFZrU-Z&_nc_oc=Adm4MUr933ybaUCjcSVxvch5kGzNt9wOE2A6DmSdz_0_-_7BN6sprcHEY4C9zV_gLgA&_nc_zt=24&_nc_ht=z-p3-scontent.fpnh18-4.fna&_nc_gid=N26P1OBM4nzcEZ9qB8ujRg&oh=00_AfLWDuWK4kBzcQq4p1ZPyp21UVibcaU2PkLUZUi2KogZLg&oe=6840D66D"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
