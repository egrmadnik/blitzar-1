<script setup>
import { ref } from 'vue'
import BlitzForm from '../components/BlitzForm.vue'

const formData = ref({})

const schema = [
  {
    id: 'name',
    span: 1,
    component: 'QInput',
    label: 'Full Name',
    subLabel: 'Enter your full name',
    required: true,
    rules: [val => (val && val.length > 0) || 'Name is required']
  },
  {
    id: 'email',
    span: 1,
    component: 'QInput',
    label: 'Email Address',
    subLabel: 'Enter a valid email address',
    type: 'email',
    required: true,
    rules: [
      val => (val && val.length > 0) || 'Email is required',
      val => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
    ]
  },
  {
    id: 'age',
    span: 1,
    component: 'QInput',
    label: 'Age',
    subLabel: 'Enter your age (must be 18 or older)',
    type: 'number',
    required: true,
    rules: [
      val => (val !== null && val !== undefined) || 'Age is required',
      val => val >= 18 || 'You must be at least 18 years old',
      val => val <= 120 || 'Please enter a realistic age'
    ],
    parseInput: val => Number(val)
  },
  {
    id: 'password',
    span: 1,
    component: 'QInput',
    label: 'Password',
    subLabel: 'At least 8 characters with numbers and letters',
    type: 'password',
    required: true,
    rules: [
      val => (val && val.length >= 8) || 'Password must be at least 8 characters',
      val => /[0-9]/.test(val) || 'Password must contain at least one number',
      val => /[a-zA-Z]/.test(val) || 'Password must contain at least one letter'
    ]
  },
  {
    id: 'passwordConfirm',
    span: 1,
    component: 'QInput',
    label: 'Confirm Password',
    subLabel: 'Enter the same password again',
    type: 'password',
    required: true,
    rules: [
      val => (val && val.length > 0) || 'Please confirm your password',
      function(val) {
        return val === formData.value.password || 'Passwords must match'
      }
    ]
  },
  {
    id: 'terms',
    component: 'QCheckbox',
    span: 2,
    label: 'I agree to the terms and conditions',
    rules: [val => val === true || 'You must agree to the terms to continue'],
    defaultValue: false
  }
]

const submitForm = () => {
  // In a real app, you would validate and submit the form to your backend
  alert('Form submitted successfully!')
}
</script>

<template>
  <div class="q-pa-md">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6">Form Validation Example</div>
        <div class="text-subtitle2">This form demonstrates various validation techniques</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <BlitzForm
          v-model="formData"
          :schema="schema"
          :columnCount="2"
          :internalLabels="true"
          gridGap="1.5rem"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" />
        <q-btn flat label="Submit" color="primary" @click="submitForm" />
      </q-card-actions>
    </q-card>

    <div class="q-mt-md bg-black text-white q-pa-md">
      <pre><code>{{ JSON.stringify(formData, undefined, 2) }}</code></pre>
    </div>
  </div>
</template>

<style>
.form-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
