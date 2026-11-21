import { BrowserRouter,Route,Routes,Link } from 'react-router-dom'
import React from 'react'
import './App.css'
import Head from './Head.jsx'
import Foot from './Foot.jsx'
import Core from './Core.jsx'
import { GamePage, Search } from './Search.jsx'
import { CartProvider, useCart } from './CartContext.jsx'
import CartPage from './CartPage.jsx'

function AppContent(){
  const { itemCount } = useCart()

  return (
    <>
      <Head/>
      <nav>
        <Link to="/">Home</Link>
        <div className="nav-actions">
          <Search/>
          <Link className="cart-link" to="/cart" aria-label={`Shopping cart with ${itemCount} items`}>
              Cart {itemCount == 0 ? "":itemCount}
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Core/>} />
        <Route path="/game" element={<GamePage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/foot" element={<Foot/>} />
      </Routes>
      <Foot/>
    </>
  )
}


function App(){
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent/>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App