import multiEntry from "@rollup/plugin-multi-entry";
import eslint from "@rollup/plugin-eslint";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";

// dev build if watching, prod build if not
const isProduction = !process.env.ROLLUP_WATCH;

const inputs = [
  	{ 
		file: "src/index.js", 
		type: "main",
		name: "f11y",
		output: "umd/f11y",
	},
  	{
    	file: "src/plugins/toast.js",
    	type: "plugin",
    	name: "Toast",
    	output: "umd/plugins/toast",
  	},
];

const createConfig = (input, name, output, sourcemap) => ({
	input: input,
	output: [
		{
			file: output + ".js",
			format: 'umd',
			name: name,
			sourcemap: sourcemap,
		},
		{
			file: output + ".min.js",
			format: 'umd',
			name: name,
			sourcemap: sourcemap,
			plugins: [isProduction && terser()],
		},
		{
			file: output + ".es.js",
			format: "es",
		},
	],
	plugins: [
		multiEntry(),
		eslint({
			exclude: "node_modules/**",
		}),
		json(),
		babel({
			exclude: "node_modules/**",
			babelHelpers: "bundled",
		}),
		isProduction && filesize(),
	],
});

const configs = inputs.flatMap((input) => {
	if (input.type === "main") {
		return createConfig(
			input.file, 
			input.name, 
			input.output, 
			true
		);
	} else if (input.type === "plugin") {
		return createConfig(
			input.file,
			input.name,
			input.output,
			true
		);
	}
});

export default configs;