<template>
  <q-page padding>
    <div class="q-pa-md">
      <h3>BlitzTable Examples</h3>
      
      <div class="q-my-lg">
        <BlitzTable
          title="Basic Table Example"
          description="A simple table with basic features"
          :columns="basicColumns"
          :rows="basicData"
          row-key="id"
        />
      </div>
      
      <div class="q-my-lg">
        <BlitzTable
          title="Table with Selection"
          description="Support for selecting single or multiple rows"
          :columns="selectionColumns"
          :rows="userData"
          row-key="id"
          selection-type="multiple"
          v-model:selected="selectedUsers"
          @update:selected="onSelectionChange"
        >
          <template v-slot:actions>
            <q-btn v-if="selectedUsers.length" 
              color="primary" 
              label="Process Selected" 
              class="q-mr-sm" 
              @click="processSelected"
            />
            <q-btn
              color="secondary"
              label="Add User"
              @click="addUser"
            />
          </template>
        </BlitzTable>
        
        <div v-if="selectedUsers.length" class="q-mt-md q-pa-md bg-grey-2 rounded-borders">
          <div class="text-h6">Selected Users:</div>
          <q-chip 
            v-for="user in selectedUsers" 
            :key="user.id"
            color="primary"
            text-color="white"
            class="q-ma-xs"
          >
            {{ user.name }}
          </q-chip>
        </div>
      </div>
      
      <div class="q-my-lg">
        <BlitzTable
          title="Table with Actions"
          description="Table with custom row actions"
          :columns="actionColumns"
          :rows="productData"
          row-key="id"
          show-edit-action
          show-delete-action
          @edit="onEditProduct"
          @delete="onDeleteProduct"
          @row-click="onRowClick"
        >
          <template v-slot:cell-price="props">
            <div :class="props.row.price > 100 ? 'text-negative' : 'text-positive'">
              ${{ props.row.price.toFixed(2) }}
            </div>
          </template>
          
          <template v-slot:cell-status="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ props.row.status }}
            </q-badge>
          </template>
        </BlitzTable>
      </div>
      
      <div class="q-my-lg">
        <BlitzTable
          title="Pagination & Sorting Example"
          description="Table with server-side pagination and sorting"
          :columns="paginationColumns"
          :rows="paginatedData"
          :loading="loading"
          row-key="id"
          :pagination.sync="pagination"
          @request="onRequest"
        />
      </div>
      
      <div class="q-my-lg">
        <q-card class="q-pa-md">
          <h5>BlitzTable with Filter Integration</h5>
          <p>Combining BlitzFilter and BlitzTable components</p>
          
          <BlitzFilter
            v-model="tableFilters"
            :schema="filterSchema"
            title="Filter Products"
            class="q-mb-md"
            @filter="onFilterTable"
          />
          
          <BlitzTable
            :columns="filteredTableColumns"
            :rows="filteredTableData"
            row-key="id"
            :show-search="false"
          />
        </q-card>
      </div>
    </div>
    
    <!-- Edit Product Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Product</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <q-input v-model="editedProduct.name" label="Product Name" dense class="q-mb-md" />
          <q-input v-model.number="editedProduct.price" label="Price" type="number" dense class="q-mb-md" />
          <q-select 
            v-model="editedProduct.status" 
            :options="['In Stock', 'Low Stock', 'Out of Stock']" 
            label="Status" 
            dense 
          />
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveProduct" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BlitzTable from '../components/BlitzTable.vue'
import BlitzFilter from '../components/BlitzFilter.vue'
import { useQuasar } from 'quasar'

const q = useQuasar()

// Basic table example
const basicColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', sortable: true }
]

const basicData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(123) 456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(234) 567-8901' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '(345) 678-9012' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '(456) 789-0123' }
]

// Selection table example
const selectionColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'role', label: 'Role', field: 'role', sortable: true },
  { name: 'department', label: 'Department', field: 'department', sortable: true },
  { name: 'hired', label: 'Hire Date', field: 'hired', sortable: true }
]

