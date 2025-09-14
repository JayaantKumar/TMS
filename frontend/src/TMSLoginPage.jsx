import React, { useState, useEffect } from "react";

const backgroundImages = [
  "https://tse1.mm.bing.net/th/id/OIP.raxJw0DRpizy6Xoi8g2CkgHaE8?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.3KsWQvvT00xnWiQyNLADHgHaEK?pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th/id/OIP.lPRGW7I2TSR-GfaC0Y4hlgHaE7?pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th/id/OIP.lIWgMLUyGsdpOyx8TuTaYwHaEK?pid=Api&P=0&h=180",
];

const TMSLoginPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRegister, setIsRegister] = useState(false); // toggle login/register
  const [form, setForm] = useState({
    userId: "",
    password: "",
    username: "",
    email: "",
    firstName: "",
    lastName: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // login or register submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(isRegister ? "Creating account..." : "Logging in...");

    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isRegister
        ? {
            username: form.username,
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
          }
        : {
            identifier: form.userId, // ✅ backend expects "identifier"
            password: form.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Request failed");
        return;
      }

      if (!isRegister) {
        localStorage.setItem("token", data.data.token);
        setMessage("✅ Login successful");
        console.log("User:", data.data.user);
        // window.location.href = "/dashboard";
      } else {
        setMessage("✅ Account created successfully, you can login now");
        setIsRegister(false);
      }
    } catch (err) {
      setMessage("❌ Server error, try again later");
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center text-white">
      {/* background slideshow */}
      {backgroundImages.map((imageUrl, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Login/Register box */}
      <main className="z-10 flex-grow flex justify-center items-center w-full p-4">
        <div className="bg-[#d8a56d]/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md text-gray-800">
          <h2 className="text-xl font-bold text-center mb-4">
            {isRegister ? "Create Account" : "Login"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegister ? (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </>
            ) : (
              <input
                type="text"
                name="userId"
                placeholder="User ID or Email"
                value={form.userId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-700 font-semibold"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>

          {message && (
            <p className="mt-4 text-center text-sm font-semibold text-red-600">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TMSLoginPage;
