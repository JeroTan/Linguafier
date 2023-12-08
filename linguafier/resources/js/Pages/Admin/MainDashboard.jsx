//Utilities
import AdminUI from './Utilities/AdminMainUI';
import Icon from '../../Utilities/Icon';

//Inertia / React
import { usePage } from '@inertiajs/react';


export default function Dashboard(){
    const { asset, popFlash } = usePage().props;

    return <AdminUI>
        <h1 className='font-bold text-5xl'>
            Dashboard
        </h1>
        <small>Manage your magic system here</small>
        <div className='pb-10'></div>

        <div className='flex mb-5 gap-1'>
            <div>
                <Icon Name="person_star" OutClass="w-7 h-7" InClass="fill-my-green" />
            </div>
            <div className='shrink break-words'>
                <h4 className='text-2xl text-my-green font-semibold '>Special User</h4>
                <p className='font-light'>Manage your co-users of the magic system here. You can give them roles with various privileges. You may add, edit, modify or delete here.</p>
            </div>
        </div>

        <div className='flex mb-5 gap-1'>
            <div>
                <Icon Name="wizard_hat" OutClass="w-7 h-7" InClass="fill-my-green" />
            </div>
            <div className='shrink break-words'>
                <h4 className='text-2xl text-my-green font-semibold'>Overseer Wizard</h4>
                <p className='font-light'>You may see the concerns of lower wizards (users) here. As well as manage their accounts as usual like add, edit, modify or delete, and reset their password here if necessary.</p>
            </div>
        </div>

        <div className='flex mb-5 gap-1'>
            <div>
                <Icon Name="w" OutClass="w-7 h-7" InClass="fill-my-green" />
            </div>
            <div className='shrink break-words'>
                <h4 className='text-2xl text-my-green font-semibold'>Word Library</h4>
                <p className='font-light'>All kinds of words are created here, and you may modify it in your accord. The most powerful weapon of a wizard is the ability to cast prestigious and unbeknownst words.</p>
            </div>
        </div>

        <div className='flex mb-5 gap-1'>
            <div>
                <Icon Name="star" OutClass="w-7 h-7" InClass="fill-my-green" />
            </div>
            <div className='shrink break-words'>
                <h4 className='text-2xl text-my-green font-semibold'>Word Attribution</h4>
                <p className='font-light'>Each word has a weight and capabilities. Define its category here and make a tier for it.</p>
            </div>
        </div>

        <div className='flex mb-5 gap-1'>
            <div>
                <Icon Name="book_person" OutClass="w-7 h-7" InClass="fill-my-green" />
            </div>
            <div className='shrink break-words'>
                <h4 className='text-2xl text-my-green font-semibold'>Wizard Ranks</h4>
                <p className='font-light'>Wizards may rank themselves depending on whether they have a good participation in ranked games. Here you can manage the divisions where wizards may fall unto.</p>
            </div>
        </div>

        <div className='flex mb-5 gap-1'>
            <div>
                <Icon Name="sticky_sword" OutClass="w-7 h-7" InClass="fill-my-green" />
            </div>
            <div className='shrink break-words'>
                <h4 className='text-2xl text-my-green font-semibold'>Roles and Privilege</h4>
                <p className='font-light'>Each user in the magic system has roles assigned to them. Without roles, they are insignificant as a magician without mana, so better equip them with the right roles.</p>
            </div>
        </div>
    </AdminUI>
};
