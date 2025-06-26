import React from 'react'
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../utils/data"
import { LuLogOut } from "react-icons/lu"
import { useNavigate } from 'react-router-dom'
import CharAvatar from '../Cards/CharAvatar';

function SideMenu({ activeMenu, isBlogMenu }) {
    const user = {name:"Shadi"};
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return;
        }
        navigate(route);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }
    
    return (
        <div className='w-64 h-[calc(100vh-60px)] shadow-gray-400 shadow-xl border-2 bg-white border-r border-gray-200/50 p-5 flex flex-col gap-4 overflow-y-auto sticky top-0'>
            {
                user && (
                    <div className="flex flex-col justify-center items-center gap-1 mb-7">
                        {user?.profileImageUrl ?
                            (<img src={user?.profileImage || ""} alt="Profile Image" className="w-20 h-20 rounded-full bg-slate-400" />) :
                            (
                                <CharAvatar
                                    fullName={user?.name || ""}
                                    width="w-20"
                                    height="h-20"
                                    style={"text-xl"}
                                />
                            )}
                        <div >
                            <h5 className=" text-gray-950 text-center font-semibold leading-6 mt-1">
                                {user?.name || ""}
                            </h5>
                            <p className="text-[13px] text-gray-800 font-medium text-center">
                                {user?.email || ""}
                            </p>
                        </div>
                    </div>
                )}
            {(isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA).map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] 
                        ${activeMenu === item.id ? "text-white bg-gradient-to-r from-sky-500 to-cyan-400" : ""} 
                        py-3 px-6 rounded-lg mb-3 cursor-pointer`}
                    onClick={() => handleClick(item.path)}
                >
                    {item.icon && <item.icon className="text-xl" />}
                    {item.label}
                </button>
            ))}

            {user && (
                <button
                    className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer`}
                    onClick={() => handleLogout()}
                >
                    <LuLogOut className="text-xl" />
                    Logout
                </button>
            )}
        </div>
    )
}

export default SideMenu