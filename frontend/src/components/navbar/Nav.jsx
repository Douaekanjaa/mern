import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../context/AuthContext";

const Nav = () => {
    const { loading, logout } = useLogout();
    const { authUser } = useAuthContext();
    const [collapsed, setCollapsed] = useState(true);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    return (
        <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <a className="block  " href="/">
                            <img src="../public/images/logo.png" className="w-36  h-21" alt="" />
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                <li className="md:mx-2 ">
                                    <a className="text-gray-800 transition hover:text-gray-500/75" href="#"> Home </a>
                                </li>

                                <li className="md:mx-2 ">
                                    <a className="text-gray-800 transition hover:text-gray-500/75" href="#"> Services </a>
                                </li>                
                                <li className="md:mx-2 ">
                                    <a className="text-gray-800 transition hover:text-gray-500/75" href="#"> About US </a>
                                </li>
                                <li className="md:mx-2 ">
                                    <a className="text-gray-800 transition hover:text-gray-500/75" href="#"> Contact US </a>
                                </li>
                                <li className="md:mx-2 ">
                                    <Link className="text-gray-800 transition hover:text-gray-500/75" to="/become-pro"> Become a Pro </Link>
                                </li>
                               
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            {authUser ? (
                                <button
                                    onClick={handleLogout}
                                    className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow">
                                        Se connecter
                                    </Link>
                                    <div className="hidden sm:flex">
                                        <Link
                                            to="/signup"
                                            className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-emerald-600"
                                        >
                                            S'inscrire
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="block md:hidden">
                            <button
                                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                                onClick={handleCollapse}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {!collapsed && (
                <nav aria-label="Global" className="md:hidden">
                    <ul className="mt-4 space-y-2 px-4 text-sm">
                        <li>
                            <a className="block text-gray-800 transition hover:text-gray-700" href="#"> Home </a>
                        </li>

                        <li>
                            <a className="block text-gray-800 transition hover:text-gray-700" href="#"> Services </a>
                        </li>
                        <li>
                            <a className="block text-gray-800 transition hover:text-gray-700" href="#"> About US </a>
                        </li>
                        <li>
                            <a className="block text-gray-800 transition hover:text-gray-700" href="#"> Contact US </a>
                        </li>
                        <li>
                            <Link className="block text-gray-800 transition hover:text-gray-700" to="/become-pro"> Become a Pro </Link>
                        </li>
                        {authUser ? (
                            <li>
                                <button onClick={handleLogout} className="block w-full text-left text-black hover:text-gray-600">
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="text-black hover:text-gray-600 block">
                                        Se connecter
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-black hover:text-gray-600 block">
                                        S'inscrire
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Nav;
