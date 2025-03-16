<template>
  <div class="q-pa-md">
    <h1 class="text-h4 q-mb-md">BlitzForm Examples</h1>
    <p class="q-mb-md">
      These examples demonstrate the various ways to use the BlitzForm component from Blitzar with Quasar UI components.
    </p>

    <!-- Basic Example -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Basic Example</h2>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <BlitzForm
            v-model="basicFormData"
            :schema="basicSchema"
            label-position="top"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <h2 class="text-h6 q-mb-md">Current Data</h2>
          <pre class="code-preview">{{ JSON.stringify(basicFormData, null, 2) }}</pre>
        </q-card>
      </div>
    </div>

    <!-- Form Modes Example -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Form Modes (Edit/Readonly/Disabled)</h2>
    <p class="q-mb-md">
      BlitzForm supports different modes for form interaction. Click the buttons below to toggle between modes.
    </p>

    <div class="q-mb-md">
      <q-btn-group spread>
        <q-btn 
          color="primary" 
          label="Edit Mode" 
          :outline="formMode !== 'edit'"
          @click="formMode = 'edit'"
        />
        <q-btn 
          color="secondary" 
          label="Readonly Mode" 
          :outline="formMode !== 'readonly'"
          @click="formMode = 'readonly'"
        />
        <q-btn 
          color="accent" 
          label="Disabled Mode" 
          :outline="formMode !== 'disabled'"
          @click="formMode = 'disabled'"
        />
      </q-btn-group>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <BlitzForm
            v-model="modeFormData"
            :schema="modeSchema"
            :mode="formMode"
            label-position="top"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <h2 class="text-h6 q-mb-md">Current Mode: {{ formMode }}</h2>
          <pre class="code-preview">{{ JSON.stringify(modeFormData, null, 2) }}</pre>
        </q-card>
      </div>
    </div>

    <!-- Action Buttons Example -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Action Buttons</h2>
    <p class="q-mb-md">
      BlitzForm supports pre-made action buttons for common operations like edit, save, cancel, and delete.
    </p>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <BlitzForm
            v-model="actionFormData"
            :schema="actionSchema"
            label-position="top"
            :action-buttons="['edit', 'cancel', 'save', 'delete']"
            @edit="onFormEdit"
            @save="onFormSave"
            @cancel="onFormCancel"
            @delete="onFormDelete"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <h2 class="text-h6 q-mb-md">Action Log</h2>
          <div v-for="(log, index) in actionLogs" :key="index" class="log-item">
            <div class="text-caption">{{ formatDate(log.timestamp) }}</div>
            <div class="log-message">{{ log.message }}</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Validation Example -->
    <h2 class="text-h5 q-mt-lg q-mb-md">Form Validation</h2>
    <p class="q-mb-md">
      BlitzForm provides built-in validation features. Try submitting the form with empty fields to see validation in action.
    </p>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <BlitzForm
            v-model="validationFormData"
            :schema="validationSchema"
            label-position="top"
            :action-buttons="['save']"
            @save="validateForm"
          />
          <div v-if="validationErrors.length > 0" class="validation-errors q-mt-md">
            <q-banner class="bg-negative text-white">
              <template v-slot:avatar>
                <q-icon name="error" />
              </template>
              <div class="text-h6">Validation Errors:</div>
              <ul>
                <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
              </ul>
            </q-banner>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <h2 class="text-h6 q-mb-md">Form Data</h2>
          <pre class="code-preview">{{ JSON.stringify(validationFormData, null, 2) }}</pre>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import BlitzForm from '../components/BlitzForm.vue'

const $q = useQuasar()

// ==========================================================================
// Basic Example
// ==========================================================================
const basicFormData = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 30,
  subscribe: true
})

const basicSchema = [
  {
    id: 'name',
    component: 'QInput',
    label: 'Name',
    span: 12
  },
  {
    id: 'email',
    component: 'QInput',
    label: 'Email',
    type: 'email',
    span: 12
  },
  {
    id: 'age',
    component: 'QInput',
    label: 'Age',
    type: 'number',
    span: 6
  },
  {
    id: 'subscribe',
    component: 'QCheckbox',
    label: 'Subscribe to newsletter',
    span: 6
  }
]

// ==========================================================================
// Form Modes Example
// ==========================================================================
const formMode = ref('edit')

const modeFormData = ref({
  title: 'Software Engineer',
  company: 'Tech Corp',
  salary: 75000,
  startDate: '2023-01-15',
  benefits: ['health', 'dental', 'vision'],
  notes: 'Great working environment with flexible hours.'
})

