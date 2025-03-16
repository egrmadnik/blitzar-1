<template>
  <div class="blitz-table">
    <div v-if="title || description" class="table-header q-mb-md">
      <h5 v-if="title" class="q-my-sm">{{ title }}</h5>
      <p v-if="description" class="q-my-sm text-grey-7">{{ description }}</p>
    </div>

    <!-- Table Actions Row -->
    <div v-if="$slots.actions || showSearch" class="row q-mb-md items-center justify-between">
      <div v-if="$slots.actions" class="col-auto">
        <slot name="actions"></slot>
      </div>
      <div v-if="showSearch" class="col-auto ml-auto">
        <q-input
          v-model="searchQuery"
          dense
          outlined
          placeholder="Search..."
          class="table-search"
          @update:model-value="onSearch"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Main Table -->
    <q-table
      :rows="filteredRows"
      :columns="tableColumns"
      :row-key="rowKey"
      :pagination="innerPagination"
      :loading="loading"
      @request="onRequest"
      @row-click="onRowClick"
      :selection="selectionType"
      :selected="innerSelected"
      @selection="handleSelection"
      v-bind="tableProps"
    >
      <!-- Custom Header Slots -->
      <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>

      <!-- Selection Column -->
      <template v-slot:header-selection="slotProps">
        <q-checkbox v-model="slotProps.selected" />
      </template>

      <!-- Body Cell Slot -->
      <template v-slot:body-cell="slotProps">
        <q-td :props="slotProps">
          <slot :name="`cell-${slotProps.col.name}`" v-bind="slotProps">
            {{ getCellValue(slotProps.row, slotProps.col) }}
          </slot>
        </q-td>
      </template>

      <!-- Actions Column -->
      <template v-slot:body-cell-actions="slotProps">
        <q-td :props="slotProps">
          <div class="row no-wrap justify-center">
            <slot name="row-actions" v-bind="slotProps">
              <q-btn
                v-if="showEditAction"
                flat
                round
                dense
                color="primary"
                icon="edit"
                @click.stop="onEditRow(slotProps.row)"
              />
              <q-btn
                v-if="showDeleteAction"
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click.stop="onDeleteRow(slotProps.row)"
              />
            </slot>
          </div>
        </q-td>
      </template>

      <!-- Loading Slot -->
      <template v-slot:loading>
        <q-inner-loading showing>
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
      </template>

      <!-- No Data Slot -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm text-grey-7 q-pa-lg">
          <q-icon name="info" size="2em" />
          <span>{{ noDataLabel }}</span>
        </div>
      </template>

      <!-- Pagination Slot -->
      <template v-slot:pagination="scope">
        <q-pagination
          v-if="showPagination"
          v-model="scope.pagination.page"
          :max="scope.pagesNumber"
          :direction-links="true"
          :boundary-links="true"
          @update:model-value="scope.setPagination"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, toRefs } from 'vue'

