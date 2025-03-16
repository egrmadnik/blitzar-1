<template>
  <div class="blitz-form">
    <div v-if="actionButtons && actionButtons.includes('edit') && mode === 'readonly'" class="blitz-form__actions q-mb-md">
      <q-btn color="primary" icon="edit" label="Edit" @click="handleEdit" />
    </div>

    <div class="blitz-form__grid" :style="gridStyles">
      <slot name="prepend" />
      <template v-for="(field, fieldIndex) of formattedSchema" :key="field.id || fieldIndex">
        <div 
          v-if="field.component && (!field.condition || evaluateCondition(field.condition))" 
          :style="{ 
            gridColumn: `span ${field.span || 1}`, 
            gridRow: field.rowSpan ? `span ${field.rowSpan}` : 'auto'
          }"
          class="blitz-form__field-wrapper"
        >
          <component 
            :is="field.component" 
            v-model="fieldModels[field.id]"
            v-bind="field"
            :readonly="mode === 'readonly' || field.readonly"
            :disabled="mode === 'disabled' || field.disabled"
            :label-position="labelPosition"
            @update:model-value="handleUpdate(field.id, $event)"
          />
        </div>
        <div 
          v-else-if="!field.condition || evaluateCondition(field.condition)"
          :style="{ 
            gridColumn: `span ${field.span || 1}`, 
            gridRow: field.rowSpan ? `span ${field.rowSpan}` : 'auto'
          }"
        />
      </template>
      <slot name="append" />
    </div>

    <div v-if="(actionButtons && actionButtons.length > 0) && mode === 'edit'" class="blitz-form__actions q-mt-md">
      <q-btn 
        v-if="actionButtons.includes('save')"
        color="positive" 
        icon="save" 
        label="Save" 
        @click="handleSave"
      />
      <q-btn 
        v-if="actionButtons.includes('cancel')"
        color="warning" 
        icon="cancel" 
        label="Cancel" 
        class="q-ml-sm"
        @click="handleCancel"
      />
      <q-btn 
        v-if="actionButtons.includes('delete')"
        color="negative" 
        icon="delete" 
        label="Delete" 
        class="q-ml-sm"
        @click="handleDelete"
      />
    </div>

    <pre v-if="debug">{{ JSON.stringify(modelValue, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, reactive, onMounted } from 'vue'
import { cloneDeep } from 'lodash'

// Define props with defineProps macro
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  schema: {
    type: Array,
    required: true
  },
  columnCount: {
    type: Number,
    default: 1
  },
  gridGap: {
    type: String,
    default: '1rem'
  },
  labelPosition: {
    type: String,
    default: 'inline',
    validator: (value) => ['top', 'inline', 'left'].includes(value)
  },
  internalLabels: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'edit',
    validator: (value) => ['edit', 'readonly', 'disabled'].includes(value)
  },
  actionButtons: {
    type: Array,
    default: () => []
  },
  debug: {
    type: Boolean,
    default: false
  }
})

// Define emits with defineEmits macro
const emit = defineEmits([
  'update:modelValue', 
  'edit', 
  'save', 
  'cancel', 
  'delete', 
  'validate'
])

const fieldModels = ref({})
const originalData = ref({})
const isFormValid = ref(true)
const validationErrors = ref([])

// Clone the original data for cancel operations
onMounted(() => {
  originalData.value = cloneDeep(props.modelValue)
})

const formattedSchema = computed(() => {
  return props.schema.map(field => {
    // Apply default values to the model
    if (field.id && field.defaultValue !== undefined && props.modelValue[field.id] === undefined) {
      const defaultValue = typeof field.defaultValue === 'function' 
        ? field.defaultValue() 
        : field.defaultValue
      emit('update:modelValue', { ...props.modelValue, [field.id]: defaultValue })
    }
    return field
  })
})

const gridStyles = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columnCount}, 1fr)`,
    gap: props.gridGap
  }
})

// Sync models with parent
watchEffect(() => {
  // Update local models from parent
  formattedSchema.value.forEach(field => {
    if (field.id) {
      fieldModels.value[field.id] = props.modelValue[field.id]
    }
  })
})

const evaluateCondition = (condition) => {
  if (typeof condition === 'function') {
    return condition(props.modelValue)
  }
  return condition
}

const handleUpdate = (id, value) => {
  emit('update:modelValue', { ...props.modelValue, [id]: value })
}

const validateForm = () => {
  validationErrors.value = []
  isFormValid.value = true

  // Check each field with rules
  formattedSchema.value.forEach(field => {
    if (field.rules && Array.isArray(field.rules)) {
      field.rules.forEach(rule => {
        if (typeof rule === 'function') {
          const result = rule(props.modelValue[field.id])
          if (result !== true) {
            isFormValid.value = false
            validationErrors.value.push({
              field: field.id,
              message: result
            })
          }
        }
      })
    }
  })

  return isFormValid.value
}

// Action button handlers
const handleEdit = () => {
  emit('edit')
}

const handleSave = () => {
  if (validateForm()) {
    emit('save', { 
      newData: props.modelValue, 
      oldData: originalData.value,
      isValid: true
    })
    originalData.value = cloneDeep(props.modelValue)
  } else {
    emit('save', { 
      newData: props.modelValue, 
      oldData: originalData.value,
      isValid: false,
      errors: validationErrors.value
    })
  }
}

const handleCancel = () => {
  emit('update:modelValue', cloneDeep(originalData.value))
  emit('cancel')
}

const handleDelete = () => {
  emit('delete')
}
</script>

<style>
.blitz-form {
  width: 100%;
}

.blitz-form__grid {
  width: 100%;
}

.blitz-form__field-wrapper {
  margin-bottom: 0.5rem;
}

.blitz-form__actions {
  display: flex;
  justify-content: flex-start;
}
</style>
