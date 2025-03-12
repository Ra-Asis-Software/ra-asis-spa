import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
    const [user, setUser] = useState(null); // State to store data for a user
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(""); // State for error handling
    const navigate = useNavigate();

    // Fetch the user's data from the token
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // Decode token to obtain user's data
                const decoded = jwtDecode(token);
                const { firstName, lastName, role } = decoded;

                // Set the user's data in state
                setUser({ firstName, lastName, role });
                setLoading(false);
            } catch (error) {
                setError("Your details could not be found. Please try to log in again.");
                setLoading(false);
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    // Either display loading or error state
    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return <div className="loading-error">{error}</div>;
    }

    // Create role specific content
    const renderRoleSpecificContent = () => {
        switch (user.role) {
            case "student":
                return <p>Welcome to your student dashboard! Here you can track your progress and access resources.</p>;
            case "teacher":
                return <p>Welcome to your teacher dashboard! Manage your classes and monitor student performance.</p>;
            case "parent":
                return <p>Welcome to your parent dashboard! Stay updated on your child's progress and activities.</p>;
            default:
                return <p>Welcome to your dashboard! That's strange...You do not have a specific role assigned on the system. Checking your details...</p>;
        }
    };

    return(
        <div className="dashboard">
            <h2>Dashboard</h2>
            <h3>Hello {user?.lastName} or should I call you {user?.firstName} ?</h3>
            {renderRoleSpecificContent()}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;