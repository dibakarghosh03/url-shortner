import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'


function AppLayout() {
    return (
        <div>
            <main className='min-h-screen container'>
                {/* Header */}
                <Header />
                {/* Body */}
                <Outlet />
            </main>
            {/* Footer */}
            <div className='text-center p-10 mt-10 bg-gray-800'>
                Made with ❤️ by Dibakar
            </div>
        </div>
    )
}

export default AppLayout