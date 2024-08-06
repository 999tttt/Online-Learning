import React from 'react';
import LayoutDesigner from './components/LayoutDesigner';
import Question_form from './Question_form';

import './styles/styles.css';

function App() {
  return (
    <div className="App">
      <LayoutDesigner />
      <Question_form />
    </div>
  );
}

export default App;