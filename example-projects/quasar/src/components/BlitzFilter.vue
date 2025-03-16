<template>
  <div class="blitz-filter q-pb-md">
    <q-card v-if="title || description" class="q-mb-md">
      <q-card-section>
        <div class="text-h6" v-if="title">{{ title }}</div>
        <div class="text-caption" v-if="description">{{ description }}</div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <template v-for="field in schema" :key="field.id">
        <div :class="`col-12 col-md-${field.span ? field.span : 6}`" class="filter-field">
          <component
            :is="field.component"
            v-model="innerValue[field.id]"
            v-bind="getComponentProps(field)"
            @update:model-value="handleFilterChange"
          />
        </div>
      </template>
    </div>

    <div class="filter-actions q-mt-md" v-if="showActions">
      <q-btn
        color="primary"
        :label="applyLabel"
        @click="applyFilters"
        :disabled="!hasChanges"
        class="q-mr-sm"
      />
      <q-btn
        color="secondary"
        outline
        :label="resetLabel"
        @click="resetFilters"
        :disabled="!hasAnyValue"
      />
    </div>

    <slot name="preview">
      <div v-if="showFilterPreview && hasAnyValue" class="filter-preview q-mt-md">
        <q-chip
          v-for="(value, key) in activeFilters"
          :key="key"
          removable
          @remove="clearFilter(key)"
          color="primary"
          text-color="white"
          class="q-ma-xs"
        >
          {{ getFieldLabel(key) }}: {{ formatFilterValue(key, value) }}
        </q-chip>
      </div>
    </slot>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, toRefs } from 'vue'

export default defineComponent({
  name: 'BlitzFilter',
  
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    schema: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    showActions: {
      type: Boolean,
      default: true
    },
    showFilterPreview: {
      type: Boolean,
      default: true
    },
    applyLabel: {
      type: String,
      default: 'Apply Filters'
    },
    resetLabel: {
      type: String,
      default: 'Reset Filters'
    },
    autoApply: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'filter', 'apply', 'reset', 'clear'],
  
  setup(props, { emit }) {
    const { modelValue, schema, autoApply } = toRefs(props)
    
    // Create a working copy of the filter values
    const innerValue = ref({...modelValue.value})
    const originalValue = ref({...modelValue.value})
    
    // Track if filters have been changed but not applied
    const hasChanges = computed(() => {
      return JSON.stringify(innerValue.value) !== JSON.stringify(originalValue.value)
    })
    
    // Check if any filters are active
    const hasAnyValue = computed(() => {
      return Object.values(innerValue.value).some(value => {
        if (value === null || value === undefined) return false
        if (typeof value === 'string' && !value.trim()) return false
        if (Array.isArray(value) && value.length === 0) return false
        if (typeof value === 'object' && Object.keys(value).length === 0) return false
        return true
      })
    })
    
    // Only show active filters in the preview
    const activeFilters = computed(() => {
      const result = {}
      Object.entries(innerValue.value).forEach(([key, value]) => {
        if (value === null || value === undefined) return
        if (typeof value === 'string' && !value.trim()) return
        if (Array.isArray(value) && value.length === 0) return
        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return
        result[key] = value
      })
      return result
    })
    
    // Apply filters to the parent component
    const applyFilters = () => {
      emit('update:modelValue', {...innerValue.value})
      emit('filter', {...innerValue.value})
      emit('apply', {...innerValue.value})
      originalValue.value = {...innerValue.value}
    }
    
    // Reset all filters
    const resetFilters = () => {
      const emptyValue = {}
      schema.value.forEach(field => {
        emptyValue[field.id] = field.defaultValue !== undefined ? field.defaultValue : 
          Array.isArray(innerValue.value[field.id]) ? [] : 
          typeof innerValue.value[field.id] === 'object' && innerValue.value[field.id] !== null ? {} : 
          ''
      })
      innerValue.value = {...emptyValue}
      emit('update:modelValue', {...emptyValue})
      emit('filter', {...emptyValue})
      emit('reset')
      originalValue.value = {...emptyValue}
    }
    
    // Clear a specific filter
    const clearFilter = (fieldId) => {
      const field = schema.value.find(f => f.id === fieldId)
      if (!field) return
      
      innerValue.value[fieldId] = field.defaultValue !== undefined ? field.defaultValue : 
        Array.isArray(innerValue.value[fieldId]) ? [] : 
        typeof innerValue.value[fieldId] === 'object' && innerValue.value[fieldId] !== null ? {} : 
        ''
      
      if (autoApply.value) {
        emit('update:modelValue', {...innerValue.value})
        emit('filter', {...innerValue.value})
      }
      
      emit('clear', fieldId)
    }
    
    // Handle filter changes
    const handleFilterChange = () => {
      if (autoApply.value) {
        applyFilters()
      }
    }
    
    // Format filter values for display in chips
    const formatFilterValue = (fieldId, value) => {
      const field = schema.value.find(f => f.id === fieldId)
      if (!field) return value
      
      // Handle specific types of values
      if (field.options && !Array.isArray(value)) {
        const option = field.options.find(opt => opt.value === value)
        return option ? option.label : value
      }
      
      if (Array.isArray(value)) {
        if (field.options) {
          return value.map(v => {
            const option = field.options.find(opt => opt.value === v)
            return option ? option.label : v
          }).join(', ')
        }
        return value.join(', ')
      }
      
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
      }
      
      if (typeof value === 'object' && value !== null) {
        // Handle range objects
        if ('min' in value || 'max' in value) {
          return `${value.min || 0} - ${value.max || '∞'}`
        }
        if ('from' in value || 'to' in value) {
          return `${value.from || 'Any'} to ${value.to || 'Any'}`
        }
        return JSON.stringify(value)
      }
      
      return value
    }
    
    // Get label for a field by ID
    const getFieldLabel = (fieldId) => {
      const field = schema.value.find(f => f.id === fieldId)
      return field ? field.label : fieldId
    }
    
    // Get component props with Quasar defaults
    const getComponentProps = (field) => {
      // Default props for Quasar components
      const defaultProps = {
        outlined: true,
        dense: true,
        clearable: true,
        class: 'full-width'
      }
      
      // Copy all properties from the field
      return { ...defaultProps, ...field }
    }
    
    // Watch for external changes to modelValue
    watch(modelValue, (newValue) => {
      innerValue.value = {...newValue}
      originalValue.value = {...newValue}
    }, { deep: true })
    
    return {
      innerValue,
      hasChanges,
      hasAnyValue,
      activeFilters,
      applyFilters,
      resetFilters,
      clearFilter,
      handleFilterChange,
      formatFilterValue,
      getFieldLabel,
      getComponentProps
    }
  }
})
</script>

<style scoped>
.blitz-filter {
  position: relative;
}

.filter-field {
  margin-bottom: 8px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
}

.filter-preview {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.full-width {
  width: 100%;
}
</style>
