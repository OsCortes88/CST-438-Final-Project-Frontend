import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import { Link, useHistory } from 'react-router-dom';
function Login() {
    const[user, setUser] = useState({username:'', password:''});
    const[isAuthenticated, setAuth] = useState(false);
    const[userData, setUserData] = useState({id: -1, firstName: '', lastName: '', email: '', password: '', role: ''});
    const history = useHistory();

    // Only changes games once upon loading.
    useEffect(() => {
        document.title = "Gamestore - Login";
    }, [userData])


    const onChange = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    }

    // Changed login to async and added redirct to mainPage here.
    const login = async () => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method:'POST',
                headers: {'Content-Type':'application/json' },
                body: JSON.stringify(user)
            });
            const jwtToken = response.headers.get('Authorization');
            if (jwtToken !== null) {
                console.log(jwtToken);
                sessionStorage.setItem('jwt', jwtToken);
                setAuth(true);
                history.push('/mainpage');
            }
            const data = await response.json();
            console.log(data);
            setUserData({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
            });
            console.log(userData);
            sessionStorage.setItem('userInfo', JSON.stringify(userData));
        }
        catch(err) {
            console.error(err);
        }
    }

    const linkStyle ={
        textAlign: 'center',
        color: "black",
        fontSize: "10pt",
        marginTop: "16px",
        textDecoration: "none",
        transition: 'color 0.3s ease',
        ':hover': {
            color: 'red',
        },
    };

    return (
        <div id="login_body">
            <div id='card'>
                <div id='card_content'>
                    <div id='card_title'>
                        <h2>LogIn</h2>
                        <div className="underline_title"></div>
                    </div>
                    <form className="form" onSubmit={(e) => { e.preventDefault(); login();}}>
                        <label id='username' htmlFor='username'>
                            Email
                        </label>
                        <input
                            type="text"
                            className="form_content"
                            name='username'
                            value={user.username} 
                            onChange={onChange}
                        />
                        <div className='form_border'></div>
                        <label id='password' htmlFor='password'>
                            Password
                        </label>
                        <input
                            type="password"
                            className="form_content"
                            name='password'
                            value={user.password} 
                            onChange={onChange}
                        />
                        <div className='form_border'></div>
                        <input id='submit_btn' type='submit' name='submit' value='Login'></input>
                        <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                        <Link to="/signup" style={linkStyle} id="signup_link">Don't have account yet?</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Login;