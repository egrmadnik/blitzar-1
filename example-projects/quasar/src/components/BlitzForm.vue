<template>
  <div class="blitz-form">
    <div class="blitz-form__grid" :style="gridStyles">
      <slot name="prepend" />
      <template v-for="(field, fieldIndex) of formattedSchema" :key="field.id || fieldIndex">
        <div 
          v-if="field.component" 
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
            @update:model-value="handleUpdate(field.id, $event)"
          />
        </div>
        <div 
          v-else 
          :style="{ 
            gridColumn: `span ${field.span || 1}`, 
            gridRow: field.rowSpan ? `span ${field.rowSpan}` : 'auto'
          }"
        />
      </template>
      <slot name="append" />
    </div>
    <pre v-if="debug">{{ JSON.stringify(modelValue, null, 2) }}</pre>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watchEffect } from 'vue'

export default defineComponent({
  name: 'BlitzForm',
  props: {
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
    internalLabels: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const fieldModels = ref({})
    
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
    
    const handleUpdate = (id, value) => {
      emit('update:modelValue', { ...props.modelValue, [id]: value })
    }
    
    return {
      fieldModels,
      formattedSchema,
      gridStyles,
      handleUpdate
    }
  }
})
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
</style>
