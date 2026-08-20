"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { shuffle } from 'lodash';

const initialItems = [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
    { id: 5, text: 'Item 5' },
];

function FLIPExample() {
    const [items, setItems] = useState(initialItems);

    const handleShuffle = () => {
        setItems(shuffle(items));
    };

    return (
        <div>
            <h2>FLIP Animation Example</h2>
            <button onClick={handleShuffle}>Shuffle</button>
            <ul>
                {items.map((item) => (
                    <motion.li
                        key={item.id}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {item.text}
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}

export default FLIPExample;
