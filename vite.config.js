import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { fileURLToPath, URL } from "node:url";
import fs from "fs";
import createSvgSpritePlugin from "vite-plugin-svg-spriter";
import path from "path";

const SRC_PATH = path.resolve(__dirname, "src");
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, "assets", "svgicons");

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const isProduction = mode === "production";
	const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, "") || "";

	const robotsContent = isProduction
		? `User-agent: *
		Disallow: /*?
		Allow: /
		Sitemap: ${siteUrl}/sitemap.xml`
		: `User-agent: *
		Disallow: /`;

	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url>
				<loc>${siteUrl}/</loc>
				<lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
				<changefreq>monthly</changefreq>
				<priority>1.0</priority>
			</url>
		</urlset>`;

	return {
		base: "/",

		plugins: [
			vue({
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag.startsWith("swiper-") || tag === "nobr",
					},
				},
			}),
			vueDevTools(),
			{
				name: "generate-robots-and-sitemap",
				buildStart() {
					const publicDir = path.resolve("public");

					// Генерация robots.txt
					const robotsPath = path.join(publicDir, "robots.txt");
					fs.writeFileSync(robotsPath, robotsContent);
					console.log(`[robots] Сгенерирован robots.txt для режима ${mode}`);

					if (isProduction) {
						// Генерация sitemap.xml только для продакшена
						const sitemapPath = path.join(publicDir, "sitemap.xml");
						fs.writeFileSync(sitemapPath, sitemapContent);
						console.log(`[sitemap] Сгенерирован sitemap.xml`);
					}
				},
			},

			createSvgSpritePlugin({
				svgFolder: SVG_FOLDER_PATH,
			}),
			
		],

		css: {
			preprocessorOptions: {
				scss: {
					// Только файлы без вывода CSS: они подставляются в начало каждого <style lang="scss">
					additionalData: '@use "@/assets/scss/base/breakpoints" as *; @use "@/assets/scss/base/mixins" as *;',
				},
			},
			devSourcemap: true,
		},

		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},

		assetsInclude: ["**/*.webp", "**/*.webm"],

		build: {
			target: "es2020",
			minify: false,
			sourcemap: true,
			chunkSizeWarningLimit: 1000,

			esbuild: {
				drop: isProduction ? ["console", "debugger"] : [],
			},

			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes("node_modules")) return;

						const groups = {
							three: ["three"],
							"ui-libs": ["@fancyapps/ui", "swiper", "vue3-marquee"],
							"form-libs": ["vee-validate", "yup", "vue-the-mask"],
							utils: ["axios", "mitt"],
							telegram: ["@twa-dev/sdk"], // грузится только при VITE_TELEGRAM_ENABLED=true
							"vue-core": ["@unhead/vue"], // 'vue', 'vue-router', 'pinia',
						};

						for (const [name, pkgs] of Object.entries(groups)) {
							if (pkgs.some((pkg) => id.includes(pkg))) return name;
						}

						return "vendor";
					},
					chunkFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: (assetInfo) => {
						const ext = assetInfo.name.split(".").pop();
						if (/^(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(ext)) return "assets/media/[name]-[hash].[ext]";
						if (/^(png|jpe?g|svg|gif|webp|avif|ico)$/.test(ext)) return "assets/img/[name]-[hash].[ext]";
						if (/^(woff2?|eot|ttf|otf)$/.test(ext)) return "assets/fonts/[name]-[hash].[ext]";
						if (ext === "css") return "assets/css/[name]-[hash].[ext]";
						return "assets/[name]-[hash].[ext]";
					},
				},
			},
		},

		server: {
			port: 3000,
			open: true,
			cors: true,
		},

		preview: {
			port: 4173,
			open: true,
		},

		optimizeDeps: {
			include: ["vue", "vue-router", "pinia", "axios", "mitt"],
		},

		define: {
			__VUE_OPTIONS_API__: false,
			__VUE_PROD_DEVTOOLS__: !isProduction,
		},

		logLevel: "info",
	};
});
