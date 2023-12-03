import './App.css';
import React from 'react';
import Login from './components/Login';
import SignUp from "./components/SignUp";
import { Switch, Route, BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* defining all routes, by default App returns login path */}
          <Route exact path="/" component={Login}/>
          <Route path="/signup" component={SignUp}/>
        </Switch>
      </BrowserRouter>
    </div>
  )
}
export default App;