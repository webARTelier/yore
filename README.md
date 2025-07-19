# yore - a minimalist front-end framework built for developers who value clarity, structure, and simplicity — just like in the good old days.

<br>

## What is yore?

**yore** is a lightweight SCSS and JavaScript toolbox designed to help you build accessible, fast, and maintainable websites without relying on bloated UI libraries or complex build tools. It embraces modern web standards while honoring the craftsmanship of classic front-end development.

- **Clean, modular SCSS** structure
- **Vanilla JS** with namespaced components
- **Theme-ready** color tokens (light & dark)
- **No dependencies** — works out of the box
- **Flexible by design** — use only what you need

<br>

## Installation

Via npm:

```bash
npm init yore@latest
```

Or clone the repo directly:

```bash
git clone https://github.com/webARTelier/yore.git
```

<br>

## Philosophy

> I'm here to create - not to write configuration files.

**yore** stands for a clear, calm, and dependable way to build websites – inspired by a time when web development was still straightforward. No complex dependencies, no overengineering. Just a structured toolbox with proven best practices, modern techniques, and a focus on readability, maintainability, and pragmatic solutions.

<br>

## Documentation

An online documentation site with examples, usage guides, and best practices is in the works.

Until then, check the `templates/html` folder for live examples.

<br>

## Build Setup

yore uses [Gulp](https://gulpjs.com/) and [Rollup](https://rollupjs.org/) to compile SCSS and bundle JavaScript into minified, production-ready files.

### 1. Prerequisites

Make sure you have **Node.js** (>=18) and **npm** installed. Then install the local dependencies:

```bash
npm install
```

### 2. Available commands

#### 👉 One-time build

Generates minified CSS (`main.min.css`) and JavaScript (`main.min.js`):

```bash
npm run build
```
#### 👉 Start development mode (with file watching)

Watches SCSS and JS files and automatically rebuilds them on change:

```bash
npm run dev
```

### 3. Input/Output paths

- **Input SCSS**: `templates/scss/main.scss`

- **Output CSS**: `templates/css/main.min.css`

- **Input JS**: `templates/js/main.js`

- **Output JS**: `templates/js/main.min.js`

### 4. Notes

- Rollup is configured with `@rollup/plugin-node-resolve` and `@rollup/plugin-terser` for dependency resolution and minification.
- SCSS is compiled with `gulp-dart-sass`, auto-prefixed with `autoprefixer`, and renamed via `gulp-rename`.
- Errors are handled gracefully using `gulp-plumber` and `gulp-notify`.

<br>

## Roadmap

- Publish to npm
- Launch documentation website

<br>

## License

GPL-3.0 License\
© Björn Müller – webartelier.de

