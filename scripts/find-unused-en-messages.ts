import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const en = JSON.parse(readFileSync('messages/en.json', 'utf8')) as Record<string, unknown>;

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

const allKeys = new Set(flatten(en));
const used = new Set<string>();

const skipDirs = new Set(['node_modules', '.svelte-kit', 'project.inlang', 'dist', 'build']);

const patterns = [
	/m\[['"]([A-Za-z0-9_.]+)['"]\]/g,
	/key:\s*['"]([A-Za-z0-9_.]+)['"]/g,
	/message\.key\s*===\s*['"]([A-Za-z0-9_.]+)['"]/g
];

function walk(dir: string) {
	for (const entry of readdirSync(dir)) {
		if (skipDirs.has(entry)) continue;
		const full = join(dir, entry);
		const st = statSync(full);
		if (st.isDirectory()) {
			walk(full);
			continue;
		}
		if (!/\.(ts|svelte|js)$/.test(full)) continue;
		const content = readFileSync(full, 'utf8');
		for (const pattern of patterns) {
			for (const match of content.matchAll(pattern)) {
				used.add(match[1]);
			}
		}
	}
}

walk('src');
walk('scripts');

const unused = [...allKeys].filter((k) => !used.has(k)).sort();
const falsePositives = [...used].filter((k) => !allKeys.has(k)).sort();

console.log(JSON.stringify({ total: allKeys.size, used: used.size, unused, falsePositives }, null, 2));
