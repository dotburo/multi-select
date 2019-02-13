import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

export default [{
    input: 'src/multi-select.js',
    output: [{
        file: 'dist/multi-select-umd.js',
        format: 'umd',
        name: 'MultiSelect',
        sourcemap: true,
        banner: `/*! ${pkg.name} ${pkg.version} | ${pkg.author} !*/`
    }],
    plugins: [
        resolve(),
        commonjs(),
        babel(),
        terser()
    ]
}];
