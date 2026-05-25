#!/usr/bin/env node
/**
 * check-test-mirror.mjs
 *
 * Verifies that the tests/ directory mirrors src/ for source files that should
 * have a co-located test. This keeps human + LLM navigation predictable.
 *
 * Conventions enforced:
 *   - src/app/**\/*.tsx  → tests/app/**\/*.test.tsx
 *   - src/components/**\/*.tsx → tests/components/**\/*.test.tsx
 *   - src/lib/**\/*.ts   → tests/lib/**\/*.test.ts
 *
 * Skipped (no test required):
 *   - Route entry files (page.tsx, layout.tsx, loading.tsx, route.ts, default.tsx)
 *     when they only re-export or render other components.
 *   - Type-only files, *.d.ts, *.css, *.svg, etc.
 *   - shadcn/ui primitives under src/components/ui/.
 *
 * Reports:
 *   - Orphan tests (test files with no matching source).
 *   - Drifted tests (tests in a folder that does not exist under src/).
 *
 * Exits non-zero if any drift is found.
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const srcRoot = join(root, 'src');
const testsRoot = join(root, 'tests');

const verbose = process.argv.includes('--verbose');

// Optional allowlist of source files that are intentionally untested
// (one path per line, relative to the `ui` directory, comments start with #).
const allowlistPath = join(root, 'scripts', 'test-mirror.allowlist.txt');
const allowlist = new Set(
    existsSync(allowlistPath)
        ? readFileSync(allowlistPath, 'utf8')
              .split('\n')
              .map((l) => l.trim())
              .filter((l) => l && !l.startsWith('#'))
        : []
);

const SKIP_SRC_DIRS = new Set(['components/ui']);
const SKIP_BASENAMES = new Set([]);

const isTestable = (absPath) => {
    const rel = relative(srcRoot, absPath).replaceAll('\\', '/');
    if (SKIP_SRC_DIRS.has(rel.split('/').slice(0, 2).join('/'))) return false;
    if (SKIP_BASENAMES.has(basename(absPath))) return false;
    if (!/\.(ts|tsx)$/.test(absPath)) return false;
    if (absPath.endsWith('.d.ts')) return false;
    return true;
};

const walk = (dir) => {
    const out = [];
    if (!existsSync(dir)) return out;
    for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        const s = statSync(p);
        if (s.isDirectory()) out.push(...walk(p));
        else out.push(p);
    }
    return out;
};

const toTestPath = (srcAbs) => {
    const rel = relative(srcRoot, srcAbs);
    const dir = dirname(rel);
    const base = basename(srcAbs).replace(/\.(tsx|ts)$/, (m) => `.test${m}`);
    return join(testsRoot, dir, base);
};

const toSrcPath = (testAbs) => {
    const rel = relative(testsRoot, testAbs);
    const dir = dirname(rel);
    const base = basename(testAbs).replace(/\.test\.(tsx|ts)$/, '.$1');
    return join(srcRoot, dir, base);
};

const srcFiles = walk(srcRoot).filter(isTestable);
const testFiles = walk(testsRoot).filter((p) => /\.test\.(ts|tsx)$/.test(p));

const orphanTests = testFiles.filter((t) => {
    if (basename(t) === 'middleware.test.tsx') return false;
    if (basename(t) === 'vitest.setup.tsx') return false;
    const src = toSrcPath(t);
    return !existsSync(src);
});

const driftedTests = testFiles.filter((t) => {
    const rel = relative(testsRoot, t).replaceAll('\\', '/');
    const segs = rel.split('/').slice(0, -1);
    if (segs.length === 0) return false;
    const srcDir = join(srcRoot, ...segs);
    return !existsSync(srcDir);
});

const expectedTestPaths = new Set(srcFiles.map(toTestPath));
const actualTestPaths = new Set(testFiles);

const missingTests = [...expectedTestPaths].filter((p) => {
    if (actualTestPaths.has(p)) return false;
    const srcRel = relative(root, p)
        .replace(/^tests\//, 'src/')
        .replace(/\.test\.(tsx|ts)$/, '.$1');
    return !allowlist.has(srcRel);
});

let failed = false;

const print = (label, items) => {
    if (items.length === 0) return;
    failed = true;
    console.error(`\n${label} (${items.length}):`);
    for (const p of items) console.error('  ' + relative(root, p));
};

print('Drifted test directories (no matching src/)', driftedTests);
print('Orphan tests (test file has no matching src file)', orphanTests);

// Missing tests is currently advisory; do not fail the build on it.
if (missingTests.length > 0) {
    console.warn(`\nAdvisory: ${missingTests.length} source files have no co-located test.`);
    if (verbose) {
        for (const p of missingTests) {
            const srcRel = relative(root, p)
                .replace(/^tests\//, 'src/')
                .replace(/\.test\.(tsx|ts)$/, '.$1');
            console.warn('  ' + srcRel);
        }
    } else {
        console.warn('  Run with --verbose to list them.');
    }
}

if (failed) {
    console.error('\nMirror-path check FAILED.');
    process.exit(1);
}

console.log('Mirror-path check OK.');

