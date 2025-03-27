import { useAuth0 } from "@auth0/auth0-react";

import { LoginPageLogoIcon } from "../../assets/Icons";
import styles from "./Login.module.css";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.login} data-name="login">
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.heroContainer}>
        <LoginPageLogoIcon className={styles.logo} />
        <h1>cascarita</h1>
      </div>
      <div className={styles.loginContainer}>
        <h3 className={styles.loginHeader}>Welcome to cascarita</h3>
        <div>
          <p className={styles.loginSubheading}>
            Please sign up or login below to get started
          </p>
          {/* {fail ? <p>Login failed, please try again.</p> : <></>} */}
        </div>

        <div className={styles.authContainer}>
          <button
            className={styles.btn}
            onClick={() => {
              loginWithRedirect();
            }}>
            Sign in
          </button>
          <p>
            {"Don't have an account? "}
            <button
              className={styles.signUpBtn}
              onClick={() => {
                loginWithRedirect();
              }}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
