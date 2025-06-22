import { useState } from 'react'
import '../App.css'

export default function Navbar() {
// Signup form data
const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

// Login form data
const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for form submission message (optional)
  const [message, setMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Handle input changes for signup


  // Handle input changes for login
  
 
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation example
    if (!loginData.email || !loginData.password) {
      setLoginMessage("Please fill in all fields.");
      return;
    }

    try {
      // Fetch users from db.json
      const response = await fetch('/db.json');
      const data = await response.json();
      
      // Find user with matching email and password
      const user = data.users.find(
        u => u.email === loginData.email && u.password === loginData.password
      );

      if (user) {
        setLoginMessage("Login successful!");
        console.log("User logged in:", user);
        
        // Optionally reset form
        setLoginData({
          email: "",
          password: "",
        });
        
        // You can add logic here to store user session, redirect, etc.
        alert(`Welcome back, ${user.username}!`);
        
      } else {
        setLoginMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginMessage("Login failed. Please try again.");
    }
  };

  // Handle signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation example
    if (!formData.username || !formData.email || !formData.password) {
      setMessage("Please fill in all fields.");

    
      return;
    }
   
      

    // You can add API call here to register user
    console.log("Signup form submitted:", formData);

    setMessage("Signup successful!");
    
    // Optionally reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      role: formData.username=="admin" ? "admin" : "user"
    });

try {

      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('User registered successfully!');
      } else {
        alert('Error registering user.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">GameZone</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        
       
      </ul>
    <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Login
</button>
    <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#supModal">
 Sign Up
</button>

<div className="modal fade" id="exampleModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Login</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal"><span>&times;</span></button>
      </div>
      <div className="modal-body">
  <form className="" onSubmit={handleLogin}>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-6">
      <input 
        type="email" 
        className="form-control" 
        id="loginEmail"
        name="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleLoginChange}
      />
    </div>
  </div>
<br></br>
  <div className="input-group row">
    <label  className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-6">
      <input 
        type="password" 
        className="form-control" 
        id="loginPassword"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleLoginChange}
      />
    </div>
  </div>
</form>
{loginMessage && <p style={{ marginTop: "1rem", color: loginMessage.includes("successful") ? "green" : "red" }}>{loginMessage}</p>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={handleLogin} >Login</button>
      </div>
    </div>
  </div>
</div>
<div className="modal fade" id="supModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Sign Up</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal"><span>&times;</span></button>
      </div>
      <div className="modal-body">
  <form className="" onSubmit={handleSubmit}>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-6">
      <input type="email" className="form-control" id="inputEmail3" 
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
<br></br>
 <div className="input-group row ">
    <div className="col-sm-6">
      <input type="hidden" className="form-control" id="roli" 
          name="role"
        
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
  <br></br>
  <div className="input-group row">
    <label  className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-6">
      <input type="password" className="form-control" id="inputPassword3"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
  <br></br>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label">FullName</label>
    <div className="col-sm-6">
      <input type="text" className="form-control" id="inputName" 
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
</form>
{message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}  >Sign Up</button>
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
</nav>
  )
}
