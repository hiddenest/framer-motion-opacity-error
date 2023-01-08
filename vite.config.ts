import { defineConfig } from 'vite'
import react, { BabelOptions } from '@vitejs/plugin-react'

export const babelOptions = (mode: string = 'production'): BabelOptions => {
  const plugins: BabelOptions['plugins'] = [
    [
      '@emotion/babel-plugin',
      {
        autoLabel: 'always',
        cssPropOptimization: false,
      },
    ],
  ];

  return {
    plugins,
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: babelOptions(),
    }),
  ],
});
