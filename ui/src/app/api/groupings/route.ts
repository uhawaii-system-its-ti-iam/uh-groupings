import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedUser } from '@/lib/access/user.server';
import Role from '@/lib/access/role';
import { getAllGroupings } from '@/lib/fetchers';

export const GET = async (request: NextRequest) => {
    const page = Number(request.nextUrl.searchParams.get('page') ?? '1');
    const size = Number(request.nextUrl.searchParams.get('size') ?? '25');
    const search = request.nextUrl.searchParams.get('search')?.trim() || undefined;

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 100) {
        return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const user = await getAuthorizedUser();
    if (!user.roles.includes(Role.ADMIN)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json(await getAllGroupings(user, { page, size, search }));
};
