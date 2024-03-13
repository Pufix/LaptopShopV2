import React from 'react';
import { useState } from 'react';

export default function Laptop(nme){
    const [name, setName] = useState(nme);

    const getLaptopName = () => {
        return name;
    }

    const setLaptopName = (name) => {
        setName(name);
    }

    return {
        getLaptopName,
        setLaptopName
    }

    
}