import React from 'react';
import TestForm from './TestForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>

      <section className="App-content">
        <h2>Enter your token below:</h2>
        <TestForm />
      </section>
    </div>
  );
}

export default App;
