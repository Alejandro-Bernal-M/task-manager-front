'use client'
import React from "react";
import api from "@/utils/common";

export default function Registration() {
    const handleSubmit = async (e: React.MouseEvent) => {
      e.preventDefault();
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const email = emailInput.value;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const password = passwordInput.value;
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
          console.log(data.token);
        }
      } catch (error) {
      console.log(error);
    }
  }

    return (
        <div>
            <h1>Registration</h1>
            <form>
              <input type="text" placeholder="email" id="email"  required/>
              <input type="password" placeholder="password" id='password' required/>
              <input type="submit" onClick={handleSubmit} value="Log in" />
            </form>
        </div>
    )
}