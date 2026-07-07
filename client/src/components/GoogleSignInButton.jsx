import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function GoogleSignInButton() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: tokenResponse.access_token,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.error("Google Login Failed"),
  });

  return (
    <button
      onClick={() => loginWithGoogle()}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 15.02 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3c.9-2.7 3.4-4.46 6.64-4.46z"
        />
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.88c2.18-2.01 3.7-4.97 3.7-8.7z"
        />
        <path
          fill="#FBBC05"
          d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.84 0 11.01 0 12.3s.54 3.46 1.5 5.4l3.86-3z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.88c-1.04.7-2.37 1.12-4.23 1.12-3.24 0-5.74-1.76-6.64-4.46l-3.86 3C3.4 20.35 7.35 23 12 23z"
        />
      </svg>
      <span className="tracking-wide">
        {isLoading ? "Connecting..." : "Sign In with Google"}
      </span>
    </button>
  );
}

export default GoogleSignInButton;