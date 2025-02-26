import print from '../lib/console/index.ts';
import buildComponentMap from '../lib/helpers/buildComponentMap.ts';
import { decoder, ENTRY_POINT, OUTPUT_DIR } from '../lib/index.ts';
import injectComponents from '../lib/helpers/injectComponents.ts';
import parse from '../lib/helpers/parser/dom.ts';
import { writeOutput } from '../lib/helpers/fs/writeOutput.ts';

const build = () => {
	try {
		print.fancy('Starting optimized build...');

		// Build Map of Known Components
		const components = buildComponentMap();

		// Parse the entry point and inject components
		const entry = decoder.decode(Deno.readFileSync(ENTRY_POINT));
		const doc = parse(entry, 'text/html');
		const injected = injectComponents(components, doc);

		// Write the output
		const output = injected?.documentElement?.outerHTML ?? '';
		if (!output.length) {
			throw new Error(
				`Attempted to write zero length output to ${OUTPUT_DIR}`,
			);
		}

		if (writeOutput(output)) {
			print.standard(`compiled to ${OUTPUT_DIR}/index.html`);
		}

		print.success('Build completed!');
	} catch (e) {
		print.fail('Build failed!');
		console.error(e);
		return;
	}
};

build();
