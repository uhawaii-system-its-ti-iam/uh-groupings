import React from "react";
import Image from "next/image";

const AboutInfoItem = ({src, alt, description, pSize}: {
    src: string,
    alt: string,
    description: string,
    pSize: string
}) => {
    return (
        <div className="col-span-1">
            <div className="flex justify-center">
                <Image
                    src={src}
                    alt={alt}
                    width={115}
                    height={115}/>
            </div>
            <p className={`text-center ${pSize}`}>{description}</p>
        </div>
    );
}
export default AboutInfoItem;