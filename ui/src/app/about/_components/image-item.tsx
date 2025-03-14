/* This is the component we'll be modifying for this workshop. It is similar to the question-item component,
 the only difference being that the 'icon' property has two sub-properties, 'src' and 'alt'*/

import Image from 'next/image';

type ImageItem = {
    description: string;
    icon: {
        src: string;
        alt: string;
    };
};

type ImageItemProps = {
    data: ImageItem[];
};

const ImageItem = async ({ data, size = 'default' }: ImageItemProps) => {
    const textSize = size === 'lg' ? 'text-[1.2rem]' : 'text-base';

    return (
        <div className="w-full flex flex-row justify-between">
            {data.map((infoItem, index) => (
                <div key={index}>
                    <div className="flex justify-center">
                        <Image src={infoItem.icon.src} alt={infoItem.icon.alt} width={115} height={115} />
                    </div>
                    <p className={`text-center font-normal ${textSize}`}>{infoItem.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ImageItem;
