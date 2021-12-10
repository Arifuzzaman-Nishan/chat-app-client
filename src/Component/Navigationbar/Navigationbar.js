import React from 'react';
import { Link } from "react-router-dom";
import '../../App.css';

export default function Navigationbar({sessionToken,setsessionToken}) {
    // for log out...
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setsessionToken("");
    }
    return (
        <div>
            <div className="menu">
                {
                    !sessionToken && <div className="menu-item">
                    <Link to="/">Login</Link>
                    </div>
                }
                <div className="menu-item">0
                    <Link to="/inbox">Inbox</Link>
                </div>
                {
                    sessionToken && <div className="menu-item">
                    <Link onClick={handleLogout} to="/">
                        <span className="text-secondary fw-bold">{sessionToken} - </span> 
                        Logout
                    </Link>
                </div>
                }
            </div>
        </div>
    );
}
