import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="content-area">
        <div className="main-content">
          <div className="dashboard-main-content">
            {children} {/* Home or other content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
