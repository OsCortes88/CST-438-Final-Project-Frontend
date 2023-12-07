import './App.css';
import React from 'react';
import Login from './components/Login';
import MainPage from './components/MainPage';
import SignUp from "./components/SignUp";
import { BrowserRouter, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import WishList from './components/WishList';

function App() {
  return(
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* defining all routes, by default App returns login path */}
          <Route exact path="/" component={Login}/>
          <Route path="/mainpage" component={MainPage}/>
          <Route pathe="/wishlist" component={WishList}/>
          <Route path="/signup" component={SignUp}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;