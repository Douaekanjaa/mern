import React from 'react'

export default function AboutUs() {
    return (
        <div>


            <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            Welcome to Bricole!
                        </h2>


                        <p className="hidden text-gray-800 md:mt-4 md:block">
                            We are a community-driven platform designed to connect people who need tasks done with skilled individuals who can complete those tasks efficiently.
                        </p>

                        <p className="hidden text-gray-800 md:mt-4 md:block">
                            Bricole was founded with the idea that everyone should have access to quality help for their daily tasks. We understand how time-consuming and challenging it can be to find the right person for the job. That's why we created a platform that brings together a diverse group of talented individuals ready to help you with any task, big or small.
                        </p>
                        <div className="mt-4 md:mt-8">
                            <a
                                href="#"
                                className="inline-block rounded bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring focus:ring-yellow-400"
                            >
                                Get Started Today
                            </a>
                        </div>
                    </div>
                </div>

                <img
                    alt=""
                    src="https://i.pinimg.com/474x/fb/be/56/fbbe569325ad83658b3c6d2aabcb8c44.jpg"
                    className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
                />
            </section>
        </div>
    )
}
