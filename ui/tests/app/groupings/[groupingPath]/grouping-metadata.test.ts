import { describe, expect, it } from 'vitest';
import { generateGroupingMetadata } from '@/app/groupings/[groupingPath]/grouping-metadata';

describe('generateGroupingMetadata', () => {
    it('uses the Admin title for grouping pages opened from Admin', () => {
        expect(generateGroupingMetadata({ searchParams: { from: 'admin' } })).toEqual({
            title: {
                absolute: 'UH Groupings Admin'
            }
        });
    });

    it('uses the Owners title for grouping pages opened from Groupings', () => {
        expect(generateGroupingMetadata({ searchParams: {} })).toEqual({
            title: {
                absolute: 'UH Groupings Owners'
            }
        });
    });
});
