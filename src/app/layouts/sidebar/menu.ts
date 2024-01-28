import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true,
        role: 'Institute',
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
        role: 'Institute',
    },
    {
        id: 3,
        label: 'Department List',
        icon: 'list',
        link: '/department',
        role: 'Institute',

    },
    {
        id: 4,
        label: 'Image Uploader',
        icon: 'image',
        link: '/image-upload',
        role: 'Institute',


    },
    {
        id: 5,
        label: 'News Organizer',
        icon: 'send',
        link: '/news',
        role: 'Institute'

    },
    {
        id: 6,
        label: 'Staff List',
        icon: 'users',
        link: '/staff-details',
        role: 'Institute'

    },
    {
        id: 7,
        label: 'Student List',
        icon: 'users',
        link: '/student-details',
        role: 'Institute'

    },
    {
        id: 8,
        label: 'Forms,Syllabus & Report',
        icon: 'file-text',
        link: '/others',
        role: 'Institute'

    },
    {
        id: 10,
        label: 'Student Result',
        icon: 'file-text',
        link: '/result',
        role: 'Institute'

    },
    {
        id: 11,
        label: 'Infrastructure',
        icon: 'home',
        link: '/infrastructure',
        role: 'Institute'

    },
    {
        id: 12,
        label: 'Blogs',
        icon: 'file-plus',
        link: '/blog',
        role: 'Institute'

    },
    {
        id: 17,
        label: 'Contact US List',
        icon: 'list',
        link: '/contact-list',
        role: 'Institute'

    },
    {
        id: 19,
        label: 'Scholarship & Calendar',
        icon: 'calendar',
        link: '/more',
        role: 'Institute'

    },
    {
        id: 20,
        label: 'Old Question Papers',
        icon: 'file-text',
        link: '/papers',
        role: 'Institute'

    },
    {
        id: 21,
        label: 'NAAC',
        icon: 'book',
        link: '/naac',
        role: 'Institute'
    },
    {
        id: 23,
        label: 'Link Generater',
        icon: 'link',
        link: '/link-generater',
        role: 'Institute'
    },
    {
        id: 25,
        label: 'Committee',
        icon: 'users',
        link: '/committee',
        role: 'Institute'
    },
    {
        id: 26,
        label: 'Placement Cell',
        icon: 'file-text',
        link: '/placement',
        role: 'Institute'
    },
    {
        id: 27,
        label: 'Research',
        icon: 'book-open',
        link: '/research',
        role: 'Institute'
    },
    {
        id: 28,
        label: 'Campus Life',
        icon: 'dribbble',
        link: '/campus',
        role: 'Institute'
    },
    {
        id: 29,
        label: 'Syllabus List',
        icon: 'list',
        link: '/syllabus',
        role: 'Institute'
    }
];
export const CES: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true,
        role: 'Institute',
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
        role: 'Institute',
    },
    // {
    //     id: 3,
    //     label: 'Department List',
    //     icon: 'list',
    //     link: '/department',
    //     role: 'Institute',
    // },
    {
        id: 4,
        label: 'Image Uploader',
        icon: 'image',
        link: '/image-upload',
        role: 'Institute',
    },
    {
        id: 5,
        label: 'News Organizer',
        icon: 'send',
        link: '/news',
        role: 'Institute'
    },
    {
        id: 9,
        label: 'Magazine',
        icon: 'book',
        link: '/magazine',
        role: 'Institute'
    },
    {
        id: 12,
        label: 'Blogs',
        icon: 'file-plus',
        link: '/blog',
        role: 'Institute'
    },
    {
        id: 22,
        label: 'Rahatokarsh Donation',
        icon: 'archive',
        link: '/micro-donation',
    },
    {
        id: 13,
        label: 'Donner List',
        icon: 'list',
        link: '/donation',
        role: 'Admin'
    },
    {
        id: 14,
        label: 'Rahotkarsh Fee Fund',
        icon: 'list',
        link: '/rahotkarsh',
        role: 'Admin'
    },
    {
        id: 16,
        label: 'Alumni List',
        icon: 'list',
        link: '/alumni-list',
        role: 'Institute',
    },
    {
        id: 17,
        label: 'Contact US List',
        icon: 'list',
        link: '/contact-list',
    },
    {
        id: 18,
        label: 'Counseling List',
        icon: 'calendar',
        link: '/counseling',
    },
    {
        id: 21,
        label: 'Gate Pass',
        icon: 'home',
        link: '/gate-pass',
    },
    {
        id: 22,
        label: 'Answer-key',
        icon: 'key',
        link: '/answer-key',
    },
    {
        id: 24,
        label: 'Link Generater',
        icon: 'link',
        link: '/link-generater',
        role: 'Institute'
    },
    {
        id: 28,
        label: 'Photo Contest',
        icon: 'camera',
        link: '/photo-contest',
        role: 'Institute'
    }

];
export const superAdmin: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true,
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
    },
    {
        id: 15,
        label: 'Institute List',
        icon: 'list',
        link: '/college-list',

    },
    {
        id: 9,
        label: 'Magazine',
        icon: 'book',
        link: '/magazine',

    },
    {
        id: 13,
        label: 'Donner List',
        icon: 'list',
        link: '/donation',

    },
    {
        id: 14,
        label: 'Rahotkarsh Fee Fund',
        icon: 'list',
        link: '/rahotkarsh',

    },
    {
        id: 16,
        label: 'Alumni List',
        icon: 'list',
        link: '/alumni-list',
    },
    {
        id: 18,
        label: 'Counseling List',
        icon: 'calendar',
        link: '/counseling',
    },
    {
        id: 21,
        label: 'Gate Pass',
        icon: 'key',
        link: '/gate-pass',
    },
    {
        id: 22,
        label: 'Answer-key',
        icon: 'key',
        link: '/answer-key',
    },
];

