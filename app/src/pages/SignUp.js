import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./../api/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [isotp, setIsOtp] = useState(false);

  const [SignupForm, setSignupForm] = useState({
    user: "",
    name: "",
    email: "",
    password: "",
  });

  const [OtpForm, setOtpForm] = useState({
    otp_code: "",
  });

  const handleSignupChange = (e) =>
    setSignupForm({ ...SignupForm, [e.target.name]: e.target.value });

  // ✅ Fixed this to update the correct state (OtpForm)
  const handleOtpChange = (e) =>
    setOtpForm({ ...OtpForm, [e.target.name]: e.target.value });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: SignupForm.name,
        password: SignupForm.password,
        email: SignupForm.email,
      };
      const res = await Api(`/api/auth/${SignupForm.user}/signup`, { data });
      const content = res.content;

      if (content.type === "ok") {
        setIsOtp(true);
        alert("OTP sent! Please verify.");
      } else if (content.type === "invalid" && content.verdict === "otpfound") {
        alert("OTP already sent");
        setIsOtp(true);
      } else {
        alert(content.detail);
      }
    } catch (err) {
      console.log(err);
      alert("Signup error");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        otp_code: OtpForm.otp_code,
        email: SignupForm.email,
      };
      const res = await Api(`/api/auth/${SignupForm.user}/verify-otp`, { data });
      const content = res.content;
      if (content.type === "ok") {
        alert("User registered successfully");
        navigate("/login"); // ✅ Redirect after success
      } else {
        alert(content.detail);
      }
    } catch (err) {
      console.log(err);
      alert("OTP verification error");
    }
  };

  return (
    <div>
      {!isotp ? (
        <form onSubmit={handleSignupSubmit}>
          <input name="user" placeholder="User" onChange={handleSignupChange} />
          <input name="name" placeholder="Name" onChange={handleSignupChange} />
          <input name="email" placeholder="Email" onChange={handleSignupChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleSignupChange} />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <input name="otp_code" placeholder="OTP Code" onChange={handleOtpChange} />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