const userData = [
  { id: 101, name: 'Michael Scott', role: 'Manager', department: 'Sales', hired: '2005-03-24' },
  { id: 102, name: 'Jim Halpert', role: 'Sales Rep', department: 'Sales', hired: '2006-01-15' },
  { id: 103, name: 'Pam Beesly', role: 'Receptionist', department: 'Admin', hired: '2005-04-10' },
  { id: 104, name: 'Dwight Schrute', role: 'Assistant to the Regional Manager', department: 'Sales', hired: '2005-05-05' },
  { id: 105, name: 'Angela Martin', role: 'Accountant', department: 'Finance', hired: '2005-06-12' },
  { id: 106, name: 'Oscar Martinez', role: 'Accountant', department: 'Finance', hired: '2005-11-15' }
]

const selectedUsers = ref([])

const onSelectionChange = (selected) => {
  console.log('Selection changed:', selected)
}

const processSelected = () => {
  q.notify({
    message: `Processing ${selectedUsers.value.length} selected users`,
    color: 'positive'
  })
}

const addUser = () => {
  const newId = Math.max(...userData.map(u => u.id)) + 1
  userData.push({
    id: newId,
    name: 'New User',
    role: 'Employee',
    department: 'Unknown',
    hired: new Date().toISOString().substr(0, 10)
  })
  
  q.notify({
    message: 'New user added successfully',
    color: 'positive'
  })
}

// Action table example
const actionColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Product', field: 'name', sortable: true },
  { name: 'price', label: 'Price', field: 'price', sortable: true },
  { name: 'category', label: 'Category', field: 'category', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true }
]

const productData = ref([
  { id: 201, name: 'Laptop', price: 1200, category: 'Electronics', status: 'In Stock' },
  { id: 202, name: 'Smartphone', price: 800, category: 'Electronics', status: 'In Stock' },
  { id: 203, name: 'Headphones', price: 150, category: 'Electronics', status: 'Low Stock' },
  { id: 204, name: 'Monitor', price: 300, category: 'Electronics', status: 'In Stock' },
  { id: 205, name: 'Keyboard', price: 80, category: 'Accessories', status: 'In Stock' },
  { id: 206, name: 'Mouse', price: 40, category: 'Accessories', status: 'Out of Stock' }
])

const editDialog = ref(false)
const editedProduct = ref({})
const editIndex = ref(-1)

const onEditProduct = (product) => {
  editedProduct.value = {...product}
  editIndex.value = productData.value.findIndex(p => p.id === product.id)
  editDialog.value = true
}

const onDeleteProduct = (product) => {
  q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete ${product.name}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    const index = productData.value.findIndex(p => p.id === product.id)
    if (index !== -1) {
      productData.value.splice(index, 1)
      q.notify({
        message: 'Product deleted successfully',
        color: 'positive'
      })
    }
  })
}

const saveProduct = () => {
  if (editIndex.value !== -1) {
    productData.value[editIndex.value] = {...editedProduct.value}
    q.notify({
      message: 'Product updated successfully',
      color: 'positive'
    })
  }
}

const onRowClick = (props) => {
  console.log('Row clicked:', props.row)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'In Stock': return 'positive'
    case 'Low Stock': return 'warning'
    case 'Out of Stock': return 'negative'
    default: return 'grey'
  }
}

// Pagination example
const paginationColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'title', label: 'Title', field: 'title', sortable: true },
  { name: 'author', label: 'Author', field: 'author', sortable: true },
  { name: 'year', label: 'Year', field: 'year', sortable: true },
  { name: 'genre', label: 'Genre', field: 'genre', sortable: true }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'id',
  descending: false
})

