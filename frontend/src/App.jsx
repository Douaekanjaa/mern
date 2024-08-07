import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import DevenirPro from "./pages/DevenirPro/DevenirPro";
import LoginPro from "./pages/DevenirPro/LoginPro";
import BecomePro from "./pages/DevenirPro/BecomePro";
import ProProfile from "./pages/pro/ProProfile";
import CatById from "./components/Categories/CatById";
import Tasks from "./pages/pro/Tasks";
import BookPro from "./pages/Booking/BookPro";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import Profile2 from "./pages/Profil/Profil2";

import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
    const { authUser } = useAuthContext();

    return (
        <div className=' p-0 bg-white flex items-center justify-center'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={authUser ? <Navigate to='/home' /> : <Login />} />
                <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
                <Route path="/become-pro" element={<BecomePro />} />
                <Route path="/become-a-pro" element={<DevenirPro />} />
                <Route path="/pro-login" element={<LoginPro />} />
                <Route path="/profile" element={<ProProfile />} />
                <Route path="/profile2/:proId" element={<Profile2 />} /> 
                <Route path="/category/:categoryId" element={<CatById />} />
                <Route path="//tasks" element={<Tasks />} />
                <Route path="/book-pro" element={<BookPro />} />
                <Route path="/aboutus" element={<AboutUsPage />} /> 
                
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
