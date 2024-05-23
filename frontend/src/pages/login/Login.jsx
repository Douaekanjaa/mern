import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <>
      <section className="h-screen" style={{ backgroundImage: `url("/image.jpg")` }}>
        <div className="h-full">
          <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
              <img
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="w-full"
                alt="Sample image"
              />
            </div>
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
              <h1 className="text-center text-6xl text-blue-800">Login</h1><br /><br />
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-500 text-white py-2 px-4 rounded focus:outline-none focus:bg-indigo-600"
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
