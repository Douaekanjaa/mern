import React, { useState } from 'react';
import { useAuthProContext } from '../../context/AuthProContext';
import { useNavigate, NavLink } from 'react-router-dom';

const ProNav = () => {
    const { authUser, logout } = useAuthProContext();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 text-xl font-bold text-lime-600">
                            TaskPro
                        </NavLink>
                    </div>
                    <div className="hidden md:flex items-center space-x-4 ml-auto">
                        <NavLink to="/tasks" className="text-gray-800 hover:text-lime-600 px-6 py-2 rounded-md text-sm font-medium">
                            My Tasks
                        </NavLink>
                        <NavLink to="/account" className="text-gray-800 hover:text-lime-600 px-3 py-2 rounded-md text-sm font-medium">
                            Account
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="text-gray-800 hover:text-lime-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink to="/tasks" className="text-gray-800 hover:text-lime-600 block px-6 py-2 rounded-md text-base font-medium">
                        My Tasks
                    </NavLink>
                    <NavLink to="/account" className="text-gray-800 hover:text-lime-600 block px-3 py-2 rounded-md text-base font-medium">
                        Account
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="text-gray-800 hover:text-lime-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default ProNav;