export default defineComponent({
  name: 'BlitzTable',

  props: {
    /**
     * Table title that appears above the table
     */
    title: {
      type: String,
      default: ''
    },
    
    /**
     * Table description that appears below title
     */
    description: {
      type: String,
      default: ''
    },
    
    /**
     * Array of column definitions
     */
    columns: {
      type: Array,
      required: true
    },
    
    /**
     * Array of row data
     */
    rows: {
      type: Array,
      default: () => []
    },
    
    /**
     * Property that uniquely identifies each row
     */
    rowKey: {
      type: String,
      default: 'id'
    },
    
    /**
     * Controls whether the search input is displayed
     */
    showSearch: {
      type: Boolean,
      default: true
    },
    
    /**
     * Custom search function that filters rows
     */
    searchFn: {
      type: Function,
      default: null
    },
    
    /**
     * Initial pagination settings
     */
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        rowsPerPage: 10,
        sortBy: '',
        descending: false
      })
    },
    
    /**
     * Controls whether pagination is displayed
     */
    showPagination: {
      type: Boolean,
      default: true
    },
    
    /**
     * Indicates if table is in loading state
     */
    loading: {
      type: Boolean,
      default: false
    },
    
    /**
     * Label shown when no data is available
     */
    noDataLabel: {
      type: String,
      default: 'No data available'
    },
    
    /**
     * Type of row selection ('single', 'multiple', or null)
     */
    selectionType: {
      type: String,
      default: null,
      validator: (value) => ['single', 'multiple', null].includes(value)
    },
    
    /**
     * Array of selected rows
     */
    selected: {
      type: Array,
      default: () => []
    },
    
    /**
     * Controls whether the edit action button is displayed
     */
    showEditAction: {
      type: Boolean,
      default: false
    },
    
    /**
     * Controls whether the delete action button is displayed
     */
    showDeleteAction: {
      type: Boolean,
      default: false
    },
    
    /**
     * Additional props to pass to q-table
     */
    tableProps: {
      type: Object,
      default: () => ({})
    }
  },

  emits: [
    'update:pagination',
    'request',
    'row-click',
    'update:selected',
    'edit',
    'delete',
    'search'
  ],

  setup(props, { emit }) {
    const {
      pagination,
      rows,
      columns,
      searchFn,
      selected
    } = toRefs(props)

    // Internal state
    const searchQuery = ref('')
    const innerPagination = ref({...pagination.value})
    const innerSelected = ref([...selected.value])

    // Computed properties
    const tableColumns = computed(() => {
      const cols = [...columns.value]
      
      // Add actions column if needed
      if (props.showEditAction || props.showDeleteAction) {
        const hasActionsCol = cols.some(col => col.name === 'actions')
        if (!hasActionsCol) {
          cols.push({
            name: 'actions',
            label: 'Actions',
            field: 'actions',
            align: 'center',
            sortable: false
          })
        }
      }
      
      return cols
    })

    // Filter rows based on search query
    const filteredRows = computed(() => {
      if (!searchQuery.value.trim()) {
        return rows.value
      }
      
      // Use custom search function if provided
      if (searchFn.value) {
        return searchFn.value(rows.value, searchQuery.value)
      }
      
      // Default search implementation
      const query = searchQuery.value.toLowerCase()
      return rows.value.filter(row => {
        return columns.value.some(column => {
          const value = getCellValue(row, column)
          return value != null && String(value).toLowerCase().includes(query)
        })
      })
    })

    // Handle pagination change
    const onRequest = (props) => {
      innerPagination.value = props.pagination
      emit('update:pagination', props.pagination)
      emit('request', props)
    }

    // Handle row click
    const onRowClick = (event, row, index) => {
      emit('row-click', { event, row, index })
    }

    // Handle search
    const onSearch = (value) => {
      emit('search', value)
    }

    // Get the value to display in a cell
    const getCellValue = (row, column) => {
      if (column.format && typeof column.format === 'function') {
        return column.format(row[column.field], row)
      }
      
      // Support dot notation for nested properties
      if (column.field && column.field.includes('.')) {
        const fields = column.field.split('.')
        let value = row
        for (const field of fields) {
          value = value && value[field]
        }
        return value
      }
      
      return row[column.field]
    }

    // Handle selection
    const handleSelection = (selection) => {
      innerSelected.value = selection
      emit('update:selected', selection)
    }

    // Row actions
    const onEditRow = (row) => {
      emit('edit', row)
    }

    const onDeleteRow = (row) => {
      emit('delete', row)
    }

    // Watch for external changes to pagination and selected
    watch(pagination, (newVal) => {
      innerPagination.value = {...newVal}
    }, { deep: true })

    watch(selected, (newVal) => {
      innerSelected.value = [...newVal]
    }, { deep: true })

    return {
      searchQuery,
      innerPagination,
      innerSelected,
      tableColumns,
      filteredRows,
      onRequest,
      onRowClick,
      onSearch,
      getCellValue,
      handleSelection,
      onEditRow,
      onDeleteRow
    }
  }
})
</script>

<style scoped>
.blitz-table {
  width: 100%;
}

.table-search {
  width: 250px;
}

.table-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 8px;
}
</style>
