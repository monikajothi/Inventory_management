import { useState } from "react";
import { auth, sendPasswordResetEmail } from "../firebaseConfig";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email); // ✅ Pass 'auth' and 'email'
      setMessage("Check your email for password reset instructions.");
    } catch (err) {
      setMessage("Failed to send reset email. Please try again.");
      console.error("Error sending password reset email:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleReset}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;

