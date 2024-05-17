import Laptop from '../classes/laptop';
import React from 'react';
import { Layout } from '../shared/components/layout';
import { useState } from 'react';
import { useContext } from 'react';
import { LaptopContext } from '../contexts/laptopcontext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LaptopArray, AddLaptop, RemoveLaptop } from '../contexts/laptopcontext';
import { Manufacturers, AddManufacturer, RemoveManufacturer} from '../contexts/laptopcontext';
import Manufacturer from '../classes/manufacturer';

function EditLaptopForm(index){
    const laptopArray = LaptopArray();
    const laptop = laptopArray.find((laptop) => laptop.getId() === index);
    const [name, setName] = useState(laptop.getName());
    const [cpu, setCpu] = useState(laptop.getCpu());
    const [gpu, setGpu] = useState(laptop.getGpu());
    const [ram, setRam] = useState(laptop.getRam());
    const [storage, setStorage] = useState(laptop.getStorage());
    const [price, setPrice] = useState(laptop.getPrice());
    const [manufacturer_id, setManufacturer_id] = useState(laptop.getManufacturerId());
    const addLaptop = AddLaptop();
    const removeLaptop = RemoveLaptop();
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [failedReq, setFailedReq] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const laptop = new Laptop(index, name, cpu, gpu, ram, storage, price, manufacturer_id);
        setIsPending(true);
        setFailedReq(false);
        fetch ('http://127.0.0.1:5000/laptops', {
            method: 'PUT',
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
                removeLaptop(index);
                addLaptop(laptop);
                navigate('/');
            }
            setIsPending(false);
            
        });
        addLaptop(laptop);
        navigate('/');
    }

    return(
        <Layout>
            <h1>Edit Laptop</h1>
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
                    <input type='text' value={manufacturer_id} onChange={(e) => setManufacturer_id(e.target.value)}/>
                    
                </label>
                <button type="submit">Edit Laptop</button>
            </form>
        </Layout>
    );
}

function EditManufacturerForm(index){
    const manufacturers = Manufacturers();
    const manufacturer = manufacturers.find((manufacturer) => manufacturer.getId() === index)
    const [name, setName] = useState(manufacturer.getName());
    const addManufacturer = AddManufacturer();
    const removeManufacturer = RemoveManufacturer(); 
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [failedReq, setFailedReq] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const manufacturer = new Manufacturer(index, name);
        setIsPending(true);
        setFailedReq(false);
        fetch ('http://127.0.0.1:5000/manufacturers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manufacturer),
        }).then((response) =>{
            console.log(response);
            if (!response.ok){
                setFailedReq(true);
                setErrorMsg(response.statusText)
            }else{
                removeManufacturer(index);
                addManufacturer(manufacturer);
                navigate('/');
            }
            setIsPending(false);
            
        });
        navigate('/');
    }
    return(<Layout>
         <h1>Edit Manufacturer</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br></br>
                <button type="submit">Edit Laptop</button>
            </form>
    </Layout>);

}

export default function EditItemPage(state){
    const location = useLocation();
    const index = location.state.index;
    if (index >0){
        return EditLaptopForm(index);
    }else{
        return EditManufacturerForm(index*-1);
    }

}