const modeSchema = [
  {
    id: 'title',
    component: 'QInput',
    label: 'Job Title',
    span: 6
  },
  {
    id: 'company',
    component: 'QInput',
    label: 'Company',
    span: 6
  },
  {
    id: 'salary',
    component: 'QInput',
    label: 'Salary',
    type: 'number',
    prefix: '$',
    span: 6
  },
  {
    id: 'startDate',
    component: 'QInput',
    label: 'Start Date',
    type: 'date',
    span: 6
  },
  {
    id: 'benefits',
    component: 'QOptionGroup',
    label: 'Benefits',
    type: 'checkbox',
    options: [
      { label: 'Health Insurance', value: 'health' },
      { label: 'Dental Insurance', value: 'dental' },
      { label: 'Vision Insurance', value: 'vision' },
      { label: '401(k)', value: '401k' }
    ],
    span: 12
  },
  {
    id: 'notes',
    component: 'QInput',
    label: 'Notes',
    type: 'textarea',
    span: 12
  }
]

// ==========================================================================
// Action Buttons Example
// ==========================================================================
const actionFormData = ref({
  firstName: 'Alice',
  lastName: 'Johnson',
  department: 'Marketing',
  position: 'Manager'
})

const actionSchema = [
  {
    id: 'firstName',
    component: 'QInput',
    label: 'First Name',
    span: 6
  },
  {
    id: 'lastName',
    component: 'QInput',
    label: 'Last Name',
    span: 6
  },
  {
    id: 'department',
    component: 'QInput',
    label: 'Department',
    span: 6
  },
  {
    id: 'position',
    component: 'QInput',
    label: 'Position',
    span: 6
  }
]

const actionLogs = ref([])

function addActionLog(message) {
  actionLogs.value.unshift({
    timestamp: new Date(),
    message
  })
  
  // Keep only the last 5 logs
  if (actionLogs.value.length > 5) {
    actionLogs.value = actionLogs.value.slice(0, 5)
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function onFormEdit() {
  addActionLog('Form switched to edit mode')
}

function onFormSave(payload) {
  const { newData, oldData } = payload
  addActionLog(`Form saved. Changed from ${JSON.stringify(oldData)} to ${JSON.stringify(newData)}`)
  $q.notify({
    message: 'Form saved successfully',
    color: 'positive',
    icon: 'save'
  })
}

function onFormCancel() {
  addActionLog('Edit cancelled. Form reverted to previous state')
}

function onFormDelete() {
  addActionLog('Delete action triggered')
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this record?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    actionFormData.value = {
      firstName: '',
      lastName: '',
      department: '',
      position: ''
    }
    addActionLog('Record deleted')
    $q.notify({
      message: 'Record deleted',
      color: 'negative',
      icon: 'delete'
    })
  })
}

// ==========================================================================
// Validation Example
// ==========================================================================
const validationFormData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validationSchema = [
  {
    id: 'username',
    component: 'QInput',
    label: 'Username',
    rules: [
      val => (val && val.length > 0) || 'Username is required',
      val => (val && val.length >= 3) || 'Username must be at least 3 characters'
    ],
    span: 12
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
    span: 12
  },
  {
    id: 'password',
    component: 'QInput',
    label: 'Password',
    type: 'password',
    rules: [
      val => (val && val.length > 0) || 'Password is required',
      val => (val && val.length >= 8) || 'Password must be at least 8 characters',
      val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
      val => /[0-9]/.test(val) || 'Password must contain at least one number'
    ],
    span: 12
  },
  {
    id: 'confirmPassword',
    component: 'QInput',
    label: 'Confirm Password',
    type: 'password',
    rules: [
      val => (val && val.length > 0) || 'Password confirmation is required',
      val => val === validationFormData.value.password || 'Passwords must match'
    ],
    span: 12
  }
]

const validationErrors = ref([])

function validateForm({ newData }) {
  validationErrors.value = []

  // Custom validation example
  if (!newData.username) {
    validationErrors.value.push('Username is required')
  } else if (newData.username.length < 3) {
    validationErrors.value.push('Username must be at least 3 characters')
  }

  if (!newData.email) {
    validationErrors.value.push('Email is required')
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newData.email)) {
    validationErrors.value.push('Please enter a valid email')
  }

  if (!newData.password) {
    validationErrors.value.push('Password is required')
  } else {
    if (newData.password.length < 8) {
      validationErrors.value.push('Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(newData.password)) {
      validationErrors.value.push('Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(newData.password)) {
      validationErrors.value.push('Password must contain at least one number')
    }
  }

  if (newData.password !== newData.confirmPassword) {
    validationErrors.value.push('Passwords must match')
  }

  if (validationErrors.value.length === 0) {
    $q.notify({
      message: 'Form validation successful!',
      color: 'positive',
      icon: 'check_circle'
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
  max-height: 300px;
  font-size: 0.8rem;
}

.log-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-message {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.validation-errors {
  margin-top: 1rem;
}
</style>
