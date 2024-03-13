import Laptop from "../classes/laptop";
import React from "react";
import { useState } from "react";

function CreateInitialLaptops(){
    return [
        new Laptop("Laptop Asus"),
        new Laptop("Laptop Lenovo"),
        new Laptop("Laptop Acer"),
    ];
}

export default function Repo(){
    const initialLaptops = [
        "Laptop Asus",
        "Laptop Lenovo",
        "Laptop Ceapa",
        "Ion"
    ];

    const [laptops, setLaptops] = useState(CreateInitialLaptops());

    const addLaptop = (name) => {
        const laptop = new Laptop(name);
        setLaptops([...laptops, laptop]);
    }

    const getLaptops = () => {
        return laptops;
    }

    return {
        addLaptop,
        getLaptops
    }
}
