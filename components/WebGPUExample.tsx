"use client";
import React, { useState, useEffect } from 'react';

function WebGPUExample() {
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if ((navigator as any).gpu) {
            setSupported(true);
        }
    }, []);

    return (
        <div>
            <h2>WebGPU Example</h2>
            {supported ? (
                <p>WebGPU is supported on this browser.</p>
            ) : (
                <p>WebGPU is not supported on this browser.</p>
            )}
        </div>
    );
}

export default WebGPUExample;
