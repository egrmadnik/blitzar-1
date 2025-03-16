<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          Blitzar Form Examples
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header>Example Pages</q-item-label>
        
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Basic Form</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/validation-example" exact>
          <q-item-section avatar>
            <q-icon name="check_circle" />
          </q-item-section>
          <q-item-section>Form Validation</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dynamic-form" exact>
          <q-item-section avatar>
            <q-icon name="dynamic_form" />
          </q-item-section>
          <q-item-section>Dynamic Form</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/conditional-fields" exact>
          <q-item-section avatar>
            <q-icon name="rule" />
          </q-item-section>
          <q-item-section>Conditional Fields</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
