import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
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

    const login = () => {
        fetch('http://localhost:8080/login', {
            method:'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify(user)
        })
        .then(res => { 
            const jwtToken = res.headers.get('Authorization');
            if (jwtToken !== null) {
                console.log(jwtToken);
                sessionStorage.setItem("jwt", jwtToken);
                history.push('/mainpage');
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setUserData({...userData,  id: data.id});
            setUserData({...userData,  firstName: data.firstName});
            setUserData({...userData,  lastName: data.lastName});
            setUserData({...userData,  email: data.email});
            setUserData({...userData,  role: data.role});
            console.log(userData);
            sessionStorage.setItem("userInfo", userData);
         })
        .catch(err => console.log(err));
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