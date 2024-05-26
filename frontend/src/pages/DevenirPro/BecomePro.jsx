import React from 'react';

function BecomePro() {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="max-w-lg w-full bg-white p-8 shadow-lg rounded-lg">
                <div className="flex justify-center mb-8">
                    <img src="../public/images/loginpro.png" alt="Login Pro" className="w-32 h-32 object-contain" />
                </div>
                <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">Join Our Pro Community</h2>
                <div className="flex flex-col space-y-6">
                    <a href="/become-a-pro" className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-center font-semibold transition-colors duration-300">
                        Register as a Pro
                    </a>
                    <div className="text-center">
                        <span className="text-gray-600">Already a member?</span>
                        <a href="/pro-login" className="text-blue-500 hover:underline">Log in here</a>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-600">Learn more about our platform</span>
                        <a href="/about" className="text-blue-500 ml-2 hover:underline">About Us</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BecomePro;
