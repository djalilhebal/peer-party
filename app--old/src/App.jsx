import { useState } from 'react'

import { useAppStore } from './model/store';
import Home from './components/Home'
import Theater from './components/Theater'

import './App.css';

function App() {
  const started = useAppStore(state => state.started);
  api.init();

  return (
    <div className="app">
      {started ?
        (<Theater />)
        :
        (<Home />)
      }
    </div>
  )
}

export default App
