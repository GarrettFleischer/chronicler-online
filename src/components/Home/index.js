import React from 'react';
import { Link } from 'react-router-dom';

// Home page Component. This serves as the welcome page with link to the library
const HomePage = () => (
  <div className="jumbotron center">
    <h1 className="lead">Welcome to Chronicler </h1>
    <div>
      <Link to="node/2">
        <button className="btn btn-lg btn-primary">View Node</button>
      </Link>
    </div>
  </div>
);

export default HomePage;
