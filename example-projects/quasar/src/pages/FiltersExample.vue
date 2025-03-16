<template>
  <q-page padding>
    <div class="q-pa-md">
      <h3>BlitzFilter Examples</h3>
      
      <div class="q-my-lg">
        <q-card class="q-pa-md">
          <h5>Basic Filters</h5>
          <p>Simple filter example with text search and selection filters</p>
          
          <BlitzFilter
            v-model="basicFiltersValue"
            :schema="basicFiltersSchema"
            title="Search & Filter"
            description="Filter the data using the options below"
            class="q-mb-md"
            @filter="onBasicFilter"
          />
          
          <div class="q-mt-md">
            <h6>Filter value:</h6>
            <pre>{{ basicFiltersValue }}</pre>
            
            <h6>Filtered results:</h6>
            <q-table 
              :rows="filteredBasicItems" 
              :columns="basicColumns" 
              row-key="id"
              flat
              bordered
            />
          </div>
        </q-card>
      </div>
      
      <div class="q-my-lg">
        <q-card class="q-pa-md">
          <h5>Advanced Filters</h5>
          <p>More advanced filter options with date range, numeric range, and multi-select filters</p>
          
          <BlitzFilter
            v-model="advancedFiltersValue"
            :schema="advancedFiltersSchema"
            title="Advanced Search"
            auto-apply
            show-filter-preview
            class="q-mb-md"
            @filter="onAdvancedFilter"
          />
          
          <div class="q-mt-md">
            <h6>Filter value:</h6>
            <pre>{{ advancedFiltersValue }}</pre>
            
            <h6>Filtered results:</h6>
            <q-table 
              :rows="filteredAdvancedItems" 
              :columns="advancedColumns" 
              row-key="id"
              flat
              bordered
            />
          </div>
        </q-card>
      </div>
      
      <div class="q-my-lg">
        <q-card class="q-pa-md">
          <h5>Custom Styled Filters</h5>
          <p>Filters with custom styling and layout</p>
          
          <BlitzFilter
            v-model="customFiltersValue"
            :schema="customFiltersSchema"
            apply-label="Search Products"
            reset-label="Clear All"
            class="q-mb-md custom-filters"
            @filter="onCustomFilter"
          />
          
          <div class="q-mt-md">
            <h6>Filter value:</h6>
            <pre>{{ customFiltersValue }}</pre>
            
            <h6>Filtered results:</h6>
            <q-table 
              :rows="filteredCustomItems" 
              :columns="customColumns" 
              row-key="id"
              flat
              bordered
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import BlitzFilter from '../components/BlitzFilter.vue'

// Basic Filters Example
const basicFiltersValue = ref({
  search: '',
  status: ''
})

const basicFiltersSchema = [
  {
    id: 'search',
    component: 'QInput',
    label: 'Search',
    clearable: true,
    outlined: true,
    dense: true,
    debounce: 300,
    span: 6
  },
  {
    id: 'status',
    component: 'QSelect',
    label: 'Status',
    clearable: true,
    outlined: true,
    dense: true,
    span: 6,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ]
  }
]

const basicItems = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', status: 'inactive' }
]

const basicColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true }
]

const filteredBasicItems = computed(() => {
  return basicItems.filter(item => {
    // Filter by search term
    if (basicFiltersValue.value.search && 
        !item.name.toLowerCase().includes(basicFiltersValue.value.search.toLowerCase()) &&
        !item.email.toLowerCase().includes(basicFiltersValue.value.search.toLowerCase())) {
      return false
    }
    
    // Filter by status
    if (basicFiltersValue.value.status && item.status !== basicFiltersValue.value.status) {
      return false
    }
    
    return true
  })
})

const onBasicFilter = (filters) => {
  console.log('Basic filters applied:', filters)
}

// Advanced Filters Example
const advancedFiltersValue = ref({
  dateRange: { from: '', to: '' },
  priceRange: { min: null, max: null },
  categories: []
})

const advancedFiltersSchema = [
  {
    id: 'dateRange',
    span: 6,
    component: 'QRange',
    type: 'date',
    label: 'Date Range',
    subLabel: 'Select start and end dates',
    from: {
      component: 'QDate',
      label: 'From',
      clearable: true,
      outlined: true
    },
    to: {
      component: 'QDate',
      label: 'To',
      clearable: true,
      outlined: true
    }
  },
  {
    id: 'priceRange',
    span: 6,
    component: 'QRange',
    label: 'Price Range',
    subLabel: 'Filter by price',
    min: {
      component: 'QInput',
      label: 'Min Price',
      type: 'number',
      clearable: true,
      outlined: true,
      dense: true
    },
    max: {
      component: 'QInput',
      label: 'Max Price',
      type: 'number',
      clearable: true,
      outlined: true,
      dense: true
    }
  },
  {
    id: 'categories',
    component: 'QSelect',
    label: 'Categories',
    multiple: true,
    clearable: true,
    outlined: true,
    dense: true,
    span: 12,
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Books', value: 'books' },
      { label: 'Home & Garden', value: 'home' },
      { label: 'Sports', value: 'sports' }
    ]
  }
]

