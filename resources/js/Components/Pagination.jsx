import React from 'react';
import { Link } from '@inertiajs/react';
export default function Pagination({ links }) {    
    return (
        links?.length > 10 ? 
            <ul className="pagination pagination-sm m-0 float-right">
                {links?.map((link, key) => (
                    link?.url === null ?
                        (
                            <li className="page-item" key={key}>
                                <Link className="page-link" href={`#`} key={key}>
                                    {link?.label.replace('&laquo;', '<').replace('&raquo;', '>')}
                                </Link>
                            </li>
                        ) :
                        (
                            <li className={`page-item ${link?.active && 'active'}`} key={key}>
                                <Link className={`page-link`} href={ link?.url } key={key}>
                                    {link?.label.replace('&raquo;', '>').replace('&laquo;', '<')}
                                </Link>
                            </li>
                        )
                ))}
            </ul>
        : 
        <></>
    )
}