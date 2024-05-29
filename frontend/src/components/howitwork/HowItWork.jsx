import React from 'react'

export default function HowItWork() {
  return (
    <div>
        <section className="flex flex-col md:flex-row items-center justify-center mb-8">
    <div className="w-full h-full md:w-1/2 mb-4 md:mb-0 rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-full" src="https://i.pinimg.com/564x/d7/48/5f/d7485f848d9acb7a8f4290b56e9263eb.jpg" alt="How It Works" />
    </div>
    <div className="w-full md:w-1/2 md:ml-8">
      
        <div className=" md:grid-cols-3 gap-6">
            <div className="bg-white my-4 rounded-lg overflow-hidden shadow-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">1. Tell Us What You Need</h3>
                <p className="text-gray-700">Describe your task in detail. We'll match you with the right person for the job.</p>
            </div>
            <div className="bg-white my-4 rounded-lg overflow-hidden shadow-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">2. Get Matched</h3>
                <p className="text-gray-700">Review offers from Taskers. Choose the one that suits you best based on their profile and reviews.</p>
            </div>
            <div className="bg-white my-4  rounded-lg overflow-hidden shadow-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">3. Task Done</h3>
                <p className="text-gray-700">Coordinate with your Tasker to get your task completed. Once done, pay securely through our platform.</p>
            </div>
        </div>
    </div>
</section>

    </div>
  )
}
