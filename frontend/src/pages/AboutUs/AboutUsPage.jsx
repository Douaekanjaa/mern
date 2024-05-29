import React from 'react';
import Nav from "../../components/navbar/Nav";
import Footer from "../../components/Footer/Footer";
import HowItWork from '../../components/howitwork/HowItWork';

function AboutUsPage() {
    return (
        <div>
            <Nav />
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <section className="mb-12">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">Our Mission</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center mb-8">
    <div className="w-full md:w-1/2 mb-4 md:mb-0 rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-auto" src="https://i.pinimg.com/474x/e0/5a/3c/e05a3c760b8bb85c4ba25e167dbecb1a.jpg" alt="Mission" />
    </div>
    <div className="w-full md:w-1/2 md:ml-8">
        <p className="text-lg text-gray-700">At <span className='text-emerald-900 font-extrabold'>Bricole</span>, we're committed to empowering individuals by providing access to reliable services and creating opportunities for skilled professionals. Our mission is to build a community where people can easily connect and collaborate to accomplish everyday tasks and projects.</p>
    </div>
</div>

                    </section>
                    <section className="mb-12">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">Our Values</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-md p-6">
                                <span className="text-4xl text-gray-800 mr-4">01</span>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-emerald-700">Integrity</h3>
                                    <p className="text-gray-700">We uphold the highest standards of honesty and ethics in everything we do.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-md p-6">
                                <span className="text-4xl text-gray-800 mr-4">02</span>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-emerald-700">Quality</h3>
                                    <p className="text-gray-700">We are dedicated to delivering excellence and exceeding expectations.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-md p-6">
                                <span className="text-4xl text-gray-800 mr-4">03</span>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-emerald-700">Responsiveness</h3>
                                    <p className="text-gray-700">We strive to be prompt, attentive, and proactive in meeting our customers' needs.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-md p-6">
                                <span className="text-4xl text-gray-800 mr-4">04</span>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-emerald-700">Community</h3>
                                    <p className="text-gray-700">We value collaboration, diversity, and inclusivity in building a strong community.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">How It Works</h2>
                    <HowItWork />
                    
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUsPage;
