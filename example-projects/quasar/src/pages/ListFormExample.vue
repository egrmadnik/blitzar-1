<template>
  <div class="q-pa-md">
    <h1 class="text-h4 q-mb-md">BlitzListForm Examples</h1>
    <p class="q-mb-md">
      These examples demonstrate how to use the BlitzListForm component to create, edit, and manage a list of items.
    </p>

    <!-- Basic Example -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Basic Example</h2>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <BlitzListForm
            v-model="contacts"
            :schema="contactSchema"
            label-position="top"
            add-label="Add New Contact"
            item-label="Contact"
            :max-items="5"
            @add="onContactAdd"
            @remove="onContactRemove"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <h2 class="text-h6 q-mb-md">Current Data</h2>
          <pre class="code-preview">{{ JSON.stringify(contacts, null, 2) }}</pre>
        </q-card>
      </div>
    </div>

    <!-- Advanced Example with Action Buttons -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Advanced Example with Action Buttons</h2>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <BlitzListForm
            v-model="tasks"
            :schema="taskSchema"
            label-position="top"
            add-label="Add New Task"
            item-label="Task"
            :action-buttons="taskActionButtons"
            @action="onTaskAction"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <h2 class="text-h6 q-mb-md">Task Data</h2>
          <pre class="code-preview">{{ JSON.stringify(tasks, null, 2) }}</pre>
        </q-card>
      </div>
    </div>

    <!-- Read-only Example -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Read-only Example</h2>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <BlitzListForm
            v-model="readOnlyTasks"
            :schema="taskSchema"
            label-position="top"
            item-label="Task"
            :readonly="true"
          />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import BlitzListForm from '../components/BlitzListForm.vue'

const $q = useQuasar()

// Initial form data with some example contacts
const contacts = ref([
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    type: 'personal'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    type: 'business'
  }
])

// Form schema definition for the contact list
const contactSchema = [
  {
    id: 'firstName',
    component: 'QInput',
    label: 'First Name',
    rules: [val => (val && val.length > 0) || 'First name is required'],
    span: 6
  },
  {
    id: 'lastName',
    component: 'QInput',
    label: 'Last Name',
    rules: [val => (val && val.length > 0) || 'Last name is required'],
    span: 6
  },
  {
    id: 'email',
    component: 'QInput',
    label: 'Email',
    type: 'email',
    rules: [
      val => (val && val.length > 0) || 'Email is required',
      val => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
    ],
    span: 6
  },
  {
    id: 'phone',
    component: 'QInput',
    label: 'Phone Number',
    mask: '###-###-####',
    unmaskedValue: true,
    span: 6
  },
  {
    id: 'type',
    component: 'QSelect',
    label: 'Contact Type',
    options: [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
      { label: 'Other', value: 'other' }
    ],
    span: 12
  }
]

// Task schema and data for advanced example
const tasks = ref([
  {
    id: '1',
    title: 'Implement BlitzListForm',
    description: 'Create a BlitzListForm component for the Quasar example project',
    priority: 'high',
    completed: true,
    dueDate: '2025-03-15'
  },
  {
    id: '2',
    title: 'Add advanced examples',
    description: 'Create more complex examples showcasing BlitzListForm features',
    priority: 'medium',
    completed: false,
    dueDate: '2025-03-20'
  }
])

const readOnlyTasks = ref([...tasks.value])

const taskSchema = [
  {
    id: 'title',
    component: 'QInput',
    label: 'Task Title',
    rules: [val => (val && val.length > 0) || 'Title is required'],
    span: 6
  },
  {
    id: 'priority',
    component: 'QSelect',
    label: 'Priority',
    options: [
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' }
    ],
    span: 6
  },
  {
    id: 'description',
    component: 'QInput',
    label: 'Description',
    type: 'textarea',
    span: 12
  },
  {
    id: 'dueDate',
    component: 'QInput',
    label: 'Due Date',
    type: 'date',
    span: 6
  },
  {
    id: 'completed',
    component: 'QCheckbox',
    label: 'Completed',
    span: 6
  }
]

const taskActionButtons = [
  {
    label: 'Mark All Complete',
    color: 'positive',
    icon: 'check_circle',
    action: 'complete-all',
    handler: (items) => {
      return items.map(item => ({ ...item, completed: true }))
    }
  },
  {
    label: 'Clear Completed',
    color: 'negative',
    outline: true,
    action: 'clear-completed',
    handler: (items) => {
      return items.filter(item => !item.completed)
    }
  }
]

// Event handlers
function onContactAdd({ item, index }) {
  console.log('Contact added:', item, 'at index:', index)
  $q.notify({
    message: `Added new contact at position ${index + 1}`,
    color: 'positive',
    icon: 'person_add'
  })
}

function onContactRemove({ item, index }) {
  console.log('Contact removed:', item, 'from index:', index)
  $q.notify({
    message: `Removed contact: ${item.firstName || ''} ${item.lastName || ''}`,
    color: 'negative',
    icon: 'person_remove'
  })
}

function onTaskAction({ action, items }) {
  console.log('Task action:', action, 'on items:', items)
  
  if (action === 'complete-all') {
    tasks.value = items.map(item => ({ ...item, completed: true }))
    $q.notify({
      message: 'Marked all tasks as completed',
      color: 'positive'
    })
  } else if (action === 'clear-completed') {
    tasks.value = items.filter(item => !item.completed)
    $q.notify({
      message: 'Cleared all completed tasks',
      color: 'warning'
    })
  }
}
</script>

<style scoped>
.code-preview {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  font-family: monospace;
  max-height: 400px;
  font-size: 0.8rem;
}
</style>
