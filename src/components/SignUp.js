import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';

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

    return(
        <div>
            <h1>Sign Up</h1>
            <table>
                <tbody>
                <tr>
                    <td><label htmlFor="emial">Email</label></td>
                    <td><input type="text" name="email" value={user.email} onChange={onChange} /></td>
                </tr>
                <tr>
                    <td><label htmlFor="First name">First Name</label></td>
                    <td><input type="text" name="firstName" value={user.firstName} onChange={onChange} /></td>
                </tr>
                <tr>
                    <td><label htmlFor="Last name">Last Name</label></td>
                    <td><input type="text" name="lastName" value={user.lastName} onChange={onChange} /></td>
                </tr>
                <tr>
                    <td><label htmlFor="password">Password</label></td>
                    <td><input type="text" name="password" value={user.password} onChange={onChange} /></td>
                </tr>
                </tbody>
            </table>
            <br></br>
            <button id="submit" onClick={signUp}>Sign Up</button>
        </div>
    );
}
export default SignUp;