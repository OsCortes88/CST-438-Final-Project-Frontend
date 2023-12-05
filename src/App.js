import './App.css';
import React from 'react';
import Login from './components/Login';
import MainPage from './components/MainPage';
import { BrowserRouter, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';

function App() {
  return(
    <div className="App">
    <BrowserRouter>
      <Switch>
        {/* defining all routes, by default App returns login path */}
        <Route exact path="/" component={Login}/>
        <Route path="/mainpage" component={MainPage}/>
      </Switch>
    </BrowserRouter>
    </div>
  );
}
export default App;