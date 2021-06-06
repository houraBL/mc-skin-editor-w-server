import React from 'react';

import axios from "axios";
import { useEffect, useState } from "react";

import './library.css';

const Library = () => {

    const [listOfPosts, setListOfPosts] = useState([]);
    const [bases, setBases] = useState([]);
    const clothesTypeId = 3;

    useEffect(() => {
        axios.get(`http://localhost:3001/clothes`).then((response) => {
            setListOfPosts(response.data);
        });

        axios.get(`http://localhost:3001/bases/${clothesTypeId}`).then((response) => {
            setBases(response.data);
        });

    }, []);

    return (
        <div className="">
            <ul className="item-list list-group list-group-flush list-group-item-action">
                {listOfPosts.map((value, key) => {
                    return (
                        <li key={key} className="list-group-item list-group-item-action">
                            <div className="type"> {value.type} </div>
                            <div className="title">{value.title}</div>

                        </li>
                    );
                })}
                <li className="list-group-item list-group-item-action">Head</li>
                <li className="list-group-item list-group-item-action">Body</li>
                <li className="list-group-item list-group-item-action">Legs</li>
                <li className="list-group-item list-group-item-action">Boots</li>
                <li className="list-group-item list-group-item-action">Suit</li>
            </ul>
        </div>
    )
};

export default Library;