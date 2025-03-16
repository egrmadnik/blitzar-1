<script setup>
import { ref, computed } from 'vue'
import BlitzForm from '../components/BlitzForm.vue'

const formData = ref({
  productType: '',
  quantity: 1,
})

const productTypes = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'books', label: 'Books' },
]

// Dynamic fields based on selected product type
const electronicFields = [
  {
    id: 'brand',
    span: 1,
    component: 'QInput',
    label: 'Brand',
    required: true,
  },
  {
    id: 'model',
    span: 1,
    component: 'QInput',
    label: 'Model',
    required: true,
  },
  {
    id: 'warranty',
    span: 1,
    component: 'QSelect',
    label: 'Warranty Period',
    options: [
      { value: '1year', label: '1 Year' },
      { value: '2year', label: '2 Years' },
      { value: '3year', label: '3 Years' },
      { value: 'lifetime', label: 'Lifetime' },
    ],
  },
]

const clothingFields = [
  {
    id: 'size',
    span: 1,
    component: 'QSelect',
    label: 'Size',
    options: [
      { value: 'xs', label: 'Extra Small' },
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
      { value: 'l', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ],
    required: true,
  },
  {
    id: 'color',
    span: 1,
    component: 'QInput',
    label: 'Color',
    required: true,
  },
  {
    id: 'material',
    span: 1,
    component: 'QInput',
    label: 'Material',
    required: true,
  },
]

const furnitureFields = [
  {
    id: 'dimensions',
    span: 1,
    component: 'QInput',
    label: 'Dimensions (WxDxH)',
    required: true,
  },
  {
    id: 'material',
    span: 1,
    component: 'QInput',
    label: 'Material',
    required: true,
  },
  {
    id: 'assemblyRequired',
    span: 1,
    component: 'QToggle',
    label: 'Assembly Required',
    defaultValue: false,
  },
]

const bookFields = [
  {
    id: 'author',
    span: 1,
    component: 'QInput',
    label: 'Author',
    required: true,
  },
  {
    id: 'isbn',
    span: 1,
    component: 'QInput',
    label: 'ISBN',
    required: true,
  },
  {
    id: 'format',
    span: 1,
    component: 'QSelect',
    label: 'Format',
    options: [
      { value: 'hardcover', label: 'Hardcover' },
      { value: 'paperback', label: 'Paperback' },
      { value: 'ebook', label: 'E-Book' },
      { value: 'audiobook', label: 'Audiobook' },
    ],
    required: true,
  },
]

// Base schema that doesn't change
const baseSchema = [
  {
    id: 'productType',
    span: 1,
    component: 'QSelect',
    label: 'Product Type',
    subLabel: 'Select a product category',
    options: productTypes,
    required: true,
  },
  {
    id: 'productName',
    span: 1,
    component: 'QInput',
    label: 'Product Name',
    required: true,
  },
  {
    id: 'price',
    span: 1,
    component: 'QInput',
    label: 'Price',
    type: 'number',
    prefix: '$',
    required: true,
    parseInput: (val) => Number(val),
  },
  {
    id: 'quantity',
    span: 1,
    component: 'QInput',
    label: 'Quantity',
    type: 'number',
    required: true,
    min: 1,
    parseInput: (val) => Number(val),
  },
]

// Dynamic schema based on product type
const dynamicSchema = computed(() => {
  let additionalFields = []
  console.log(formData.value.productType.value)
  switch (formData.value.productType.value) {
    case 'electronics':
      additionalFields = electronicFields
      break
    case 'clothing':
      additionalFields = clothingFields
      break
    case 'furniture':
      additionalFields = furnitureFields
      break
    case 'books':
      additionalFields = bookFields
      break
    default:
      additionalFields = []
  }

  return [...baseSchema, ...additionalFields]
})

const resetForm = () => {
  formData.value = {
    productType: '',
    quantity: 1,
  }
}

const submitForm = () => {
  alert('Product added to inventory!')
  resetForm()
}
</script>

<template>
  <div class="q-pa-md">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6">Dynamic Product Form</div>
        <div class="text-subtitle2">Form fields change based on product type selection</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <BlitzForm
          v-model="formData"
          :schema="dynamicSchema"
          :columnCount="2"
          :internalLabels="true"
          gridGap="1.5rem"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Reset" color="warning" @click="resetForm" />
        <q-btn flat label="Add Product" color="positive" @click="submitForm" />
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
