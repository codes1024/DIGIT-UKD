import React from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import LandingPage from './components/LandingPage';


function App() {
  return (
    
    <Grid className="app-grid">
    <LandingPage />
    </Grid>
  );
}
export default App;