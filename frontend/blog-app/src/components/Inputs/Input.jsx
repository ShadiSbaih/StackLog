import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({
    value,
    onChange,
    placeholder,
    label,
    type = "text",
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    return (
        <div>
            <label className='text-[15px] text-slate-800' htmlFor={label}>{label}</label>
            
            <div className="input-box flex items-center border-2 border-slate-200">
                <input id={label} type={
                    type === "password" ? (showPassword ? "text" : "password") : type
                }
                    placeholder={placeholder}
                    className='w-full bg-transparent outline-none text-[15px] pt-2 border-b border-slate-200 placeholder:text-[15px]'
                    value={value}
                    onChange={(e) => onChange(e)}
                />
                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='cursor-pointer text-primary'
                                onClick={() => toggleShowPassword()} />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='cursor-pointer text-slate-500 '
                                onClick={() => toggleShowPassword()} />
                        )}
                    </>
                )}
            </div>

        </div>
    )
}

export default Input