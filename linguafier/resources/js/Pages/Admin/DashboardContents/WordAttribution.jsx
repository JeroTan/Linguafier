//Utilities
import Icon from '../../../Utilities/Icon';
import AdminMainUI from '../Utilities/AdminMainUI';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import Pop from '../../../Utilities/Pop';
import PopFlash from '../../../Utilities/PopFlash';
import PopLoading from '../../../Utilities/PopLoading';

//HOOKS
import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default ()=>{
    //** Use Page */

    //** STRUCT */
    let d_pageSwitch = [
        'Variation',
        'Attribute',
        'Rarity',
        'Language',
    ];

    //**>> Use State */
    const [c_pageSwitch, e_pageSwitch] = useState("Variation");

    const [v_search, e_search] = useState('');
    const [v_sort, e_sort] = useState([]);
    //**<< Use State */

    //**>> Use Effect */
    useEffect(()=>{
        const sortData = {
            Variation:[
                { Name:"Variation Name", Ref:"name", Sort:"ASC"},
            ],
            Attribute:[
                { Name:"Attribute Name", Ref:"name", Sort:"ASC" },
            ],
            Rarity:[
                { Name:"Rarity Name", Ref:"name", Sort:"ASC" },
                { Name:"Level", Ref:"level", Sort:"ASC" }
            ],
            Language:[
                { Name:"Name", Ref:"name", Sort:"ASC" },
            ]
        }
        e_sort(sortData[c_pageSwitch]);

    }, [c_pageSwitch]);

    //**<< Use Effect */

    //**>> Functionality */
    function buttonColor(name){
        return c_pageSwitch == name ? "bg-my-yellow" : undefined
    }
    function buttonTextColor(name){
        return c_pageSwitch == name ? "text-black" : undefined
    }
    function buttonPWD(name){
        return c_pageSwitch == name ? true : undefined
    }
    function changeContents(){

    }
    function ItemPlate(){
        return [];
    }
    function addButton(){
        return [
            <Button Name={`Add New`} Icon={`add`} Click={()=>{
                switch(c_pageSwitch){
                    case 'Variation':
                        router.get('/admin/dashboard/word_attribution/add_variation');
                    break;
                    case 'Attribute':
                        router.get('/admin/dashboard/word_attribution/add_attribute');
                    break;
                    case 'Rarity':
                        router.get('/admin/dashboard/word_attribution/add_rarity');
                    break;
                    case 'Language':
                        router.get('/admin/dashboard/word_attribution/add_language');
                    break;
                };
            }}/>
        ]
    }
    //**<< Functionality */

    //** Render */
    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            {d_pageSwitch.map((x, i)=>{
                    return <Button key={i} Name={x} Color={buttonColor(x)} TextColor={buttonTextColor(x)} Disabled={buttonPWD(x)} Click={()=>e_pageSwitch(x)}/>
                })
            }
        </div>

        {/* List Contents*/}
        <ListContainer Name="List of System User" Search={[v_search, e_search, changeContents]} Sort={[v_sort, e_sort]} OtherButtons={addButton()}  Contents={ItemPlate()} />

    </AdminMainUI>
}
