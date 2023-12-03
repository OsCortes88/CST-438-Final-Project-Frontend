import React, {useState} from 'react';
import MainPage from './MainPage';
import './Login.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Login() {
    const[user, setUser] = useState({username:'', password:''});
    const[isAuthenticated, setAuth] = useState(false);

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
                sessionStorage.setItem("jwt", jwtToken);
                setAuth(true);
            }
        })
        .catch(err => console.log(err));
    }

    if (isAuthenticated) {
        return <MainPage/>;
    } else {
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
                        </form>
                        <br></br>
                        <Link to="/signup">Don't have account yet?</Link>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;