const path = require('path')

module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
    postcss: {
      plugins: [require('postcss-rtl')()]
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks'),
      '@api': path.resolve(__dirname, 'src/utility/api'),
      '@const': path.resolve(__dirname, 'src/const/const'),
      '@formError': path.resolve(__dirname, 'src/const/formError'),
      '@routes': path.resolve(__dirname, 'src/const/routes'),
      '@validations': path.resolve(__dirname, 'src/validations'),
      '@service': path.resolve(__dirname, 'src/service'),
      '@storage': path.resolve(__dirname, 'src/const/storageStrings'),
      '@strings': path.resolve(__dirname, 'src/strings/counselor'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@toast': path.resolve(__dirname, 'src/utility/toast'),
      '@commonFunc': path.resolve(__dirname, 'src/const/commonFunc')
    }
  }
}
