import React from 'react';
import { Link } from 'react-router-dom';

// Shows an error message and a button to return to the main menu
// TODO integrate with intl
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
