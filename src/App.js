import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import { createRoot } from 'react-dom';
import Laptop from './classes/laptop';
import Repo from './repo/repo';

function App() {
	const repo = new Repo();
	console.log(repo.getLaptops());
	const [temp, setTemp] = React.useState("");
	return(
		<div>
		<h1>Serus</h1>
		<ul>
		{repo.getLaptops().map((laptop) => <li>{laptop.getLaptopName()}</li>)}
		</ul>
		<input 
			type="text"
			onChange={(e) => setTemp(e.target.value)}
		/>
		<button onClick={ () => {
			repo.addLaptop([temp]);
		} 
		}>Add</button>
		</div>
	
	
	);
}

export default App;
