"use client";
import React, { useState, useTransition } from 'react';

const bigList = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

function ConcurrentExample() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        startTransition(() => {
            const filtered = bigList.filter((item) =>
                item.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setResults(filtered);
        });
    };

    return (
        <div>
            <h2>React Concurrent Mode Example</h2>
            <input onChange={handleChange} value={input} placeholder="Search..." />
            {isPending && <p>Loading...</p>}
            <ul>
                {results.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default ConcurrentExample;
