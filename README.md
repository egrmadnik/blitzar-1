### Configuration Files:

Updated all configuration files to use ESM syntax (babel.config.js, quasar.config.js, .postcssrc.js, etc.)
Created a vite.config.js to work with the Vite-based build system
Added "type": "module" to package.json to specify ESM mode
Component Integration:
Created a local version of the BlitzForm component to avoid monorepo dependency resolution issues
Updated import paths to use relative paths for local components
HTML Structure:
Added an index.html file required by Vite-based applications

### Resolved Issues:

Monorepo Dependency Resolution: Instead of trying to use the workspace references directly (which would have required building all the packages), we created a simplified local version of the BlitzForm component.
ESM Compatibility: All JavaScript files now use ESM syntax with proper imports/exports, making them compatible with Node.js v20.
Development Server: The Quasar dev server now runs successfully with Vite.

![hero](media/blitzar-hero.png?raw=true)

## Example Projects

### Quasar

[Quasar Example](https://67d707e191f46dbc990f9992--blitzar-quasar-examples.netlify.app/)

### Vue

[Vue Example](https://blitzar.cycraft.co/example-projects/vue)

# Blitzar

Generate Vue Forms and Data-tables fast with a simple JSON-like syntax ⚡️

```sh
npm i blitzar
```

## Documentation

**Vue 3**<br />
[blitzar.cycraft.co](https://blitzar.cycraft.co)

**Vue 2**<br />
[blitzar0.web.app](https://blitzar0.web.app)

## Motivation

Check out this blog post to understand my motivation for creating Blitzar:
[Better, Faster Vue Forms with Blitzar](https://lucaban.medium.com/better-faster-vue-forms-with-blitzar-a0d71258a3bb)

## Meet the family

![](media/familar-hero.png?raw=true)

- [Magnetar](https://github.com/cycraft/magnetar) 🌟
  > State-management done right with automatic sync to remote databases and services. Framework-agnostic & optimistic-UI built-in
- [Blitzar](https://github.com/cycraft/blitzar) ⚡️
  > Generate Vue Forms and Data-tables fast with a simple JSON-like syntax
- [Planetar](https://github.com/cycraft/planetar) 🪐
  > A Vue framework for creating a design system styleguide with interactive component explorer
