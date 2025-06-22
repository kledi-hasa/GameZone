import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

interface NavbarProps {
  onAdminClick?: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
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


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Handle input changes for login
  
 
 
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
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
    
    <nav className="navbar navbar-expand-lg" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '15px 0'
    }}>
  <div className="container-fluid">
    <Link className="navbar-brand" to="/" style={{
      color: 'white',
      fontWeight: '700',
      fontSize: '1.8rem',
      textDecoration: 'none',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
    }}>
      🎮 GameZone
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '10px'
    }}>
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '600',
            fontSize: '1.1rem',
            marginRight: '20px',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            padding: '8px 16px'
          }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            const target = e.target as HTMLAnchorElement;
            target.style.color = 'white';
            target.style.background = 'rgba(255, 255, 255, 0.1)';
            target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            const target = e.target as HTMLAnchorElement;
            target.style.color = 'rgba(255, 255, 255, 0.9)';
            target.style.background = 'transparent';
            target.style.transform = 'translateY(0)';
          }}>
            🏠 Home
          </Link>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link" 
            onClick={onAdminClick}
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600',
              fontSize: '1.1rem',
              marginRight: '20px',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }} 
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              const target = e.target as HTMLButtonElement;
              target.style.color = 'white';
              target.style.background = 'rgba(255, 255, 255, 0.1)';
              target.style.transform = 'translateY(-2px)';
            }} 
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              const target = e.target as HTMLButtonElement;
              target.style.color = 'rgba(255, 255, 255, 0.9)';
              target.style.background = 'transparent';
              target.style.transform = 'translateY(0)';
            }}
          >
            🧩 Admin
          </button>
        </li>
        
       
      </ul>
    <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{
      background: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      fontWeight: '600',
      borderRadius: '12px',
      padding: '10px 20px',
      marginRight: '10px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    }} onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      target.style.background = 'rgba(255, 255, 255, 0.3)';
      target.style.transform = 'translateY(-2px)';
      target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    }} onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      target.style.background = 'rgba(255, 255, 255, 0.2)';
      target.style.transform = 'translateY(0)';
      target.style.boxShadow = 'none';
    }}>
  🔐 Login
</button>
    <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#supModal" style={{
      background: 'linear-gradient(45deg, #28a745, #20c997)',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      borderRadius: '12px',
      padding: '10px 20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
    }} onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      target.style.transform = 'translateY(-2px)';
      target.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.4)';
    }} onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      target.style.transform = 'translateY(0)';
      target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
    }}>
 Sign Up
</button>

<div className="modal fade" id="exampleModal">
  <div className="modal-dialog">
    <div className="modal-content" style={{
      borderRadius: '20px',
      border: 'none',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    }}>
      <div className="modal-header" style={{
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        color: 'white',
        borderRadius: '20px 20px 0 0',
        border: 'none',
        padding: '25px 30px'
      }}>
        <h5 className="modal-title" id="exampleModalLabel" style={{fontWeight: '700', fontSize: '1.5rem'}}>🔐 Login</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal" style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}><span>&times;</span></button>
      </div>
      <div className="modal-body" style={{padding: '30px'}}>
  <form className="">
      <div className="modal-body">
  <form className="" onSubmit={handleLogin}>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label" style={{fontWeight: '600', color: '#495057'}}>Email</label>
    <div className="col-sm-6">
      <input type="email" className="form-control" id="inputEmail3" style={{
        borderRadius: '12px',
        border: '2px solid #e9ecef',
        padding: '12px 15px',
        transition: 'all 0.3s ease'
      }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        target.style.borderColor = '#667eea';
        target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
      }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        target.style.borderColor = '#e9ecef';
        target.style.boxShadow = 'none';
      }}/>
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
    <label  className="col-sm-2 col-form-label" style={{fontWeight: '600', color: '#495057'}}>Password</label>
    <div className="col-sm-6">
      <input type="password" className="form-control" id="inputPassword3" style={{
        borderRadius: '12px',
        border: '2px solid #e9ecef',
        padding: '12px 15px',
        transition: 'all 0.3s ease'
      }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        target.style.borderColor = '#667eea';
        target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
      }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        target.style.borderColor = '#e9ecef';
        target.style.boxShadow = 'none';
      }}/>
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
      <div className="modal-footer" style={{padding: '20px 30px', borderTop: '1px solid rgba(0, 0, 0, 0.05)'}}>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: '600'
        }}>Close</button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}>Login</button>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={handleLogin} >Login</button>
      </div>
    </div>
  </div>
</div>
<div className="modal fade" id="supModal">
  <div className="modal-dialog">
    <div className="modal-content" style={{
      borderRadius: '20px',
      border: 'none',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    }}>
      <div className="modal-header" style={{
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        color: 'white',
        borderRadius: '20px 20px 0 0',
        border: 'none',
        padding: '25px 30px'
      }}>
        <h5 className="modal-title" id="exampleModalLabel" style={{fontWeight: '700', fontSize: '1.5rem'}}>📝 Sign Up</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal" style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}><span>&times;</span></button>
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Sign Up</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal"><span>&times;</span></button>
      </div>
      <div className="modal-body" style={{padding: '30px'}}>
  <form className="" onSubmit={handleSubmit}>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label" style={{fontWeight: '600', color: '#495057'}}>Email</label>
    <div className="col-sm-6">
      <input type="email" className="form-control" id="inputEmail3" 
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ 
            marginRight: "0.5rem",
            borderRadius: '12px',
            border: '2px solid #e9ecef',
            padding: '12px 15px',
            transition: 'all 0.3s ease'
          }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#667eea';
            target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
          }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#e9ecef';
            target.style.boxShadow = 'none';
          }}/>
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
          style={{ 
            marginRight: "0.5rem",
            borderRadius: '12px',
            border: '2px solid #e9ecef',
            padding: '12px 15px',
            transition: 'all 0.3s ease'
          }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#667eea';
            target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
          }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#e9ecef';
            target.style.boxShadow = 'none';
          }}/>
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
    <label  className="col-sm-2 col-form-label" style={{fontWeight: '600', color: '#495057'}}>Password</label>
    <div className="col-sm-6">
      <input type="password" className="form-control" id="inputPassword3"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ 
            marginRight: "0.5rem",
            borderRadius: '12px',
            border: '2px solid #e9ecef',
            padding: '12px 15px',
            transition: 'all 0.3s ease'
          }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#667eea';
            target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
          }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#e9ecef';
            target.style.boxShadow = 'none';
          }}/>
    </div>
  </div>
  <br></br>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label" style={{fontWeight: '600', color: '#495057'}}>FullName</label>
    <div className="col-sm-6">
      <input type="text" className="form-control" id="inputName" 
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ 
            marginRight: "0.5rem",
            borderRadius: '12px',
            border: '2px solid #e9ecef',
            padding: '12px 15px',
            transition: 'all 0.3s ease'
          }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#667eea';
            target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
          }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            target.style.borderColor = '#e9ecef';
            target.style.boxShadow = 'none';
          }}/>
    </div>
  </div>
</form>
{message && <p style={{ marginTop: "1rem", color: '#28a745', fontWeight: '600' }}>{message}</p>}
      </div>
      <div className="modal-footer" style={{padding: '20px 30px', borderTop: '1px solid rgba(0, 0, 0, 0.05)'}}>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: '600'
        }}>Close</button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}>Sign Up</button>
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
