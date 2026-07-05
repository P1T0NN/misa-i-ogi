import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const enPath = 'messages/en.json';
const en = JSON.parse(readFileSync(enPath, 'utf8')) as Record<string, unknown>;

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
	const keys: string[] = [];
	for (const [k, v] of Object.entries(obj)) {
		if (k === '$schema') continue;
		const path = prefix ? `${prefix}.${k}` : k;
		if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
			keys.push(...flatten(v as Record<string, unknown>, path));
		} else {
			keys.push(path);
		}
	}
	return keys;
}

const skipDirs = new Set([
	'node_modules',
	'.svelte-kit',
	'project.inlang',
	'dist',
	'build',
	'paraglide'
]);

function collectSourceFiles(dir: string, files: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (skipDirs.has(entry)) continue;
		const full = join(dir, entry);
		const st = statSync(full);
		if (st.isDirectory()) {
			collectSourceFiles(full, files);
			continue;
		}
		if (!/\.(ts|svelte|js)$/.test(full)) continue;
		files.push(full);
	}
	return files;
}

const sourceFiles = [...collectSourceFiles('src'), ...collectSourceFiles('scripts')].filter(
	(f) =>
		!f.includes('prune-unused-en-messages.ts') &&
		!f.includes('find-unused-en-messages.ts') &&
		!f.includes('unused-en-output.json') &&
		!f.includes(`${join('shared', 'lib', 'paraglide')}`)
);

const corpus = sourceFiles.map((file) => readFileSync(file, 'utf8')).join('\n');

const allKeys = flatten(en);
const unused = allKeys.filter((key) => !corpus.includes(key)).sort();

console.log(`Total keys: ${allKeys.length}`);
console.log(`Unused keys: ${unused.length}`);
console.log(unused.join('\n'));

if (process.argv.includes('--write')) {
	const removePath = (obj: Record<string, unknown>, parts: string[]): void => {
		if (parts.length === 1) {
			delete obj[parts[0]!];
			return;
		}
		const [head, ...rest] = parts;
		const child = obj[head!];
		if (child && typeof child === 'object' && !Array.isArray(child)) {
			removePath(child as Record<string, unknown>, rest);
			if (Object.keys(child as Record<string, unknown>).length === 0) {
				delete obj[head!];
			}
		}
	};

	const pruned = structuredClone(en) as Record<string, unknown>;
	for (const key of unused) {
		removePath(pruned, key.split('.'));
	}

	writeFileSync(enPath, `${JSON.stringify(pruned, null, '\t')}\n`, 'utf8');
	console.log(`Removed ${unused.length} unused keys from ${enPath}`);
}
