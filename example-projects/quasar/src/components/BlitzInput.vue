<template>
  <div class="blitz-input-container">
    <q-input
      v-if="type !== 'textarea' && type !== 'select'"
      ref="inputRef"
      v-model="valueInner"
      :type="fieldType"
      :label="label"
      :placeholder="placeholder"
      :hint="hint"
      :error="hasError"
      :error-message="errorMessage"
      :loading="isBusy"
      :disable="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :autofocus="autofocus"
      :debounce="debounce"
      :bottom-slots="hasError || !!hint"
      :prefix="prefix"
      :suffix="suffix"
      :autocomplete="autocomplete"
      outlined
      class="full-width"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @keyup.enter="(e) => $emit('enter', e)"
    >
      <template v-if="icon" #prepend>
        <q-icon :name="icon" />
      </template>
      <template v-if="showCheck && !hasError && !isBusy" #append>
        <q-icon name="check" color="positive" />
      </template>
      <template v-for="(_, slot) in $slots" #[slot]="props">
        <slot :name="slot" v-bind="props" />
      </template>
    </q-input>

    <q-select
      v-else-if="type === 'select'"
      ref="inputRef"
      v-model="valueInner"
      :options="options"
      :label="label"
      :placeholder="placeholder"
      :hint="hint"
      :error="hasError"
      :error-message="errorMessage"
      :loading="isBusy"
      :disable="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :autofocus="autofocus"
      :bottom-slots="hasError || !!hint"
      outlined
      class="full-width"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      emit-value
      map-options
    >
      <template v-if="icon" #prepend>
        <q-icon :name="icon" />
      </template>
      <template v-if="showCheck && !hasError && !isBusy" #append>
        <q-icon name="check" color="positive" />
      </template>
      <template v-for="(_, slot) in $slots" #[slot]="props">
        <slot :name="slot" v-bind="props" />
      </template>
    </q-select>

    <q-input
      v-else-if="type === 'textarea'"
      ref="inputRef"
      v-model="valueInner"
      type="textarea"
      :label="label"
      :placeholder="placeholder"
      :hint="hint"
      :error="hasError"
      :error-message="errorMessage"
      :loading="isBusy"
      :disable="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :autofocus="autofocus"
      :autogrow="autogrow"
      :debounce="debounce"
      :rows="rows"
      :bottom-slots="hasError || !!hint"
      outlined
      class="full-width"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @keyup.enter="(e) => $emit('enter', e)"
    >
      <template v-if="icon" #prepend>
        <q-icon :name="icon" />
      </template>
      <template v-if="showCheck && !hasError && !isBusy" #append>
        <q-icon name="check" color="positive" />
      </template>
      <template v-for="(_, slot) in $slots" #[slot]="props">
        <slot :name="slot" v-bind="props" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Define emits
const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'enter'])

// Define props
const props = defineProps({
  /**
   * Material icon name
   */
  icon: {
    type: String,
    default: undefined
  },
  /**
   * Label to display above the input
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Hint text to display below the input
   */
  hint: {
    type: String,
    default: ''
  },
  /**
   * Error message to display when hasError is true
   */
  errorMessage: {
    type: String,
    default: ''
  },
  /**
   * Adds text after input
   */
  suffix: { 
    type: String, 
    default: '' 
  },
  /**
   * Adds text before input
   */
  prefix: { 
    type: String, 
    default: '' 
  },
  /**
   * Shows a check icon on the right side of the input field
   */
  showCheck: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Shows the input in an error state with error styling
   */
  hasError: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Shows a loading indicator on the input
   */
  isBusy: { 
    type: Boolean, 
    default: false 
  },
  /**
   * The input type
   * - Can be 'text', 'textarea', 'select', etc.
   */
  type: {
    type: String,
    default: 'text',
    validator: val => [
      'text', 'textarea', 'select', 'password', 'email', 
      'search', 'tel', 'number', 'url', 'time', 'date'
    ].includes(val)
  },
  /**
   * Options for select type
   */
  options: {
    type: Array,
    default: () => []
  },
  /**
   * Placeholder text
   */
  placeholder: { 
    type: String, 
    default: '' 
  },
  /**
   * Disables the input
   */
  disabled: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Makes the input read-only
   */
  readonly: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Makes the input required
   */
  required: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Sets the autocomplete attribute
   */
  autocomplete: { 
    type: String, 
    default: undefined 
  },
  /**
   * Sets the minimum value (for number inputs)
   */
  min: { 
    type: [String, Number], 
    default: undefined 
  },
  /**
   * Number of rows (for textarea)
   */
  rows: { 
    type: [String, Number], 
    default: 3 
  },
  /**
   * v-model value
   */
  modelValue: { 
    type: [String, Number, Date, Object], 
    default: '' 
  },
  /**
   * Focus the input when mounted
   */
  autofocus: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Automatically grow textarea based on content
   */
  autogrow: { 
    type: Boolean, 
    default: false 
  },
  /**
   * Debounce time in milliseconds
   */
  debounce: { 
    type: Number, 
    default: 0 
  },
  /**
   * Show clear button when input has content
   */
  clearable: { 
    type: Boolean, 
    default: false 
  }
})

// Initialize reactive variables
const inputRef = ref(null)
const valueInner = ref(props.modelValue)
const fieldType = ref(props.type)

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== valueInner.value) {
    valueInner.value = newVal
  }
})

// Watch for internal value changes to emit update
watch(valueInner, (newVal) => {
  emit('update:modelValue', newVal)
})

// Watch for type changes
watch(() => props.type, (newVal) => {
  fieldType.value = newVal
})

// Focus the input component
const focus = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

// Auto-focus on mount if needed
onMounted(() => {
  if (props.autofocus && inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.blitz-input-container {
  width: 100%;
  margin-bottom: 8px;
}
</style>
