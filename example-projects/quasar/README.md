# Example Quasar (example-quasar)

Blitzar example project with Quasar using Vue 3 Composition API and ESM modules.

## Project Overview

This example demonstrates how to use Blitzar components with Quasar in a modern Vue 3 application. The project has been migrated to:

1. Use ES Modules (ESM) syntax throughout the codebase
2. Implement Vue 3's Composition API with `<script setup>` syntax
3. Use Vite as the build tool through @quasar/app-vite

## Vue 3 Composition API Implementation

This project demonstrates modern Vue 3 practices by using the Composition API with the `<script setup>` syntax, which offers several advantages:

### Benefits

- **More concise code**: Less boilerplate compared to Options API
- **Better organization**: Logic is grouped by feature rather than by lifecycle
- **Improved TypeScript integration**: Better type inference with `<script setup>`
- **Enhanced reusability**: Logic can be extracted into composable functions
- **Runtime performance**: The `<script setup>` syntax provides compilation optimizations

### Example Usage

Instead of the traditional Options API pattern:

```js
export default {
  components: { BlitzForm },
  data() {
    return {
      formData: {}
    }
  }
}
```

We now use the more concise Composition API with `<script setup>`:

```js
<script setup>
import { ref } from 'vue'
import BlitzForm from '../components/BlitzForm.vue'

const formData = ref({})
</script>

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Build the app for production

```bash
quasar build
```

### ESM Configuration

This project uses ES Modules throughout:

- `"type": "module"` is set in package.json
- Configuration files use ESM syntax (babel.config.js, vite.config.js, etc.)
- Import/export statements use ESM syntax

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
