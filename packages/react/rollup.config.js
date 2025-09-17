import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/lib/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    postcss({
      extract: true,
      modules: false,
      use: ['sass'],
      minimize: true,
      sourceMap: true
    })
  ],
  external: ['react', 'react-dom', 'chart.js', '@leafcuttr/libgraphit-core'],
};
