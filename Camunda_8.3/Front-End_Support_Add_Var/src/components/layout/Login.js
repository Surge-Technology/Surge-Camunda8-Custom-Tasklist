import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import '../style/login.css';
 
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
 
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
 
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();
 
    const storedUsernames = JSON.parse(localStorage.getItem("usernames")) || [];
    const storedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
 
    const isValidCredentials =
      storedUsernames.includes(username) && storedPasswords.includes(password);
 
    if (isValidCredentials) {
      localStorage.setItem("username", username);
      alert("Login successful!");
      navigate("/Tasklist", { state: { username } });
    } else {
      const newUsernames = [...storedUsernames, username];
      const newPasswords = [...storedPasswords, password];
      localStorage.setItem("usernames", JSON.stringify(newUsernames));
      localStorage.setItem("passwords", JSON.stringify(newPasswords));
      alert("Username and password stored in local storage.");
    }
  };
 
 
 
  return (
    <div className="login-container">
      <h1 className="title">
        <b>Surge</b>
      </h1>
      <h3 class="sc-dPyBCJ">Tasklist</h3>
      <br></br>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div class="sc-BeQoi">
          <input
            name="username"
            type="text"
            id="username"
            required
            placeholder=" "
            className="input-field"
            value={username}
            onChange={handleUsernameChange}
          />
          <label htmlFor="username">Username</label>
        </div>
        <div class="sc-BeQoi">
          <input
            name="password"
            type="password"
            id="password"
            required
            placeholder=" "
            className="input-field"
            value={password}
            onChange={handlePasswordChange}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button
          class="sc-iTONeN"
          type="submit"
          className="submit-button"
          disabled={!username || !password}
        >
          Login
        </button>
      </form>
      <br></br>
      <div className="sc-hTtwUo idTMZw">
        ©Surge@2024
      </div>
    </div>
  );
}
 
export default LoginPage;
 