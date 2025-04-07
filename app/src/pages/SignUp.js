import { useState } from "react";
import Api from "./../api/auth";

const Signup = () => {
  const [otp, setOtp] = useState(false)
  const [form, setForm] = useState({
    user: "",
    name: "",
    email: "",
    password: "",
  });

  // const [otpForm, setOtpForm] = 

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { name: `${form.name}`, password: `${form.password}`, email: `${form.email}` }
      console.log(data);
      const url = `/api/auth/${form.user}/signup`
      const res = await Api(url, {data});
      const content = res.content;
      if (content.type === "ok") {
        setOtp(true);
        alert("OTP sent! Please verify.");
      } else if(content.type === "invalid") {
        setOtp(true);
      }
        else{
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
      console.log(form);
      const res = await Api(`/api/auth/${form.user}/verify-otp`, { form });
      const { content } = res.data;
      if (content.type === "ok") {
        alert("User registered");
      } else {
        alert(content.detail);
      }
    } catch (err) {
      alert("Signup error");
    }
  }

  return (
    <div>
      {!otp ? (
        <form onSubmit={handleSubmit}>
          <input name="user" placeholder="user" onChange={handleChange} />
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Sign Up</button>
        </form>
      ): (
      <div>
        <form onSubmit={handleSubmit}>
          <input name="user" placeholder="user" onChange={handleChange} />
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      )}
    </div>
  );
};

export default Signup;