import React from 'react';
import { useState } from 'react';


export default class Manufacturer extends React.Component {
    constructor(id, name){
        super(id, name);
        this.id = id;
        this.name = name;
    }

    getComponent(Name){
        if (Name === 'id')
            return this.id;
        if (Name === 'name')
            return this.name;
        return this.id;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }
}