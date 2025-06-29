import React from 'react'

const Modal = ({ isOpen, onClose, hideheader, children,title }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50'>
            {/*Modal Content*/}
            <div className={`relative flex flex-col bg-white shadow-lg rouned-lg  overflow-hidden`}>
              
                {/*Modal Header */}
                {!hideheader && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className='md:text-lg font-medium text-gray-900'>{title}</h3>
                    </div>
                )}
                <button
                    type='button'
                    onClick={onClose}
                    className='flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer text-gray-400 bg-transparent hover:bg-sky-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8'>
                    <svg
                        className='w-6 h-6'
                        aria-hidden='true'
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>
                {/*Modal Body*/}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal