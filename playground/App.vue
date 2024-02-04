<template>
    <div class="p-5">
        <PluginEditor 
            v-model="plugin"
            :custom-argument-types="customArgumentTypes"
        />
    </div>
    <PVDivider />
    <pre class="overflow-hidden">{{ plugin }}</pre>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import PVDivider from "primevue/divider"

import type { NAPlugin } from '../src/types.d.ts'
import PluginEditor from "../src/PluginEditor.vue"

const plugin = ref<NAPlugin>({
id: undefined,
name: "My Plugin",
version: "0.0.100",
files: undefined,
commands: undefined,
description: null
})

const customArgumentTypes = [
    { filter: 'str', name: 'RBS Custom', items: [
        { filter: 'str', name: 'Core Attachment ID', value: 100 },
        { filter: 'str', name: 'Core Contact ID', value: 101 },
        { filter: 'str', name: 'Core Device ID', value: 102 },
        { filter: 'str', name: 'Core Location ID', value: 103 },
        { filter: 'str', name: 'Core Network ID', value: 104 },
        { filter: 'str', name: 'Core Network Address ID', value: 105 },
        { filter: 'str', name: 'Core Note ID', value: 106 },
    ]}
]

</script>