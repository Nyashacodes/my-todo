import React, { useState } from "react";
import "./login.css"; // We'll create this CSS next

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            onLogin({ email, name });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome to My Todo</h2>
                <p>Please simple login to check your entries</p>
                <form onSubmit={handleSubmit}>
                    <label>Name (Optional)</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email (Required)</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
