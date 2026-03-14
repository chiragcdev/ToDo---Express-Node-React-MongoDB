import { Link, useNavigate } from 'react-router-dom'
import '../assets/style/navbar.css'
import { useState } from 'react';
import { useEffect } from 'react';


function NavBar() {
    const navigate = useNavigate();
    const [login, setLogin] = useState(localStorage.getItem('login'));

    const logout = () => {
        localStorage.removeItem('login');
        setLogin(null);
        setTimeout(() => {
            navigate('/login');
        }, 0);        
    }

    useEffect(() => {
        const handleStorageChange = () => {
            setLogin(localStorage.getItem('login'));
        }
        window.addEventListener('localStorage-change', handleStorageChange);
        return () => {
            window.removeEventListener('localStorage-change', handleStorageChange);
        }
    }, [])

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">ToDo App</Link>
            <ul className="navbar-nav">
                {
                    login ? 
                    <>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">List</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add" className="nav-link">Add Task</Link>
                        </li>
                        <li className="nav-item">
                            <Link onClick={logout} className="nav-link">Logout</Link>
                        </li>
                    </>: null
                }            
            </ul>   
        </nav>
    )
}   

export default NavBar;