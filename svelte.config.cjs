const adapterStatic = require('@sveltejs/adapter-static');
const sveltePreprocess = require("svelte-preprocess")

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	preprocess: sveltePreprocess(),
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		appDir: "app",
		adapter: adapterStatic({
			fallback: 'vtt.html',
		}),
		paths: {
			base: "",
			assets: "chrome-extension://eajefgiobmbhphbljlglolmjpnhnppco",
		},
		prerender: {
			enabled: false,
		},
		ssr: false,
		hydrate: false,
		vite: {
			build: {
				minify: false,
			}
		}
	}
};
