//Utilities
import Icon from '../../../Utilities/Icon';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import AdminMainUI from '../Utilities/AdminMainUI';

//HOOKS
import { useState } from 'react';

export default ()=>{
    //** Use State */
    const [v_search, e_search] = useState("");

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button Name="Add Roles" Icon={`add`}/>
        </div>


        {/* List Contents*/}
        <ListContainer Search={[v_search, e_search]} ButtonProps={{}} OtherButtons={[]} Contents={['Hello']} />


    </AdminMainUI>
}
