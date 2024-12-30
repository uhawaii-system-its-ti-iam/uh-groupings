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

const ImageItem = ({ data, size = 'default' }: ImageItemProps) => {
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
