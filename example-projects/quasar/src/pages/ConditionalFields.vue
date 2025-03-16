<script setup>
import { ref, computed, watch } from 'vue'
import BlitzForm from '../components/BlitzForm.vue'

const formData = ref({
  contactMethod: '',
  hasWorkExperience: false,
  numberOfJobs: 0
})

// Helper to dynamically create work experience fields based on number of jobs
const generateWorkExperienceFields = (count) => {
  const fields = []
  
  for (let i = 0; i < count; i++) {
    fields.push(
      {
        id: `company${i}`,
        span: 1,
        component: 'QInput',
        label: `Company ${i+1}`,
        required: true,
      },
      {
        id: `position${i}`,
        span: 1,
        component: 'QInput',
        label: `Position ${i+1}`,
        required: true,
      },
      {
        id: `years${i}`,
        span: 1,
        component: 'QInput',
        label: `Years of Experience ${i+1}`,
        type: 'number',
        required: true,
        parseInput: val => Number(val)
      }
    )
  }
  
  return fields
}

// Basic schema fields
const baseSchema = [
  {
    id: 'firstName',
    span: 1,
    component: 'QInput',
    label: 'First Name',
    required: true,
  },
  {
    id: 'lastName',
    span: 1,
    component: 'QInput',
    label: 'Last Name',
    required: true,
  },
  {
    id: 'contactMethod',
    span: 2,
    component: 'QBtnToggle',
    label: 'Preferred Contact Method',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'mail', label: 'Mail' }
    ],
    spread: true,
    required: true,
  },
]

// Conditional contact fields based on selected contact method
const contactFields = computed(() => {
  switch (formData.value.contactMethod) {
    case 'email':
      return [{
        id: 'email',
        span: 2,
        component: 'QInput',
        label: 'Email Address',
        type: 'email',
        required: true,
      }]
    case 'phone':
      return [
        {
          id: 'phone',
          span: 1,
          component: 'QInput',
          label: 'Phone Number',
          required: true,
        },
        {
          id: 'bestTimeToCall',
          span: 1,
          component: 'QSelect',
          label: 'Best Time to Call',
          options: [
            { value: 'morning', label: 'Morning' },
            { value: 'afternoon', label: 'Afternoon' },
            { value: 'evening', label: 'Evening' }
          ],
          required: true,
        }
      ]
    case 'mail':
      return [
        {
          id: 'streetAddress',
          span: 2,
          component: 'QInput',
          label: 'Street Address',
          required: true,
        },
        {
          id: 'city',
          span: 1,
          component: 'QInput',
          label: 'City',
          required: true,
        },
        {
          id: 'zipCode',
          span: 1,
          component: 'QInput',
          label: 'Zip Code',
          required: true,
        }
      ]
    default:
      return []
  }
})

// Work experience toggle
const workExperienceToggle = [
  {
    id: 'hasWorkExperience',
    span: 2,
    component: 'QToggle',
    label: 'Do you have work experience?',
  }
]

// Conditional number of jobs field shown only if hasWorkExperience is true
const jobsCountField = computed(() => {
  if (!formData.value.hasWorkExperience) return []
  
  return [{
    id: 'numberOfJobs',
    span: 2,
    component: 'QSlider',
    label: 'Number of Previous Jobs',
    min: 0,
    max: 5,
    defaultValue: 0,
    parseInput: val => Number(val),
  }]
})

// Work experience fields based on numberOfJobs
const workExperienceFields = computed(() => {
  if (!formData.value.hasWorkExperience || formData.value.numberOfJobs <= 0) return []
  
  return generateWorkExperienceFields(formData.value.numberOfJobs)
})

// Final schema combining all conditional sections
const conditionalSchema = computed(() => {
  return [
    ...baseSchema,
    ...contactFields.value,
    ...workExperienceToggle,
    ...jobsCountField.value,
    ...workExperienceFields.value
  ]
})

// Reset work experience data when toggle changes
watch(() => formData.value.hasWorkExperience, (newValue) => {
  if (!newValue) {
    formData.value.numberOfJobs = 0
    
    // Clear all work experience form fields
    const keys = Object.keys(formData.value)
    keys.forEach(key => {
      if (key.startsWith('company') || key.startsWith('position') || key.startsWith('years')) {
        delete formData.value[key]
      }
    })
  }
})

const resetForm = () => {
  formData.value = {
    contactMethod: '',
    hasWorkExperience: false,
    numberOfJobs: 0
  }
}

const submitForm = () => {
  alert('Form submitted successfully!')
  console.log(formData.value)
}
</script>

<template>
  <div class="q-pa-md">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6">Conditional Fields Example</div>
        <div class="text-subtitle2">Fields appear/disappear based on your selections</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <BlitzForm
          v-model="formData"
          :schema="conditionalSchema"
          :columnCount="2"
          :internalLabels="true"
          gridGap="1.5rem"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Reset" color="warning" @click="resetForm" />
        <q-btn flat label="Submit" color="positive" @click="submitForm" />
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
