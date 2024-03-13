import { render, screen } from '@testing-library/react';
import App from './App';
class Electronic extends React.Component {
    constructor(name){
        super(name);
        this.name = name;
    }
    render() {
        return (
            <li>{this.name}</li>
        );
    }
}
  
const electronics = [
    "Laptop Asus",
    "Laptop Lenovo", 
    "Laptop Ceapa"
];

const listItems = electronics.map((electronic) => Electronic(electronic));
  
test('renders learn react link', () => {
    render(<App Electronics={listItems}/>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
