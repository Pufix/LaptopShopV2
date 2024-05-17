import React from 'react';
import { useState } from 'react';


export default class Laptop extends React.Component {
    constructor(id, name, cpu, gpu, ram, storage, price, manufacturer_id){
        super(id, name, cpu, gpu, ram, storage, price, manufacturer_id);
        this.id = id;
        this.name = name;
        this.cpu = cpu;
        this.gpu = gpu;
        this.ram = ram;
        this.storage = storage;
        this.price = price;
        this.manufacturer_id = manufacturer_id;
    }

    getComponent(Name){
        if (Name === 'id')
            return this.id;
        if (Name === 'name')
            return this.name;
        if (Name === 'cpu')
            return this.cpu;
        if (Name === 'gpu')
            return this.gpu;
        if (Name === 'ram')
            return this.ram;
        if (Name === 'storage')
            return this.storage;
        if (Name === 'price')
            return this.price;
        if (Name === 'manufacturer_id')
            return this.manufacturer_id;
        return this.id;
    }

    getManufacturerId(){
        return this.manufacturer_id;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getCpu(){
        return this.cpu;
    }

    getGpu(){
        return this.gpu;
    }

    getRam(){
        return this.ram;
    }

    getStorage(){
        return this.storage;
    }

    getPrice(){
        return this.price;
    }
}