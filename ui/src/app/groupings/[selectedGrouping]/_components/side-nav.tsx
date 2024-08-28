import { Wrench, Share2 } from 'lucide-react';
import Link from 'next/link';

const SideNav = ({ selectedGrouping }: { selectedGrouping: string }) => {
    return (
        <div className="h-[300px] w-24 bg-teal-tint">
            <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="All Members" data-place="right">
                    <Link href={`/groupings/${selectedGrouping}/sync-destinations`}>
                        <Share2 aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="All Members" data-place="right">
                    <Link href={`/groupings/${selectedGrouping}/actions`}>
                        <Wrench aria-hidden="true" />
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideNav;
