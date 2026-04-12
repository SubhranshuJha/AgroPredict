import React from 'react'
import PriceGraph from '../Components/PriceGraph'

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <PriceGraph commodityName="Wheat" days={30}  />
    </div>
  )
}

export default Login
