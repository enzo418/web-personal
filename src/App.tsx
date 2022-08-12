import React, { useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import InterpretePage from './pages/InterpretePage';

function App() {
    return (
        <div className="App">
            <InterpretePage />
            {/* <HomePage /> */}
        </div>
    );
}

export default App;
