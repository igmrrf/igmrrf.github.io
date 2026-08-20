"use client";
import React from 'react';

function QwikExample() {
    return (
        <div>
            <h2>Qwik (Resumability) Example</h2>
            <p>
                Qwik is a new kind of web framework that focuses on resumability.
                Instead of hydrating the application on the client, Qwik applications
                are fully rendered on the server and resume their execution on the
                client. This results in instant-on applications with near-zero
                JavaScript on the initial load.
            </p>
            <p>
                Implementing a full Qwik example in this React application is not
                feasible. To learn more about Qwik, please visit the{' '}
                <a
                    href="https://qwik.builder.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    official documentation
                </a>
                .
            </p>
        </div>
    );
}

export default QwikExample;
