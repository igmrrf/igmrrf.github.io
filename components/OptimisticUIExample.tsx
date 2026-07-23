"use client";
import React, { useOptimistic, useState } from 'react';

async function mockApi(data: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data });
        }, 1000);
    });
}

function OptimisticUIExample() {
    const [likes, setLikes] = useState(10);
    const [optimisticLikes, setOptimisticLikes] = useOptimistic(
        likes,
        (state, newLike) => state + 1
    );

    const handleLike = async () => {
        setOptimisticLikes(optimisticLikes + 1);
        const result = await mockApi({ likes: likes + 1 });
        if (result.success) {
            setLikes(result.data.likes);
        }
    };

    return (
        <div>
            <h2>Optimistic UI Example</h2>
            <button onClick={handleLike}>
                Likes: {optimisticLikes}
            </button>
        </div>
    );
}

export default OptimisticUIExample;
