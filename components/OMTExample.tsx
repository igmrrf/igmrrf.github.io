"use client";
import React, { useState, useEffect } from 'react';
import { wrap } from 'comlink';

function OMTExample() {
    const [result, setResult] = useState('');
    const [worker, setWorker] = useState<any>(null);

    useEffect(() => {
        const worker = new Worker('/workers/heavy-task.js');
        const workerApi = wrap(worker);
        setWorker(workerApi);

        return () => {
            worker.terminate();
        };
    }, []);

    const handleClick = async () => {
        if (worker) {
            setResult('Running heavy task...');
            const result = await worker.heavyTask();
            setResult(result);
        }
    };

    return (
        <div>
            <h2>Off-Main-Thread (OMT) Architecture Example</h2>
            <button onClick={handleClick}>Run Heavy Task</button>
            <p>Result: {result}</p>
        </div>
    );
}

export default OMTExample;
