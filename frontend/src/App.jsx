import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
const [email, setEmail] = useState("");
const [ emailValid, setEmailValid ] = useState (null);
const [password, setPassword] = useState("");
const [ passwordValid, setPasswordValid ] = useState (null);

const validateEmail = (value) => {
  const isValid  = /^[^s@]+@[^\s@]+\.[^s@]+$/.test(value);
  setEmailValid(isValid);
  return isValid;
}

const validatePassword = (value) => {
  const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
  setPasswordValid(isValid);
  return isValid;
}


const handleSubmit = (e) => {
e.preventDefault();
const isEmailOk = validateEmail (email);
const isPasswordOk = validatePassword (password);

if(!isEmailOK || !isPasswordOk) {
  toast.error ("Please enter valid email and password.");
} else {
  toast.success ("Login successful!");
}
};


  return (
     <div className= "app-container">
   <form className="login-form">
<div className='form-header'>
  <h1>Login</h1>
  <p>Welcome to StudyBug!</p>
</div>

<div className='input-Wrapper'>
  <label htmlFor='email'>Email</label>
  <input type='text' id='email' name='email' placeholder='Enter your email' required
  value={email} 
  onChange={(e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  }} />

{emailValid === false && email.trim() !== "" && (
  <span className="error"> The email format is not valid</span>
)}

</div>

<div className='input-Wrapper'>
  <label htmlFor='password'>Password</label>
  <input type='password' id='password'  placeholder='Enter your password' required 
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  }} />
  
  {passwordValid === false && password.trim() !== "" && (
<spam className='error'>Password must be at least 8 chracters long and
    include both numbers and letters.  </spam>

  )} 

</div>

<button>
  Login
  <FaSignInAlt/>
  </button>

   </form>


<ToastContainer position="top-right" autoclose={3000} />
  </div>
  );
};

export default App;