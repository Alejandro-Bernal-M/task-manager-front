'use client'
import React from "react";
import api from "@/utils/common";
import styles from './registration.module.css'
import { useRouter } from 'next/navigation'
import { useStateContext } from '@/context/StateContext';
import { useState } from "react";
import toast from "react-hot-toast";

export default function Registration() {
  const { loggedIn, setLoggedIn } = useStateContext();
  const [SignUp, setSignUp] = useState<boolean>(false);

  const router = useRouter();
  if(loggedIn) router.push('/tasks')
    const handleSubmit = async (e: React.MouseEvent) => {
      e.preventDefault();
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const email = emailInput.value;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const password = passwordInput.value;
      if(email == '' || password == '') return toast.error('Please fill all the fields')
      try {
        const response = await fetch(api.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.status == 'Error') return toast.error(data.message);
        if (data.status == 'Sucess') {
          localStorage.setItem('token',JSON.stringify(data.token));
          localStorage.setItem('user_id',JSON.stringify(data.user_id));
          setLoggedIn(true);
          router.push('/tasks');
          toast.success('Logged in successfully');
        }
      } catch (error) {
      console.log(error);
    }
  }

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const name = nameInput.value;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const email = emailInput.value;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const password = passwordInput.value;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    const confirmPassword = confirmPasswordInput.value;
    if(name == '' || email == '' || password == '' || confirmPassword == '') return toast.error('Please fill all the fields')
    if(password !== confirmPassword) {
      toast.error('passwords do not match');
      return;
    }
    try {
      const response = await fetch(api.createUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: {name: name, email: email, password: password }}),
      });
      const data = await response.json();
      if (data.status == "SUCCESS") {
        try {
          const response = await fetch(api.login, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (data.status == 'Sucess') {
            toast.success('Logged in successfully');
            localStorage.setItem('token',JSON.stringify(data.token));
            localStorage.setItem('user_id',JSON.stringify(data.user_id));
            setLoggedIn(true);
            router.push('/tasks');
          }
        } catch (error) {
        console.log(error);
      }
    } else {
      toast.error(data.message);
    }
    } catch (error) {
      console.log(error);
  }
}
  
    return (
        <div className={styles.container}>
          
            <h1>{SignUp ? 'SignUp' : 'Login' }</h1>
            <form>
              {SignUp && <input type="text" placeholder="name" id="name" required/>}
              <input type="text" placeholder="email" id="email"  required/>
              <input type="password" placeholder="password" id='password' required/>
              {SignUp && <input type="password" placeholder="confirm password" id='confirmPassword' required/>}
              {!SignUp && <input type="submit" onClick={handleSubmit} value="Log in" />}
              {SignUp && <input type="submit" onClick={handleSignup} value="Sign Up" />}
            </form>
            {!SignUp && <button onClick={() => setSignUp(true)}>Sign Up</button>}
            {SignUp && <button onClick={() => setSignUp(false)}>Log in</button>}
        </div>
    )
}