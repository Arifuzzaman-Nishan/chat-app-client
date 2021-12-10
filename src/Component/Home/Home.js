import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router';
import '../../App.css';
import logo from '../../images/logo.png';

export default function Home() {

    const navigate = useNavigate();
    // signup state...
    const [signup,setSignup] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data);

        // console.log(signup);
        
        if(signup){
            
            axios.post('http://localhost:5000/signup',data)
            .then(res => console.log(res.data))
            .catch(err => console.log(err.message))

        }else{

            axios.post('http://localhost:5000/login',data)
            .then(res => {
                console.log(res.data);
                sessionStorage.setItem("token",res.data.access_token);
                navigate('/inbox',{replace:true});
            })
            .catch(err => console.log(err.message))
            
        }
        
        
    }

    const handleSignup = () => {
        console.log("nishan");
        setSignup(!signup);
    }

    return (
        <div>
             <div id="login-container">
                <div id="left-column"></div>
                <div id="branding">
                    <img src={logo} alt="" />
                    {
                        signup ? 
                        <h1>Signup - Chat Application</h1>
                        :
                        <h1>Login - Chat Application</h1>
                    }
                </div>
                <div id="login-form">
                    {
                        signup ? 
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <input type="text" placeholder="enter name" {...register("name", { required: true })} />
                            {errors.name && <span>This field is required</span>}

                            <input type="text" placeholder="enter email" {...register("email", { required: true })} />
                            {errors.email && <span>This field is required</span>}

                            <input type="password" placeholder="enter password" {...register("password", { required: true })} />
                            {errors.password && <span>This field is required</span>}

                            <input type="submit" defaultValue="signup" />
                            
                            <h4 className="text-white text-center mt-5">
                                        Already signup?  
                                <span
                                    onClick={handleSignup}
                                    style={{color:"#3081E1",cursor:"pointer"}} 
                                    className="text-decoration-underline">
                                            login
                                </span>
                            </h4>
                
                        </form>
                    :
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <input type="text" placeholder="enter name" {...register("name", { required: true })} />
                            {errors.name && <span>This field is required</span>}

                            <input type="password" placeholder="enter password" {...register("password", { required: true })} />
                            {errors.password && <span>This field is required</span>}

                            <input type="submit" defaultValue="login" />

                            <h4 className="text-white text-center mt-5">
                                            New user?  
                                <span
                                onClick={handleSignup}
                                style={{color:"#3081E1",cursor:"pointer"}} 
                                className="text-decoration-underline">
                                        signup
                                </span>
                            </h4>
                        </form>

                    }
                </div>
            </div>
        </div>
    );
}
