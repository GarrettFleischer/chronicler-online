import React from 'react';
import { Link } from 'react-router-dom';

// HomePage page Component. This serves as the welcome page with link to the library
const HomePage = () => (
  <div className="jumbotron center">
    <h1 className="lead">Welcome to Chronicler </h1>
    <div>
      Description here
    </div>
    <div style={{ marginTop: '15px' }}>
      List of popular public projects here
    </div>
  </div>
);

export default HomePage;
