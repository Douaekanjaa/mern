import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import DevenirPro from "./pages/DevenirPro/DevenirPro";

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
                <Route path="/become-a-pro" element={<DevenirPro />} />
                

            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
