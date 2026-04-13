import React from 'react'
import PriceGraph from '../Components/PriceGraph'
import { useParams } from 'react-router-dom'

function CommodityInfo() {
  const {commodityId} = useParams()
  return (
    <>
    <div>CommodityInfo</div>
    <PriceGraph commodityName={commodityId}/>
    
    </>
  )
}

export default CommodityInfo