const advancedItems = [
  { id: 101, product: 'Laptop', price: 1200, category: 'electronics', date: '2025-01-15' },
  { id: 102, product: 'T-shirt', price: 25, category: 'clothing', date: '2025-02-20' },
  { id: 103, product: 'Novel', price: 15, category: 'books', date: '2025-01-05' },
  { id: 104, product: 'Plant Pot', price: 45, category: 'home', date: '2025-03-10' },
  { id: 105, product: 'Fitness Tracker', price: 150, category: 'electronics', date: '2025-02-05' },
  { id: 106, product: 'Basketball', price: 35, category: 'sports', date: '2025-03-01' },
  { id: 107, product: 'Desk Lamp', price: 65, category: 'home', date: '2025-01-25' }
]

const advancedColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'product', label: 'Product', field: 'product', sortable: true },
  { name: 'price', label: 'Price', field: 'price', sortable: true },
  { name: 'category', label: 'Category', field: 'category', sortable: true },
  { name: 'date', label: 'Date', field: 'date', sortable: true }
]

const filteredAdvancedItems = computed(() => {
  return advancedItems.filter(item => {
    // Filter by date range
    if (advancedFiltersValue.value.dateRange.from && advancedFiltersValue.value.dateRange.to) {
      const itemDate = new Date(item.date)
      const fromDate = new Date(advancedFiltersValue.value.dateRange.from)
      const toDate = new Date(advancedFiltersValue.value.dateRange.to)
      
      if (itemDate < fromDate || itemDate > toDate) {
        return false
      }
    }
    
    // Filter by price range
    if (advancedFiltersValue.value.priceRange.min !== null && item.price < advancedFiltersValue.value.priceRange.min) {
      return false
    }
    
    if (advancedFiltersValue.value.priceRange.max !== null && item.price > advancedFiltersValue.value.priceRange.max) {
      return false
    }
    
    // Filter by categories
    if (advancedFiltersValue.value.categories && advancedFiltersValue.value.categories.length > 0) {
      if (!advancedFiltersValue.value.categories.includes(item.category)) {
        return false
      }
    }
    
    return true
  })
})

const onAdvancedFilter = (filters) => {
  console.log('Advanced filters applied:', filters)
}

// Custom Styled Filters Example
const customFiltersValue = ref({
  keyword: '',
  price: null,
  inStock: true
})

const customFiltersSchema = [
  {
    id: 'keyword',
    component: 'QInput',
    label: 'Keyword',
    placeholder: 'Search products...',
    clearable: true,
    outlined: true,
    dense: true,
    class: 'custom-input',
    span: 12
  },
  {
    id: 'price',
    component: 'QSelect',
    label: 'Price',
    clearable: true,
    outlined: true,
    dense: true,
    class: 'custom-select',
    span: 6,
    options: [
      { label: 'Under $50', value: 'under50' },
      { label: '$50 - $100', value: '50to100' },
      { label: '$100 - $200', value: '100to200' },
      { label: 'Over $200', value: 'over200' }
    ]
  },
  {
    id: 'inStock',
    component: 'QToggle',
    label: 'In Stock Only',
    span: 6,
    class: 'custom-toggle'
  }
]

const customItems = [
  { id: 201, name: 'Smart Watch', price: 199, inStock: true },
  { id: 202, name: 'Headphones', price: 89, inStock: true },
  { id: 203, name: 'Bluetooth Speaker', price: 45, inStock: false },
  { id: 204, name: 'Gaming Console', price: 399, inStock: true },
  { id: 205, name: 'Phone Case', price: 15, inStock: true },
  { id: 206, name: 'Wireless Charger', price: 35, inStock: false },
  { id: 207, name: 'External SSD', price: 129, inStock: true }
]

const customColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Product Name', field: 'name', sortable: true },
  { name: 'price', label: 'Price ($)', field: 'price', sortable: true },
  { name: 'inStock', label: 'In Stock', field: 'inStock', sortable: true,
    format: val => val ? 'Yes' : 'No' }
]

const getPriceRange = (priceFilter) => {
  switch (priceFilter) {
    case 'under50': return { min: 0, max: 49.99 }
    case '50to100': return { min: 50, max: 99.99 }
    case '100to200': return { min: 100, max: 199.99 }
    case 'over200': return { min: 200, max: Infinity }
    default: return { min: 0, max: Infinity }
  }
}

const filteredCustomItems = computed(() => {
  return customItems.filter(item => {
    // Filter by keyword
    if (customFiltersValue.value.keyword && 
        !item.name.toLowerCase().includes(customFiltersValue.value.keyword.toLowerCase())) {
      return false
    }
    
    // Filter by price range
    if (customFiltersValue.value.price) {
      const priceRange = getPriceRange(customFiltersValue.value.price)
      if (item.price < priceRange.min || item.price > priceRange.max) {
        return false
      }
    }
    
    // Filter by stock status
    if (customFiltersValue.value.inStock && !item.inStock) {
      return false
    }
    
    return true
  })
})

const onCustomFilter = (filters) => {
  console.log('Custom filters applied:', filters)
}
</script>

<style scoped>
.custom-filters .q-field {
  margin-bottom: 8px;
}

.custom-input .q-field__control {
  background-color: #f5f8fa;
  border-color: #d0e3f2;
}

.custom-select .q-field__control {
  background-color: #f5f8fa;
  border-color: #d0e3f2;
}

.custom-toggle {
  margin-top: 20px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
}
</style>
