import {Laptop} from '../classes/laptop';
import React from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Routes, Route, browserRouter } from 'react-router-dom';

import { useContext } from 'react';
import {useNavigate} from 'react-router-dom';

import { createContext } from 'react';

import './display.css';

import {Header } from '../shared/components/header';
import {Layout} from '../shared/components/layout';

import {LaptopContext} from '../contexts/laptopcontext';
import EditItemPage from './editItemPage';
import { Chart } from "react-google-charts";
import { Navigate } from 'react-router-dom';
import { LaptopArray, AddLaptop, RemoveLaptop } from '../contexts/laptopcontext';
import { Manufacturers, AddManufacturer, RemoveManufacturer } from '../contexts/laptopcontext';



export default function Display(){
    const laptopArray = LaptopArray();
    const addLaptop = AddLaptop();
    const removeLaptop = RemoveLaptop();
    const manufacturers = Manufacturers();
    const addManufacturer = AddManufacturer();
    const removeManufacturer = RemoveManufacturer(); 
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [failedReq, setFailedReq] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const changeRoute = (index) => {
        let path= './editItemPage';
        navigate(path, { state: { index: index } });
    }
    const deleteButton = (index) => {
        fetch('http://127.0.0.1:5000/laptops/' + index, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) =>{
            console.log(response);
            if (!response.ok){
                setFailedReq(true);
                setErrorMsg(response.statusText)
            }else{
                removeLaptop(index);
            }
            setIsPending(false);
        });
    }
    const deleteButtonManufacturer = (index) => {
        fetch('http://127.0.0.1:5000/manufacturers/' + index, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) =>{
            console.log(response);
            if (!response.ok){
                setFailedReq(true);
                setErrorMsg(response.statusText)
            }else{
                removeManufacturer(index);
            }
            setIsPending(false);
        });
    }

    const [sortBy, setSortBy]= useState ('id');
    const [reversed, setReversed] = useState(false);
    
    const [reversedManufacturer, setReversedManufacturer] = useState(false);
    const [sortByManufacturer, setSortByManufacturer]= useState ('id');

    function changeSortName(){
        if(sortBy === 'name')
            setReversed(!reversed);
        else{
            setSortBy('name');
            setReversed(false);
        }
    }
    function changeSortCpu(){
        if(sortBy === 'cpu')
            setReversed(!reversed);
        else{
            setSortBy('cpu');
            setReversed(false);
        }
    }
    function changeSortGpu(){
        if(sortBy === 'gpu')
            setReversed(!reversed);
        else{
            setSortBy('gpu');
            setReversed(false);
        }
    }
    function changeSortRam(){
        if(sortBy === 'ram')
            setReversed(!reversed);
        else{
            setSortBy('ram');
            setReversed(false);
        }
    }
    function changeSortStorage(){
        if(sortBy === 'storage')
            setReversed(!reversed);
        else{
            setSortBy('storage');
            setReversed(false);
        }
    }
    function changeSortPrice(){
        if(sortBy === 'price')
            setReversed(!reversed);
        else{
            setSortBy('price');
            setReversed(false);
        }
    }
    

    function changeSortNameManufacturer(){
        if(sortByManufacturer === 'name')
            setReversedManufacturer(!reversedManufacturer);
        else{
            setSortByManufacturer('name');
            setReversedManufacturer(false);
        }
    }
    
    function changeSortManufacturerId(){
        if(sortBy === 'manufacturer_id')
            setReversed(!reversed);
        else{
            setSortBy('manufacturer_id');
            setReversed(false);
        }
    }

    function getManufacturerById(id){
        for (let i in manufacturers){
            if (manufacturers[i].getId() === id){
                return manufacturers[i].getName();}}
        return 'No manufacturer found with id = ' + String(id);
    }


    return(
        <Layout>
            <h1>Display</h1>
            <table>
                <tr>
                    <th>
                        <button onClick={changeSortName}>Name</button>
                    </th>
                    <th>
                        <button onClick={changeSortCpu}>CPU</button>
                    </th>
                    <th>
                        <button onClick={changeSortGpu}>GPU</button>
                    </th>
                    <th>
                        <button onClick={changeSortRam}>RAM</button>
                    </th>
                    <th>
                        <button onClick={changeSortStorage}>Storage</button>
                    </th>
                    <th>
                        <button onClick={changeSortPrice}>Price</button>
                    </th>
                    <th>
                        <button onClick={changeSortManufacturerId}>Manufacturer</button>
                    </th>
                    <th>    
                        Edit Item
                    </th>
                    <th>
                        Delete Item
                    </th>
                </tr>
                <tbody>
                    {sortedTable(laptopArray, removeLaptop, addLaptop, sortBy, reversed, changeRoute, deleteButton, getManufacturerById)}
                </tbody>
            </table>
            <table>
                <tr>
                    <th>
                        <button onClick={changeSortNameManufacturer}>Name</button>
                    </th>
                    <th>
                        Edit Item
                    </th>
                    <th>
                        Delete Item
                    </th>
                </tr>
                <tbody>
                {sortedTableManufacturers(manufacturers, removeManufacturer, addManufacturer, sortByManufacturer, reversedManufacturer, changeRoute, deleteButtonManufacturer)}
                </tbody>
            </table>
        </Layout>
    );
}

