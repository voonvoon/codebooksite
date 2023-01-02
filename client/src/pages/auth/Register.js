import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "../../context/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
   // state
   const [name, setName] = useState("wong");
   const [email, setEmail] = useState("wonghv@gmail.com");
   const [password, setPassword] = useState("123321");
   // hooks
   const [auth, setAuth] = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `/register`, 
          {
          name,
          email,
          password,
        });
        console.log(data)
        if(data?.error) {       //the ? make sure data exist first
          toast.error(data.error);
        } else {
          localStorage.setItem("auth",JSON.stringify(data));
          setAuth({ ...auth, token: data.token, user: data.user });
          toast.success("Registration successful!");
          navigate("/dashboard/user");
        }
      } catch (err) {
        console.log(err)
        toast.error("Registration failed! Try again please!");
      }
   };

    return (
     <div>
        <Jumbotron title="Register" />

        <div className="container">
           <div className="row">
             <div className="col-md-6 offset-md-3">
                <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  className="form-control mb-4 p-2 mb-2"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus    // user no need mv cursor to input space 
                />

                  <input 
                  type="email" 
                  className="form-control mb-4 p-2 mb-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />      

                  <input 
                  type="password" 
                  className="form-control mb-4 p-2 "
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />

               <button className="btn btn-primary" type="submit">
                  Submit
               </button>  

            </form>          
             </div>
           </div>
        </div>

     </div>
    );
  }