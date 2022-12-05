import { useState } from 'react'
import './App.css'
import MainButton from './components/MainButton'

function App() {

  return (
    <div className="App">
      <h1>Auth System - Node JS</h1>
      <MainButton>Ingresar</MainButton>
      <MainButton>Crear cuentas</MainButton>
    </div>
  )
}

export default App
