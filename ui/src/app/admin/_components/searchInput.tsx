'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [uid, setUid] = useState('');
    const searchUid = searchParams.get('searchUid');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            router.push(`?searchUid=${uid}`);
        } else if (e.type === 'click') {
            router.push(`?searchUid=${uid}`);
        }
    };
    return (
        <>
            <label>
                <div className="flex flex-col md:flex-row md:w-72 lg-84 items-center">
                    <Input
                        type="search"
                        className="rounded-[-0.25rem] rounded-l-[0.25rem]"
                        maxLength={8}
                        placeholder={searchUid === null || searchUid === '' ? 'UH Username' : searchUid}
                        onChange={(e) => setUid(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3" onClick={handleKeyDown}>
                        Search
                    </Button>
                </div>
            </label>
        </>
    );
};

export default SearchInput;
