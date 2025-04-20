
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
        navigate("/login");
      } else {
        alert(content.detail);
      }
    } catch (err) {
      console.log(err);
      alert("OTP verification error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <form
          className="card shadow-sm p-4"
          onSubmit={isotp ? handleOtpSubmit : handleSignupSubmit}
        >
          <h1 className="h4 text-center mb-4">
            {isotp ? "Verify OTP" : "Sign Up"}
          </h1>

          {!isotp ? (
            <>
              <div className="mb-3">
                <label htmlFor="user" className="form-label">User</label>
                <input
                  id="user"
                  name="user"
                  type="text"
                  placeholder="User type"
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full name"
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>
            </>
          ) : (
            <div className="mb-3">
              <label htmlFor="otp_code" className="form-label">OTP Code</label>
              <input
                id="otp_code"
                name="otp_code"
                type="text"
                placeholder="Enter OTP"
                onChange={handleOtpChange}
                className="form-control"
                required
              />
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-primary w-100">
              {isotp ? "Verify" : "Sign Up"}
            </button>
          </div>

          {!isotp && (
            <div className="mt-3 text-center">
              <p className="small text-muted">
                Already have an account?{" "}
                <a href="/login" className="text-decoration-none">
                  Log in
                </a>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
