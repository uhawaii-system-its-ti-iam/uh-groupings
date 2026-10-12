import { describe, expect, it } from 'vitest';
import { generateGroupingMetadata } from '@/app/groupings/[groupingPath]/grouping-metadata';

describe('generateGroupingMetadata', () => {
    it.each(['admin', ['admin', 'groupings'], ['groupings', 'admin'], ['', 'admin']])('uses the Admin title for origin %j', async (from) => {
        expect(await generateGroupingMetadata({ searchParams: Promise.resolve({ from }) })).toEqual({
            title: { absolute: 'UH Groupings Admin' }
        });
    });

    it.each([{}, { from: 'groupings' }, { from: 'unknown' }, { from: ['groupings', 'unknown'] }])(
        'uses the Owners title for query %j', async (query) => {
            expect(await generateGroupingMetadata({ searchParams: Promise.resolve(query) })).toEqual({
                title: { absolute: 'UH Groupings Owners' }
            });
        }
    );
});
