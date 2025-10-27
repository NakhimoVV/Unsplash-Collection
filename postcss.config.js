import postcssPxToRem from 'postcss-pxtorem'

export default ({ env }) => {
  const isProduction = env === 'production'
  const plugins = []

  if (isProduction) {
    plugins.push(
      postcssPxToRem({
        propList: ['*'],
        mediaQuery: true,
      }),
    )
  }

  return {
    plugins,
  }
}
