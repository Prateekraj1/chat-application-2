import { MessageSquareMore } from 'lucide-react'
import React from 'react'

const NoChat = () => {
  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50'>
        <div className='max-w-md text-center space-y-6'>
            {/* Icon */}
            <div className='flex justify-center gap-4 mb-4'>
                <div className='relative'>
                    <div className='w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center animate-bounce'>
                    <MessageSquareMore className='w-8 h-8 text-accent'/>
                    </div>
                </div>
            </div>

            {/* extra text */}
            <h2 className='text-2xl font-bold'>Welocme to ChatUs</h2>
            <p className='text-base-content/60'>Jump to a conversation and start chatting...</p>
        </div>
    </div>
  )
}

export default NoChat
