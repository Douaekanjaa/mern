import React from 'react';
import Nav from "../../components/navbar/Nav";
import Footer from "../../components/footer/Footer";

function BecomePro() {
    return (
        <div>
            <Nav />
            <div className="max-h-screen py-16 w-screen flex justify-center items-center bg-lime-100">
                <div className="max-w-4xl sm:w-full  mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center space-x-8">
                    <div className="w-1/2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">Become a <span className='text-emerald-900'>PRO</span></h1>
                        <p className="text-lg text-gray-600 mb-8">Join our community of pros and start earning money by helping others. Whether you're a handyman, computer whiz, or have any other skills, there's a job waiting for you.</p>
                    </div>
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Get Started</h2>
                        <p className="text-gray-700 mb-4">Already have an account?</p>
                        <a href="/pro-login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mb-4 inline-block">Log In</a>
                        <p className="text-gray-700 mb-4">New to Tasker? Sign up now!</p>
                        <a href="/become-a-pro" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full inline-block">Sign Up</a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BecomePro;
