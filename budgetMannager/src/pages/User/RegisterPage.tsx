import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";


const RegisterPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://th.bing.com/th/id/OIG4.ljwUKjU3HwkN8x7lO614?pid=ImgGn')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <Textarea id="username" className="w-full border-gray-300 rounded-md shadow-sm" />
          </div>
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
            <Button className="w-full bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 rounded-md">
              <Link to="/RegisterPage" className="block text-center">Register</Link>
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
