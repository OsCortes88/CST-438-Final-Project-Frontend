import './SignUp.css';
import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom/cjs/react-router-dom.min'

function SignUp () {
    const[user, setUser] = useState({email:'', firstName:'', lastName:'', password:''});
    const history = useHistory();

    const onChange = (event) => {
        console.log("change");
        setUser({...user, [event.target.name] : event.target.value});
    }

    const signUp = async () => {
      try {
        // Do post to /signup
        const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // send inputted account info
            body: JSON.stringify(user),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        // result will either be true or false
        const res = await response.json();
        // if backend responds with true, signup was successful
        if(res) {
            // redirect user to login
            history.push('/');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const linkStyle ={
        textAlign: 'center',
        color: "#212126",
        fontFamily: 'Raleway',
        fontSize: "10pt",
        marginTop: "16px",
        textDecoration: "none"
    };

    return(
        <div id="login_body">
                <div id='card'>
                    <div id='card_content'>
                        <div id='card_title'>
                            <h2>SignUp</h2>
                            <div className="underline_title"></div>
                        </div>
                        <form className="form" onSubmit={(e) => { e.preventDefault(); signUp();}}>
                            <label id='email' htmlFor='email'>
                                Email
                            </label>
                            <input
                                type="text"
                                className="form_content"
                                name='email'
                                value={user.email} 
                                onChange={onChange}
                            />
                            <div className='form_border'></div>
                            <label id='firstName' htmlFor='first name'> 
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form_content"
                                name='firstName'
                                value={user.firstName} 
                                onChange={onChange}
                            />
                            <div className='form_border'></div>
                            <label id='lastName' htmlFor='last name'> 
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="form_content"
                                name='lastName'
                                value={user.lastName} 
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
                            <input id='submit_btn' type='submit' name='submit' value='Sign Up'></input>
                            <Link to="/" style={linkStyle}>Already have an account? Log In</Link>
                        </form>
                    </div>
                </div>
            </div>
    );
}
export default SignUp;