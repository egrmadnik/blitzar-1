<template>
  <div class="blitz-list-form">
    <div class="list-container">
      <div v-for="(item, index) in innerValue" :key="index" class="list-item q-mb-md">
        <q-card class="q-pa-md">
          <div class="row items-center">
            <div class="col-grow">
              <h6 class="q-my-none">{{ itemLabel }} {{ index + 1 }}</h6>
            </div>
            <div>
              <q-btn 
                flat 
                round 
                color="negative" 
                icon="delete" 
                @click="removeItem(index)"
              />
            </div>
          </div>
          
          <div class="row q-col-gutter-md q-mt-md">
            <template v-for="field in schema" :key="field.id">
              <div class="col-12 col-md-6 field-container">
                <component 
                  :is="field.component" 
                  v-model="item[field.id]" 
                  :label="field.label"
                  v-bind="field"
                  :readonly="readonly"
                  :disabled="disabled"
                  outlined
                  dense
                  class="full-width"
                />
              </div>
            </template>
          </div>
        </q-card>
      </div>
      
      <!-- Auto-populate new row when user interacts -->
      <div v-if="(maxItems === undefined || innerValue.length < maxItems) && !disabled && !readonly" class="add-item-container">
        <q-btn 
          color="primary" 
          icon="add" 
          :label="addLabel" 
          @click="addItem"
        />
      </div>
    </div>

    <!-- Show action buttons if provided -->
    <div v-if="actionButtons && actionButtons.length > 0" class="action-buttons q-mt-md">
      <template v-for="(button, buttonIndex) in actionButtons" :key="buttonIndex">
        <q-btn 
          :color="button.color || 'primary'" 
          :icon="button.icon" 
          :label="button.label" 
          :flat="button.flat || false"
          :outline="button.outline || false"
          @click="handleActionButtonClick(button.action, button.handler)"
          class="q-ml-sm"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Declare props for the component
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  schema: {
    type: Array,
    required: true
  },
  labelPosition: {
    type: String,
    default: 'top'
  },
  addLabel: {
    type: String,
    default: 'Add Item'
  },
  itemLabel: {
    type: String,
    default: 'Item'
  },
  maxItems: {
    type: Number,
    default: undefined
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  actionButtons: {
    type: Array,
    default: () => []
  },
  showEmpty: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'add', 'remove', 'action'])

// Create a computed property for two-way binding
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Function to add a new item
function addItem() {
  const newItem = {}
  // Initialize with default values if specified in schema
  props.schema.forEach(field => {
    if (field.defaultValue !== undefined) {
      newItem[field.id] = field.defaultValue
    }
  })
  // Generate a unique ID if needed
  if (!newItem.id) {
    newItem.id = Date.now().toString()
  }
  const newArray = [...innerValue.value, newItem]
  emit('update:modelValue', newArray)
  emit('add', { item: newItem, index: newArray.length - 1 })
}

// Function to remove an item
function removeItem(index) {
  const itemToRemove = innerValue.value[index]
  const newArray = [...innerValue.value]
  newArray.splice(index, 1)
  emit('update:modelValue', newArray)
  emit('remove', { item: itemToRemove, index })
}

// Handle action button clicks
function handleActionButtonClick(action, handler) {
  if (handler && typeof handler === 'function') {
    handler(innerValue.value)
  }
  emit('action', { action, items: innerValue.value })
}
</script>

<style scoped>
.list-item {
  position: relative;
}

.add-item-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.field-container {
  width: 100%;
}

.full-width {
  width: 100%;
}
</style>
