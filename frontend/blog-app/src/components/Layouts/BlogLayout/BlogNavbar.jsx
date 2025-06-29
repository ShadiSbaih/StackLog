import { useContext, useState } from "react";
import Logo from "../../../assets/StackLog.svg";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { BLOG_NAVBAR_DATA } from "../../../utils/data"
import SideMenu from "../SideMenu";
import { useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import ProfileInfoCard from "../../Cards/ProfileInfoCard";
import Modal from "../../Modal";
import Login from "../../Auth/Login";
import Signup from "../../Auth/Signup";



function BlogNavbar({ activeMenu }) {
    const { user, setOpenAuthForm } = useContext(UserContext);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // 768px = md في Tailwind
                setOpenSideMenu(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* {JSON.stringify(user)} */}
            <div className="bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-50 ">
                <div className="container mx-auto flex items-center justify-between gap-5">
                    <div className="flex gap-5">
                        <button className="cursor-pointer inline-block md:hidden " onClick={() => setOpenSideMenu(!openSideMenu)}>
                            {openSideMenu ?
                                <HiOutlineX className="text-2xl" /> :
                                <HiOutlineMenu className="text-2xl" />}
                        </button>
                        <Link to="/" >
                            <img src={Logo} alt="main logo" className="h-[24px]  md:h-[26px]" />
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        <ul className="flex items-center gap-10 m-0 p-0">
                            {BLOG_NAVBAR_DATA.map((item) => {
                                if (item?.onlySideMenu) return null;
                                // Determine if the link is active:
                                const isActive = activeMenu
                                    ? activeMenu === item.id
                                    : location.pathname === item.path;
                                return (
                                    <li key={item.id} className="list-none">
                                        <Link
                                            to={item.path}
                                            className="group relative text-[15px] text-black font-medium cursor-pointer"
                                        >
                                            {item.label}
                                            <span
                                                className={`block absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-all duration-300 origin-left 
                                                ${isActive ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}
                                            >

                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="flex items-center gap-5 group">
                        <button
                            className="bg-gray-300/50 group-hover:text-sky-500 group-hover:bg-gray-200/80 cursor-pointer p-1.5 rounded transition-all"
                            onClick={() => setOpenSearchBar(true)}
                        >
                            <LuSearch className="text-[22px] text-gray-600 group-hover:text-sky-500 transition-colors duration-300" />
                        </button>
                        {!user ? (<button
                            className="flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-400 py-2 px-5 md:px-7 rounded-full text-xm md:text-sm font-semibold text-white group-hover:bg-black group-hover:text-white cursor-pointer transition-colors group-hover:shadow-2xl group-hover:shadow-cyan-200"
                            onClick={() => setOpenAuthForm(true)}
                        >
                            Login/SignUp
                        </button>) : (
                            <div className="hidden md:block">
                                <ProfileInfoCard />
                            </div>)}
                    </div>

                    {openSideMenu && (
                        <div className="fixed top-[60px] -ml-4 bg-white">
                            <SideMenu activeMenu={activeMenu} isBlogMenu isOpenSideMenu={setOpenSideMenu} />
                        </div>
                    )}
                </div>
            </div>
            <AuthModal />
        </>
    )
}

export default BlogNavbar;


const AuthModal = () => {
    const { openAuthForm, setOpenAuthForm } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState("login");
    return (
        <>
            <Modal
                title="Login/SignUp"
                isOpen={openAuthForm}
                onClose={
                    () => {
                        setOpenAuthForm(false);
                        setCurrentPage("login");
                    }}
                hideheader
            >
                <div className="shadow-lg">
                    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
                    {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
                </div>
            </Modal>
        </>
    )

}