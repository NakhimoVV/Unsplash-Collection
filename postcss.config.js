import postcssPxToRem from 'postcss-pxtorem'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  plugins: [
    isProduction &&
      postcssPxToRem({
        propList: ['*'],
        mediaQuery: true,
      }),
  ].filter(Boolean),
}
