<template>
  <q-page class="flex flex-center">
    <div class="q-pa-lg">
      <h1 class="text-h3 q-mb-md">Blitzar with Quasar Framework</h1>
      <p class="text-body1 q-mb-lg">
        This is a demo project showcasing Blitzar components integrated with the Quasar Framework.
        Use the navigation drawer to explore the various examples.
      </p>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="feature-card">
            <q-card-section>
              <div class="text-h5 q-mb-sm">BlitzForm Examples</div>
              <p>Explore different ways to use the BlitzForm component, including:</p>
              <ul>
                <li>Basic forms with various field types</li>
                <li>Form modes (edit, readonly, disabled)</li>
                <li>Action buttons (save, edit, delete, etc.)</li>
                <li>Form validation</li>
              </ul>
              <q-btn color="primary" label="View Examples" to="/blitz-form" class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="feature-card">
            <q-card-section>
              <div class="text-h5 q-mb-sm">BlitzListForm Examples</div>
              <p>See how to use the BlitzListForm component for managing lists of items:</p>
              <ul>
                <li>Basic list functionality</li>
                <li>Advanced lists with action buttons</li>
                <li>Readonly list display</li>
              </ul>
              <q-btn color="secondary" label="View Examples" to="/list-form" class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="feature-card">
            <q-card-section>
              <div class="text-h5 q-mb-sm">Form Validation</div>
              <p>Learn how to implement form validation with Blitzar:</p>
              <ul>
                <li>Field-level validation rules</li>
                <li>Form-level validation</li>
                <li>Custom validation messages</li>
              </ul>
              <q-btn color="accent" label="View Examples" to="/validation-example" class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="feature-card">
            <q-card-section>
              <div class="text-h5 q-mb-sm">Conditional Fields</div>
              <p>See how to implement conditional form behavior:</p>
              <ul>
                <li>Show/hide fields based on other field values</li>
                <li>Dynamic schema modifications</li>
                <li>Dependent field validation</li>
              </ul>
              <q-btn color="purple" label="View Examples" to="/conditional-fields" class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// No additional script needed for this page
</script>

<style scoped>
.feature-card {
  height: 100%;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}
</style>
