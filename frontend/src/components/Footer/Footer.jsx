import React from 'react';

function Footer() {
    return (
        <footer className="bg-zinc-50 text-center text-surface/75 dark:bg-neutral-700 dark:text-white/75 lg:text-left">
            <div className="flex items-center justify-center border-b-2 border-neutral-200 p-6 dark:border-white/10 lg:justify-between">
                
                <div className="flex justify-center">
                    <a href="#!" className="me-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512" className="[&>svg]:h-4 [&>svg]:w-4">
                            <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                        </svg>
                    </a>
                    {/* Add other social icons similarly */}
                </div>
            </div>

            {/* Main container div */}
            <div className="mx-6 py-10 text-center md:text-left">
                <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* TW Elements section */}
                    <div>
                        <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                            <span className="me-3 [&>svg]:h-4 [&>svg]:w-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                                </svg>
                            </span>
                            TW Elements
                        </h6>
                        <p>
                            Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        </p>
                    </div>
                    {/* Products section */}
                    <div>
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            Products
                        </h6>
                        <p className="mb-4">
                            <a href="#!">Angular</a>
                        </p>
                        {/* Add other product links similarly */}
                    </div>
                    {/* Useful links section */}
                    <div>
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            Useful links
                        </h6>
                        <p className="mb-4">
                            <a href="#!">Pricing</a>
                        </p>
                        {/* Add other useful links similarly */}
                    </div>
                    {/* Contact section */}
                    <div>
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            Contact
                        </h6>
                        <p className="mb-4 flex items-center justify-center md:justify-start">
                            <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                </svg>
                            </span>
                            New York, NY 10012, US
                        </p>
                        {/* Add other contact details similarly */}
                    </div>
                </div>
            </div>

            {/* Copyright section */}
            <div className="bg-black/5 p-6 text-center">
                <span>© 2023 Copyright:</span>
                <a className="font-semibold" href="https://tw-elements.com/">TW Elements</a>
            </div>
        </footer>
    );
}

export default Footer;
