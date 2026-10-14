import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const INPUT_DIRS = ['./public/img', './src/assets/img'];
const QUALITY_WEBP = 85;
const QUALITY_AVIF = 80;
const SKIP_EXTENSIONS = ['.avif', '.webp', '.svg', '.ico', ''];  // '' — файлы без расширения (.DS_Store)

async function getFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...await getFiles(fullPath));
		} else if (entry.isFile()) {
			const ext = extname(entry.name).toLowerCase();
			if (!SKIP_EXTENSIONS.includes(ext)) {
				files.push(fullPath);
			}
		}
	}
	return files;
}

async function convert(filePath) {
	const ext = extname(filePath).toLowerCase();
	const base = filePath.slice(0, -ext.length);

	const webpPath = `${base}.webp`;
	const avifPath = `${base}.avif`;

	let converted = 0;

	try {
		await stat(webpPath);
	} catch {
		try {
			await sharp(filePath).webp({ quality: QUALITY_WEBP }).toFile(webpPath);
			converted++;
			console.log(`  webp → ${webpPath}`);
		} catch (e) {
			console.warn(`  пропущен (${e.message}): ${filePath}`);
			return 0;
		}
	}

	try {
		await stat(avifPath);
	} catch {
		try {
			await sharp(filePath).avif({ quality: QUALITY_AVIF }).toFile(avifPath);
			converted++;
			console.log(`  avif → ${avifPath}`);
		} catch (e) {
			console.warn(`  пропущен avif (${e.message}): ${filePath}`);
		}
	}

	return converted;
}

const files = [];
for (const dir of INPUT_DIRS) {
	files.push(...await getFiles(dir));
}
console.log(`Найдено файлов: ${files.length}\n`);

let total = 0;
for (const file of files) {
	const count = await convert(file);
	total += count;
}

console.log(`\nГотово. Сконвертировано: ${total} файлов.`);
