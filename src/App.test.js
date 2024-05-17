import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    console.log("trecui prin App.test.js");
    render(<App/>);
    //test the links
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
    const linkElement2 = screen.getByText(/Add Item/i);
    expect(linkElement2).toBeInTheDocument();
    //test changing the page
    linkElement2.click();
    //test adding a laptop
    const name = screen.getByText(/Name/i);
    expect(name).toBeInTheDocument();
    const cpu = screen.getByText(/CPU/i);
    expect(cpu).toBeInTheDocument();
    const gpu = screen.getByText(/GPU/i);
    expect(gpu).toBeInTheDocument();
    const ram = screen.getByText(/RAM/i);
    expect(ram).toBeInTheDocument();
    const storage = screen.getByText(/Storage/i);
    expect(storage).toBeInTheDocument();
    const price = screen.getByText(/Price/i);
    expect(price).toBeInTheDocument();
    //test going back
    const linkElement3 = screen.getByText(/Home/i);
    expect(linkElement3).toBeInTheDocument();
    linkElement3.click();
    //test changing the page
    const linkElement4 = screen.getByText(/Add Item/i);
    expect(linkElement4).toBeInTheDocument();
    linkElement4.click();
    //test adding a laptop
    const name2 = screen.getByText(/Name/i);
    expect(name2).toBeInTheDocument();
    const cpu2 = screen.getByText(/CPU/i);
    expect(cpu2).toBeInTheDocument();
    const gpu2 = screen.getByText(/GPU/i);
    expect(gpu2).toBeInTheDocument();
    const ram2 = screen.getByText(/RAM/i);
    expect(ram2).toBeInTheDocument();
    const storage2 = screen.getByText(/Storage/i);
    expect(storage2).toBeInTheDocument();
    const price2 = screen.getByText(/Price/i);
    expect(price2).toBeInTheDocument();
    
    

    
});
