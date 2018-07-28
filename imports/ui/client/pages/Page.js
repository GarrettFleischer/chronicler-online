import PropTypes from 'prop-types';
import React from 'react';
import { Header } from '../components/app/Header';


export const Page = ({ children }) => (
  <div>
    <Header key="header" />
    {/* provide a new key to force the animation to trigger */}
    {children}
  </div>
);

Page.propTypes = { children: PropTypes.node.isRequired };
