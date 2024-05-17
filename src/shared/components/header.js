import {Link} from 'react-router-dom';
import { ServerState } from '../../contexts/laptopcontext';

export function Header(){
    return(
        <div>
            <div>
            <Link to="/">Home</Link>
            </div><div>
            <Link to="/addItemPage">Add Item</Link>
            {!ServerState && <h1>SERVER DID NOT RESPOND!</h1>}
            <div></div>
            </div>
        </div>
    );
}