"use client";
import React from 'react';
import Link from 'next/link';

function ViewTransitionLink({ to, children, ...props }: { to: string; children?: React.ReactNode; [key: string]: any }) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!(document as any).startViewTransition) {
            return;
        }

        e.preventDefault();
        (document as any).startViewTransition(() => {
            if (props.navigate) props.navigate(to);
        });
    };

    return <Link href={to} onClick={handleClick} {...props} />;
}

export default ViewTransitionLink;
