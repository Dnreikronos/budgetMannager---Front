import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

const LoginPage = () => {
  return (
    <>
      <body className="items-center justify-center text-center">
        <div className="mt-96">
          <div>
            <h1>Username</h1>
            <div className="flex items-center justify-center mr-96">
              <Textarea />
            </div>
            <h1>E-mail</h1>
            <div className="flex items-center justify-center mr-96">
              <Textarea />
            </div>
            <h1>Password</h1>
            <div className="flex items-center justify-center mr-96">
              <Textarea />
            </div>
            <Button className="mt-5">
              <Link to="/Dashboards">Login</Link>
            </Button>
            <Button className="mt-5">
              <Link to="/">Register</Link>
            </Button>
          </div>
        </div>
      </body>
    </>
  );
};

export default LoginPage;
