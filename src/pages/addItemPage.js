import Laptop from '../classes/laptop';
import React from 'react';
import { Layout } from '../shared/components/layout';
import { useState } from 'react';
import { useContext } from 'react';
import { LaptopContext } from '../contexts/laptopcontext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LaptopArray, AddLaptop, RemoveLaptop } from '../contexts/laptopcontext';
import { Manufacturers, AddManufacturer, RemoveManufacturer } from '../contexts/laptopcontext';
import Manufacturer from '../classes/manufacturer';

export default function AddItemPage(props){
    const laptopArray = LaptopArray();
    const [name, setName] = useState('');
    const [cpu, setCpu] = useState('');
    const [gpu, setGpu] = useState('');
    const [ram, setRam] = useState('');
    const [storage, setStorage] = useState('');
    const [price, setPrice] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [failedReq, setFailedReq] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [manufacturer_id, setManufacturerId] = useState('');
    const addLaptop = AddLaptop();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const lastId = laptopArray[laptopArray.length - 1].getId()+1;
        
        const laptop = new Laptop(lastId, name, cpu, gpu, ram, storage, price, manufacturer_id);
        //make a post request to the server
        setIsPending(true);
        setFailedReq(false);
        fetch ('http://127.0.0.1:5000/laptops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(laptop),
        }).then((response) =>{
            console.log(response);
            if (!response.ok){
                setFailedReq(true);
                setErrorMsg(response.statusText)
            }else{
                addLaptop(laptop);
                navigate('/');
            }
            setIsPending(false);
            
        });
    }
    const manufacturers = Manufacturers();
    const addManufacturer = AddManufacturer();
    const removeManufacturer = RemoveManufacturer();
    const [manufacturerName, setManufacturerName] = useState('');
    const [isPendingManufacturer, setIsPendingManufacturer] = useState(false);
    const [failedReqManufacturer, setFailedReqManufacturer] = useState(false);
    const [errorMsgManufacturer, setErrorMsgManufacturer] = useState('');
    const handleSubmitManufacturer = (e) => {
        e.preventDefault();
        const lastId = manufacturers[manufacturers.length - 1].getId()+1;
        const manufacturer = new Manufacturer(lastId, manufacturerName);
        //make a post request to the server
        setIsPendingManufacturer(true);
        setFailedReqManufacturer(false);
        fetch ('http://127.0.0.1:5000/manufacturers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manufacturer),
        }).then((response) =>{
            console.log(response);
            if (!response.ok){
                setFailedReqManufacturer(true);
                setErrorMsgManufacturer(response.statusText)
            }else{
                addManufacturer(manufacturer);
                navigate('/');
            }
            setIsPendingManufacturer(false);
        });
    }
    return(
        <Layout>
            <h1>Add Laptop</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br></br>
                <label>
                    CPU:
                    <input type="text" value={cpu} onChange={(e) => setCpu(e.target.value)} />
                </label>
                <br></br>
                <label>
                    GPU:
                    <input type="text" value={gpu} onChange={(e) => setGpu(e.target.value)} />
                </label>
                <br></br>
                <label>
                    RAM:
                    <input type="text" value={ram} onChange={(e) => setRam(e.target.value)} />
                </label>
                <br></br>
                <label>
                    Storage:
                    <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} />
                </label>
                <br></br>
                <label>
                    Price:
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <br></br>
                <label>
                    Manufacturer_id:
                    <input type="text" value={price} onChange={(e) => setManufacturerId(e.target.value)} />
                </label>
                <br></br>
                {!isPending && <button type="submit">Add Laptop</button>}
                {isPending && <button disabled>Pending...   </button>}
                {failedReq && <p>Failed to add laptop</p>}
                {errorMsg && <p>{errorMsg}</p>}
            </form>
            <br></br>
            <h1>Add Manufacturer</h1>
            <form onSubmit={handleSubmitManufacturer}>
                <label>
                    Name:
                    <input type="text" value={manufacturerName} onChange={(e) => setManufacturerName(e.target.value)} />
                </label>
                <br></br>
                {!isPendingManufacturer && <button type="submit">Add Manufacturer</button>}
                {isPendingManufacturer && <button disabled>Pending...   </button>}
                {failedReqManufacturer && <p>Failed to add manufacturer</p>}
                {errorMsgManufacturer && <p>{errorMsgManufacturer}</p>}
            </form>
        </Layout>
    );

}