const loading = ref(false)
const allBooksData = [
  { id: 301, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, genre: 'Fiction' },
  { id: 302, title: '1984', author: 'George Orwell', year: 1949, genre: 'Dystopian' },
  { id: 303, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genre: 'Fiction' },
  { id: 304, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, genre: 'Romance' },
  { id: 305, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, genre: 'Fantasy' },
  { id: 306, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', year: 1997, genre: 'Fantasy' },
  { id: 307, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, genre: 'Fiction' },
  { id: 308, title: 'Lord of the Flies', author: 'William Golding', year: 1954, genre: 'Fiction' },
  { id: 309, title: 'Animal Farm', author: 'George Orwell', year: 1945, genre: 'Political Satire' },
  { id: 310, title: 'The Alchemist', author: 'Paulo Coelho', year: 1988, genre: 'Fiction' },
  { id: 311, title: 'Brave New World', author: 'Aldous Huxley', year: 1932, genre: 'Dystopian' },
  { id: 312, title: 'The Da Vinci Code', author: 'Dan Brown', year: 2003, genre: 'Mystery' },
  { id: 313, title: 'The Hunger Games', author: 'Suzanne Collins', year: 2008, genre: 'Dystopian' },
  { id: 314, title: 'Moby-Dick', author: 'Herman Melville', year: 1851, genre: 'Adventure' },
  { id: 315, title: 'Don Quixote', author: 'Miguel de Cervantes', year: 1605, genre: 'Satire' }
]

const paginatedData = ref([])

const onRequest = (props) => {
  loading.value = true
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  
  // Sort the data
  const sortedData = [...allBooksData]
  if (sortBy) {
    sortedData.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      return (descending ? -1 : 1) * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0)
    })
  }
  
  // Simulate API call delay
  setTimeout(() => {
    // Paginate the data
    const startIndex = (page - 1) * rowsPerPage
    const endIndex = Math.min(startIndex + rowsPerPage, sortedData.length)
    paginatedData.value = sortedData.slice(startIndex, endIndex)
    loading.value = false
  }, 800)
}

// Filter + table example
const filterSchema = [
  {
    id: 'search',
    component: 'QInput',
    label: 'Search',
    clearable: true,
    outlined: true,
    dense: true,
    span: 6
  },
  {
    id: 'category',
    component: 'QSelect',
    label: 'Category',
    clearable: true,
    outlined: true,
    dense: true,
    span: 6,
    options: [
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Accessories', value: 'Accessories' }
    ]
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
      { label: 'In Stock', value: 'In Stock' },
      { label: 'Low Stock', value: 'Low Stock' },
      { label: 'Out of Stock', value: 'Out of Stock' }
    ]
  },
  {
    id: 'price',
    component: 'QRange',
    label: 'Price Range',
    span: 6,
    min: {
      component: 'QInput',
      label: 'Min',
      type: 'number',
      clearable: true,
      outlined: true,
      dense: true
    },
    max: {
      component: 'QInput',
      label: 'Max',
      type: 'number',
      clearable: true,
      outlined: true,
      dense: true
    }
  }
]

const tableFilters = ref({
  search: '',
  category: '',
  status: '',
  price: { min: null, max: null }
})

const filteredTableColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Product', field: 'name', sortable: true },
  { name: 'price', label: 'Price', field: 'price', sortable: true,
    format: val => `$${val.toFixed(2)}` },
  { name: 'category', label: 'Category', field: 'category', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true }
]

const filteredTableData = ref([...productData.value])

const onFilterTable = (filters) => {
  filteredTableData.value = productData.value.filter(product => {
    // Search filter
    if (filters.search && 
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.category.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false
    }
    
    // Status filter
    if (filters.status && product.status !== filters.status) {
      return false
    }
    
    // Price range filter
    if (filters.price.min !== null && product.price < filters.price.min) {
      return false
    }
    
    if (filters.price.max !== null && product.price > filters.price.max) {
      return false
    }
    
    return true
  })
}

// Initialize paginated data on mount
onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>

<style scoped>
.q-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
