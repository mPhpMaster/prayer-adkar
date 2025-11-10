# Build Instructions - Node.js/Webpack Setup

## Overview
This project has been configured to build with **Node.js and Webpack** for web deployment on Netlify.

## Technology Stack
- **React** 18.2.0
- **React Native Web** 0.19.10 (converts React Native to web)
- **Webpack** 5.89.0 (bundler)
- **Babel** 7.23.0 (transpiler)
- **Node.js** >= 16

## Project Structure
```
/workspace/
├── App.js                    # Main React Native app component
├── index.web.js              # Web entry point
├── webpack.config.js         # Webpack configuration
├── .babelrc                  # Babel configuration
├── netlify.toml              # Netlify deployment config
├── package.json              # Dependencies and scripts
└── public/
    └── index.html            # HTML template
```

## Local Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```
This will start webpack-dev-server on `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Output will be in the `dist/` directory.

## Netlify Deployment

### Automatic Configuration
The `netlify.toml` file is already configured with:
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 18

### Manual Setup (if needed)
1. In your Netlify dashboard, go to **Site settings** → **Build & deploy**
2. Set the following:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Deploy!

## How It Works

1. **Webpack** bundles the application
2. **Babel** transpiles React/JSX to JavaScript
3. **react-native-web** converts React Native components to web equivalents
4. Output is static HTML/JS/CSS in the `dist/` folder
5. Netlify serves the static files

## Build Process Flow
```
index.web.js 
    ↓
App.js (React Native components)
    ↓
react-native-web (converts to React DOM)
    ↓
Babel (transpiles JSX/ES6+)
    ↓
Webpack (bundles everything)
    ↓
dist/bundle.[hash].js + dist/index.html
```

## Key Features
- ✅ No Expo CLI required (pure Node.js/Webpack)
- ✅ React Native to Web conversion via react-native-web
- ✅ Production-optimized builds with code splitting
- ✅ Hot Module Replacement (HMR) in development
- ✅ RTL (Right-to-Left) support for Arabic
- ✅ AsyncStorage fallback for web

## Troubleshooting

### Build fails on Netlify
- Ensure Node version is >= 16
- Check that all dependencies are in `package.json`
- Clear build cache in Netlify dashboard

### Components not rendering correctly
- Some React Native components need special handling for web
- Check `webpack.config.js` aliases for component mappings

### AsyncStorage not working
- The webpack config aliases AsyncStorage to react-native-web's implementation
- For production, consider using localStorage polyfill

## Scripts Reference
- `npm start` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

## Environment Variables
Set in Netlify dashboard under **Site settings** → **Environment variables** if needed.

## Support
For issues, check:
1. Webpack documentation: https://webpack.js.org
2. react-native-web: https://necolas.github.io/react-native-web/
3. Netlify docs: https://docs.netlify.com
