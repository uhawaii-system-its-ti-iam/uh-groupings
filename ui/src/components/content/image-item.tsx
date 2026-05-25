import Image from 'next/image';

/**
 * One item rendered in a horizontal list of icon + caption tiles.
 */
type ImageItemData = {
    description: string;
    icon: {
        src: string;
        alt: string;
    };
};

/**
 * Props for {@link ImageItem}.
 * `size` controls the caption font size: `lg` for larger contexts (e.g. About
 * page hero) and `default` everywhere else.
 */
type ImageItemProps = {
    data: ImageItemData[];
    size?: 'lg' | 'default';
};

/**
 * Renders a horizontal row of icon + description tiles.
 * Used by both the About page and the homepage `UHGroupingsInfo` block.
 */
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

