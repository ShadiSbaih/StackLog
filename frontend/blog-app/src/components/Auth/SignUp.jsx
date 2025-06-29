import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import AUTH_IMG from "../../assets/auth-img.jpg";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  //handle signup form submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    if (!fullName) {
      setError("Please enter a full name");
      return;
    }
    if (!email) {
      setError("Please enter an email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    //clear error if validation passed
    setError(null);

    //Sign Up api call
    try {
      //upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminAccessToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
      }

      //redirect based on role
      if (role === "admin") {
        setOpenAuthForm(false);
        navigate("/admin/dashboard");
      }
      navigate("/")
      setOpenAuthForm(false);

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
        console.error("Sign Up Error:", error.message);
      }
    }
  };

  return (
    <div className="flex items-center  h-auto md:h-[520px]">
      <div className="w-[90vw] md:w-[43vw] p-7 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className="text-slate-700 text-sm mb-6 mt-[2px]">
          Please enter your details to sign up
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              className=""
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder="shadi"
              label="Full Name"
              type="text"
            />

            <Input
              className=""
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="shadi@gmail.com"
              label="Email Address"
              type="email"
            />

            <Input
              className=""
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Minimum 8 characters"
              label="Password"
              type="password"
            />
            <Input
              className=""
              value={adminAccessToken}
              onChange={({ target }) => setAdminAccessToken(target.value)}
              placeholder="6 digit code"
              label="Admin Access Token"
              type="password"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => setCurrentPage("login")}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>

      <div className="hidden md:block">
        <img src={AUTH_IMG} alt="auth-img" className="h-[520px] w-[33vw]" />
      </div>
    </div>
  );
};

export default SignUp;
