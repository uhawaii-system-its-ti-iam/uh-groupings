import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from "@/components/ui/button";

const UserInfoItem = (
    {alt, src, number, show, title, description, link, text}:
        {
            alt: string,
            src: string,
            number: number,
            show: boolean,
            title: string,
            description: string,
            link: string,
            text: string
        }) => {
    return (
        <div className="flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-1">
                    <Image
                        alt={alt}
                        src={src}
                        width={alt === 'id-card' ? 54 : 48}
                        height={48}
                        style={{maxWidth: alt === 'id-card' ? 54 : 48, height: "auto"}}
                        className="mr-5 mb-4"
                    />
                    {show && <span className="text-2.5 text-text-primary">{number}</span>}
                </div>
                <h2 className="text-2xl text-text-color mb-2">{title}</h2>
                <p className="mb-4">{description}</p>
            </div>
            <Link href={link}>
                <Button>{text}</Button>
            </Link>
        </div>
    );
}

export default UserInfoItem;