import React, { useEffect, useState } from 'react'
import { useParams } from "react-router"
import { DigitalProduct } from '../../../types';
import { useDigitalProducts } from '../../../../lib/digital-products';
function DigitalProductPage() {

    const {id} = useParams<{id: string}>();
    
    const  DigitalProducts = useDigitalProducts([id])
    const DigitalProduct = DigitalProducts?.find(dp => dp.id === id)

    return (
        
    <div> { JSON.stringify(DigitalProduct?.medias, null,"\n")}</div>
  )
}

export default DigitalProductPage