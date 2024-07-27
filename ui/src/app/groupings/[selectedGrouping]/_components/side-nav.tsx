import { Users, CreditCard, UserPlus, UserMinus, Crown, Share2, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';

const SideNav = ({ selectedGrouping }: { selectedGrouping: string}) => {

    return (
        <div className="flex-shrink-0 sm:w-full md:w-1/6 lg:w-1/12 bg-teal-tint py-4">
            <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">
                <li className="px-0 mt-5 mx-auto" data-tip="All Members" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/all`}>
                        <Users aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Basis Members" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/basis`}>
                        <CreditCard aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Include Members" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/include`}>
                        <UserPlus aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Exclude Members" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/exclude`}>
                        <UserMinus aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Grouping Owners" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/owners`}>
                        <Crown aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Sync Destinations" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/sync-destinations`}>
                        <Share2 aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Preferences" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/preferences`}>
                        <Settings aria-hidden="true" />
                    </Link>
                </li>
                <li className="px-0 mt-5 mx-auto pt-0" data-tip="Actions" data-place="right">
                    <Link href={`/groupings/${decodeURIComponent(selectedGrouping)}/actions`}>
                        <Wrench aria-hidden="true" />
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideNav;
