import { createContext, useEffect, useState } from 'react';
import Laptop from "../classes/laptop";
import Manufacturer from "../classes/manufacturer";
import React,{ useContext } from 'react';

export const LaptopContext = createContext();

export function ServerState(){
    const serverResponse = useContext(LaptopContext);
    return serverResponse;
}

export function SetServerResponse(){
    const setServerResponse = useContext(LaptopContext);
    return setServerResponse;
}

export function LaptopArray(){
    const laptopArray = useContext(LaptopContext);
    return laptopArray.laptopArray;
}

export function AddLaptop(){
    const addLaptop = useContext(LaptopContext);
    return addLaptop.addLaptop;
}

export function RemoveLaptop(){
    const removeLaptop = useContext(LaptopContext);
    return removeLaptop.removeLaptop;
}

export function Manufacturers(){
    const manufacturers = useContext(LaptopContext);
    return manufacturers.manufacturers;
}

export function AddManufacturer(){
    const addManufacturer = useContext(LaptopContext);
    return addManufacturer.addManufacturer;
}

export function RemoveManufacturer(){
    const removeManufacturer = useContext(LaptopContext);
    return removeManufacturer.removeManufacturer;
}




export function LaptopProvider({ children }) {
    const [laptopArray, setLaptops] = useState([]);
    const [serverResponse, setServerResponse] = useState(true);
    const [manufacturers, setManufacturers] = useState([]);
    useEffect(() =>{
        const fetchManufacturers = async () => {
            const response = await fetch('http://127.0.0.1:5000/manufacturers');
            if (!response.ok) {
                setServerResponse(false);
                console.log("FAILED TO FETCH");
                throw new Error('Failed to fetch data');
            }
            response.json().then(data => {
                data.forEach((manufacturer) => {
                    const newManufacturer = new Manufacturer(manufacturer.id, manufacturer.name);
                    setManufacturers(prevManufacturers => [...prevManufacturers, newManufacturer]);
                });
            });
            
        }
                
        const fetchData = async () => {
            const response = await fetch('http://127.0.0.1:5000/laptops');
            if (!response.ok) {
                setServerResponse(false);
                console.log("FAILED TO FETCH");
                throw new Error('Failed to fetch data');
            }
            response.json().then(data => {
                data.forEach((laptop) => {
                    const newLaptop = new Laptop(laptop.id, laptop.name, laptop.cpu, laptop.gpu, laptop.ram, laptop.storage, laptop.price, laptop.manufacturer_id);
                    setLaptops(prevLaptops => [...prevLaptops, newLaptop]);
                });
            });
        }
        const testServer = async () => {
            const timeout = setTimeout(() => {
                console.log('Server is down');
                setServerResponse(false);
            }, 3000);
            const response = await fetch('http://127.0.0.1:5000/test')
                .then(() => {
                    console.log('Server is up');
                    setServerResponse(true);
                    clearTimeout(timeout);
                    fetchData();
                    fetchManufacturers();
                })
                .catch(() => {
                    console.log('Server is down');
                    setServerResponse(false);
                    return (
                        <div>
                            <h1>Server is down</h1>
                        </div>
                    );
                });
        }
        testServer();
    }, []);
    
    const addLaptop = (laptop) => {
        setLaptops(prevLaptops => [...prevLaptops, laptop]);
    };

    const removeLaptop = (id) => {
        setLaptops(prevLaptops => prevLaptops.filter((laptop) => laptop.getId() !== id));
    };

    const addManufacturer = (manufacturer) => {
        setManufacturers(prevManufacturers => [...prevManufacturers, manufacturer]);
    };

    const removeManufacturer = (id) => {
        setManufacturers(prevManufacturers => prevManufacturers.filter((manufacturer) => manufacturer.getId() !== id));
    };
    

    return (
        <LaptopContext.Provider value={{ laptopArray, addLaptop, removeLaptop, serverResponse, setServerResponse, addManufacturer, removeManufacturer, manufacturers }}>
            {serverResponse ? null : <h1 style={{color: 'red'}}>Server is down</h1>}
            {children}
        </LaptopContext.Provider>
    );
}