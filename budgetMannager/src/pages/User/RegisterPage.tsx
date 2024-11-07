import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import React, {useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  username: string;
  email : string;
  password: string;
}


const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
    }
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://th.bing.com/th/id/OIG4.ljwUKjU3HwkN8x7lO614?pid=ImgGn')` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 rounded-md">
              Register
            </Button>
            <Button className="w-full bg-gray-100 text-black hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 rounded-md">
              <Link to="/" className="block text-center">Comeback</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
  
export default RegisterPage;
