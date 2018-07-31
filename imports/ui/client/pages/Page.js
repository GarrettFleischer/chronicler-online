import PropTypes from 'prop-types';
import React from 'react';
import { Header } from '../components/app/Header';


export const Page = ({ children }) => (
  <div style={{ height: '100%' }}>
    <Header key="header" />
    {children}
  </div>
);

Page.propTypes = { children: PropTypes.node.isRequired };
