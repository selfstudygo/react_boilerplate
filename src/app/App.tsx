import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoute } from '@app/App.route';

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppRoute />
      </div>
    </Router>
  );
};

export default App;
