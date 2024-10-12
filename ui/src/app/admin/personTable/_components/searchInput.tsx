'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SearchInput = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [uid, setUid] = useState('');
    const searchUid = searchParams.get('searchUid');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            router.push(`?tab=person&searchUid=${uid}`);
        }
    };
    return (
        <label>
            <div className="flex flex-col md:flex-row md:w-72 lg-84 items-center">
                <Input
                    type="search"
                    className="rounded-[-0.25rem] rounded-l-[0.25rem]"
                    placeholder={searchUid === null ? 'UH Username' : searchUid}
                    onChange={(e) => setUid(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Link href={`?tab=person&searchUid=${uid}`}>
                    <Button className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3">Search</Button>
                </Link>
            </div>
        </label>
    );
};

export default SearchInput;
