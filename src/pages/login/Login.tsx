import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AppDispatch, RootState } from "../../app/store";
import { loginUser } from "../../features/auth/authSlice";
import styles from "./Login.module.scss";
import { isTokenExpired } from "../../utils/utils";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize navigate

  const { loading, error, accessToken } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  // Redirect to home if login is successful
  useEffect(() => {
    if (accessToken && !isTokenExpired(accessToken)) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [accessToken, navigate]);

  return (
    <main className={styles.login}>
      <div className={styles.container}>
        <div className={styles.title}>Login</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Username"
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          {accessToken && <p className={styles.success}>Login successful!</p>}
        </form>
      </div>
    </main>
  );
};

export default Login;
