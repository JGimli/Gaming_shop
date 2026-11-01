import { BrowserRouter,Route,Routes,Link } from 'react-router-dom'
import React from 'react'
import './App.css'
import Head from './Head.jsx'
import Foot from './Foot.jsx'
import Core from './Core.jsx'
import { GamePage, Search } from './Search.jsx'


function App(){
  return (
    <BrowserRouter>
      <Head/>
      <nav>
        <Link to="/">Home</Link>
        <Search/>
      </nav>
      <Routes>
        <Route path="/" element={<Core/>} />
        <Route path="/game" element={<GamePage/>} />
        <Route path="/foot" element={<Foot/>} />
      </Routes>
     <Foot/>
    </BrowserRouter>
  )
}

export default App