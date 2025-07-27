import React, { useState } from "react";
import styles from "./Login.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";

import { toast } from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  const loadingToast = toast.loading("Logging in...");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const idTokenResult = await user.getIdTokenResult(true);

    if (idTokenResult.claims.admin) {
      toast.success("✅ Welcome Admin!", { id: loadingToast });
      navigate("/dashboard");
    } else {
      toast.error("❌ Not authorized", { id: loadingToast });
      auth.signOut();
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("⚠️ Invalid credentials or network issue", { id: loadingToast });
  }
};

  return (
    <div className={styles.loginContainer}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
