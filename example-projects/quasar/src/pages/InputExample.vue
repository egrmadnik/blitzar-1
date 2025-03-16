<template>
  <q-page class="q-pa-md">
    <h4 class="q-mt-none q-mb-md">BlitzInput Examples</h4>
    
    <div class="row q-col-gutter-md">
      <!-- Basic inputs section -->
      <div class="col-12 col-md-6">
        <q-card class="mb-card">
          <q-card-section>
            <div class="text-h6">Basic Text Inputs</div>
            <div class="text-grey-8">Various types of text inputs with different states</div>
          </q-card-section>
          
          <q-card-section>
            <BlitzInput
              v-model="textValue"
              label="Text Input"
              placeholder="Enter some text"
              hint="This is a basic text input"
            />
            
            <BlitzInput
              v-model="emailValue"
              type="email"
              label="Email"
              placeholder="Enter your email"
              icon="email"
              :hasError="!isValidEmail"
              :error-message="emailValue ? 'Invalid email format' : ''"
            />
            
            <BlitzInput
              v-model="passwordValue"
              type="password"
              label="Password"
              placeholder="Enter your password"
              icon="lock"
              clearable
            />
            
            <BlitzInput
              v-model="searchValue"
              type="search"
              label="Search"
              placeholder="Search anything..."
              icon="search"
              clearable
            />
            
            <BlitzInput
              v-model="disabledValue"
              label="Disabled Input"
              placeholder="This is disabled"
              disabled
            />
            
            <BlitzInput
              v-model="readonlyValue"
              label="Read-only Input"
              value="This is read-only"
              readonly
            />
          </q-card-section>
        </q-card>
      </div>
      
      <!-- Advanced inputs section -->
      <div class="col-12 col-md-6">
        <q-card class="mb-card">
          <q-card-section>
            <div class="text-h6">Advanced Input Types</div>
            <div class="text-grey-8">Textarea, select, and other specialized inputs</div>
          </q-card-section>
          
          <q-card-section>
            <BlitzInput
              v-model="textareaValue"
              type="textarea"
              label="Textarea"
              placeholder="Write a longer message here"
              hint="Multi-line input with autogrow enabled"
              autogrow
              rows="3"
            />
            
            <BlitzInput
              v-model="selectValue"
              type="select"
              label="Select Input"
              placeholder="Choose an option"
              :options="selectOptions"
              hint="Select from predefined options"
            />
            
            <BlitzInput
              v-model="numberValue"
              type="number"
              label="Number Input"
              placeholder="Enter a number"
              :min="0"
              hint="Only numbers are accepted"
            />
            
            <BlitzInput
              v-model="dateValue"
              type="date"
              label="Date Input"
              hint="Pick a date"
            />
          </q-card-section>
        </q-card>
      </div>
      
      <!-- State indicators section -->
      <div class="col-12">
        <q-card class="mb-card">
          <q-card-section>
            <div class="text-h6">Input States & Indicators</div>
            <div class="text-grey-8">Inputs with special state indicators like validation feedback and busy states</div>
          </q-card-section>
          
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <BlitzInput
                  v-model="successValue"
                  label="Validated Input"
                  placeholder="Type something to validate"
                  :showCheck="successValue.length > 0"
                  hint="Shows a check mark when input is not empty"
                />
                
                <BlitzInput
                  v-model="errorValue"
                  label="Error Input"
                  placeholder="Type anything"
                  :hasError="errorValue.length < 5 && errorValue.length > 0"
                  error-message="Must be at least 5 characters"
                  hint="Shows error when input is less than 5 characters"
                />
              </div>
              
              <div class="col-12 col-md-6">
                <BlitzInput
                  v-model="busyValue"
                  label="Busy State Input"
                  placeholder="Type to see busy indicator"
                  :isBusy="busyValue.length > 0"
                  hint="Shows loading indicator when input is not empty"
                />
                
                <BlitzInput
                  v-model="prefixSuffixValue"
                  label="Input with Prefix & Suffix"
                  placeholder="Enter a value"
                  prefix="$"
                  suffix=".00"
                  hint="Shows currency formatting with prefix and suffix"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <!-- Form example section -->
      <div class="col-12">
        <q-card class="mb-card">
          <q-card-section>
            <div class="text-h6">Form Example</div>
            <div class="text-grey-8">Combining multiple BlitzInput components in a form</div>
          </q-card-section>
          
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <BlitzInput
                  v-model="form.firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  :hasError="!!formErrors.firstName"
                  :error-message="formErrors.firstName"
                  required
                />
                
                <BlitzInput
                  v-model="form.lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  :hasError="!!formErrors.lastName"
                  :error-message="formErrors.lastName"
                  required
                />
              </div>
              
              <div class="col-12 col-md-6">
                <BlitzInput
                  v-model="form.email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  icon="email"
                  :hasError="!!formErrors.email"
                  :error-message="formErrors.email"
                  required
                />
                
                <BlitzInput
                  v-model="form.phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  icon="phone"
                  :hasError="!!formErrors.phone"
                  :error-message="formErrors.phone"
                />
              </div>
              
              <div class="col-12">
                <BlitzInput
                  v-model="form.message"
                  type="textarea"
                  label="Message"
                  placeholder="Enter your message"
                  rows="4"
                  autogrow
                />
                
                <div class="q-mt-md">
                  <q-btn color="primary" label="Submit Form" @click="validateForm" />
                  <q-btn flat class="q-ml-sm" color="grey" label="Reset" @click="resetForm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BlitzInput from 'components/BlitzInput.vue'

// Basic text inputs
const textValue = ref('')
const emailValue = ref('')
const passwordValue = ref('')
const searchValue = ref('')
const disabledValue = ref('This is disabled')
const readonlyValue = ref('This is read-only')

// Advanced inputs
const textareaValue = ref('')
const selectValue = ref(null)
const selectOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 }
]
const numberValue = ref('')
const dateValue = ref('')

// State indicators
const successValue = ref('')
const errorValue = ref('')
const busyValue = ref('')
const prefixSuffixValue = ref('')

// Form example
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: ''
})

const formErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Email validation
const isValidEmail = computed(() => {
  if (!emailValue.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValue.value)
})

// Form validation
const validateForm = () => {
  // Reset errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  let isValid = true
  
  // First name validation
  if (!form.firstName) {
    formErrors.firstName = 'First name is required'
    isValid = false
  }
  
  // Last name validation
  if (!form.lastName) {
    formErrors.lastName = 'Last name is required'
    isValid = false
  }
  
  // Email validation
  if (!form.email) {
    formErrors.email = 'Email is required'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      formErrors.email = 'Invalid email format'
      isValid = false
    }
  }
  
  // Phone validation (optional but must be valid if provided)
  if (form.phone) {
    const phoneRegex = /^\d{10}$/ // Simple 10-digit format
    if (!phoneRegex.test(form.phone.replace(/\D/g, ''))) {
      formErrors.phone = 'Invalid phone number'
      isValid = false
    }
  }
  
  if (isValid) {
    alert('Form submitted successfully!')
  }
}

const resetForm = () => {
  // Reset all form values
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  
  // Reset all errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
}
</script>

<style scoped>
.mb-card {
  margin-bottom: 16px;
}
</style>
