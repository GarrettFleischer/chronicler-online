import React from 'react';
import { Link } from 'react-router-dom';

// Home page Component. This serves as the welcome page with link to the library
const NotFound = () => (
  <div className="not-found">
    <h1>The specified resource could not be found</h1>
    <div>
      <Link to="/">
        <button className="btn btn-lg btn-primary">Return Home</button>
      </Link>
    </div>
  </div>
);

export default NotFound;
