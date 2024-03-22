import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../style/login.css";
 
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
  const isLoginDisabled = !username || !password;

  const handleSubmit = (event) => {
    event.preventDefault();
 
    const storedUsernames = JSON.parse(localStorage.getItem("usernames")) || [];
    const storedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
 
    const isValidCredentials =
      storedUsernames.includes(username) && storedPasswords.includes(password);
 
    if (isValidCredentials) {
      localStorage.setItem("username", username);
      // alert("Login successful!");
      navigate("/taskList", { state: { username } });
    } else {
      const newUsernames = [...storedUsernames, username];
      const newPasswords = [...storedPasswords, password];
      localStorage.setItem("usernames", JSON.stringify(newUsernames));
      localStorage.setItem("passwords", JSON.stringify(newPasswords));
      // alert("Username and password stored in local storage.");
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
          <label className="login-label" htmlFor="username">Username</label>
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
          <label  className="login-label" htmlFor="password">Password</label>
        </div>
        <button
  class="sc-iTONe"
  type="submit"
  style={{
    width: '300px',
    padding: '10px',
    backgroundColor: isLoginDisabled ? '#ffffff' : 'rgb(216, 220, 227)',
    color: 'black',
    border: '1px solid rgb(176, 186, 199)',
    boxShadow: 'none',
    cursor: isLoginDisabled ? 'not-allowed' : 'pointer'
  }}  disabled={isLoginDisabled}
>
  Login
</button>

      </form>
      <br></br>
      <br></br>
      <div class="sc-hTtwUo idTMZw">
        "Non-Production License. If you would like information on production
        usage, please refer to <br></br>our"
        <a
          href="https://camunda.com/legal/terms/camunda-platform/camunda-platform-8-self-managed/"
          target="_blank"
          class="sc-iqcoie dMkxtJ"
        >
          terms & conditions page
        </a>
        "or"
        <a
          href="https://camunda.com/contact/"
          target="_blank"
          class="sc-iqcoie dMkxtJ"
        >
          contact sales
        </a>
      </div>
    </div>
  );
}
 
export default LoginPage;