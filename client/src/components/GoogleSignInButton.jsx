import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

function GoogleSignInButton({ onSuccess }) {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: credentialResponse.credential,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        onSuccess?.();
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.error("Google Login Failed")}
      theme="filled_dark"
      shape="pill"
      size="large"
    />
  );
}

export default GoogleSignInButton;