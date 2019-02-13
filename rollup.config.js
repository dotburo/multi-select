import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';
import {eslint} from 'rollup-plugin-eslint';

export default [{
    input: 'src/multi-select.js',
    output: [{
        file: 'dist/multi-select-min.js',
        format: 'es',
        name: 'MultiSelect',
        banner: `/*! ${pkg.name} ${pkg.version} | ${pkg.author} !*/`,
        sourcemap: true
    }],
    plugins: [
        eslint(),
        terser()
    ]
}];
