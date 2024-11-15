import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); 

    const payload = { email, password };

    try {
      
      const response = await fetch("http://localhost:9090/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

           if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      const { token } = data;
      localStorage.setItem("authToken", token);

      
      navigate("/Dashboards");

    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1679784204551-013181bb687f?q=80&w=1860&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              E-mail
            </label>
            <Textarea id="email" className="w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <Textarea id="password" className="w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="flex flex-col gap-4">
            <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-md">
              <Link to="/Dashboards" className="block text-center">Login</Link>
            </Button>
            <Button className="w-full bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 rounded-md">
              <Link to="/RegisterPage" className="block text-center">Register</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