function sortedTable(laptopArray, removeLaptop, addLaptop, sortBy, reversed, changeRoute, deleteButton, getManufacturerById){   
    const sortedArray = [].concat(laptopArray);
    if (sortBy === 'manufacturer_id'){
        if (reversed === false){
            sortedArray.sort((a, b) => getManufacturerById(a.getComponent(sortBy)) > getManufacturerById(b.getComponent(sortBy)) ? 1 : -1);
        }else{
            sortedArray.sort((a, b) => getManufacturerById(a.getComponent(sortBy)) < getManufacturerById(b.getComponent(sortBy)) ? 1 : -1);
            }
    }else{
        if (reversed === false){
            sortedArray.sort((a, b) => a.getComponent(sortBy) > b.getComponent(sortBy) ? 1 : -1);
        }else{
            sortedArray.sort((a, b) => a.getComponent(sortBy) < b.getComponent(sortBy) ? 1 : -1);
        }
    }
    const renderedTable = sortedArray
        .map((laptop) =>{
        return(
            <tr>
                <td>{laptop.getName()}</td>
                <td>{laptop.getCpu()}</td>
                <td>{laptop.getGpu()}</td>
                <td>{laptop.getRam()}</td>
                <td>{laptop.getStorage()}</td>
                <td>{laptop.getPrice()}</td>
                <td>{
                    getManufacturerById(laptop.getManufacturerId())
                }</td>
                <td>
                    <button onClick={() => changeRoute(laptop.getId())}>Edit</button>
                </td>
                <td>
                    <button onClick={() => deleteButton(laptop.getId())}>X</button>
                </td>
            </tr>
        );
    })
    return(renderedTable);
}

function sortedTableManufacturers(manufacturers, removeManufacturer, addManufacturer, sortBy, reversed, changeRoute, deleteButtonManufacturer){   
    const sortedArray = [].concat(manufacturers);
    if (reversed === false){
        
        sortedArray.sort((a, b) => a.getComponent(sortBy) > b.getComponent(sortBy) ? 1 : -1);
    }
    else{
        sortedArray.sort((a, b) => a.getComponent(sortBy) < b.getComponent(sortBy) ? 1 : -1);
    }
    const renderedTable = sortedArray
        .map((manufacturer) =>{
        return(
            <tr>
                <td>{manufacturer.getName()}</td>
                <td>
                    <button onClick={() => changeRoute(manufacturer.getId()*-1  )}>Edit</button>
                </td>
                <td>
                    <button onClick={() => deleteButtonManufacturer(manufacturer.getId())}>X</button>
                </td>
            </tr>
        );
    })
    return(renderedTable);

}