<template>
    <PVButton icon="pi pi-plus" label="Add file" @click="addFile" />
    <div v-if="fileErrors.length > 0">
            <PVInlineMessage 
                severity="error"
                v-for="error in fileErrors" 
                :key="error"
            >
                {{ error }}
            </PVInlineMessage>
    </div>
    <PVTabView
        :pt="{
            root: ['flex'],
            panelContainer: ['flex-grow'],
            nav: {
                class: [
                    // Flexbox
                    //'flex flex-1',

                    // Spacing
                    'list-none',
                    'p-0 m-0',

                    // Colors
                    'bg-surface-0 dark:bg-surface-800',
                    'border-b border-surface-200 dark:border-surface-700',
                    'text-surface-900 dark:text-surface-0/80'
                ]
            }
        }"
    >
        <PVTabPanel 
            v-for="file in editFiles"
            :key="file.id"
        >
            <template #header>
                <template v-if="file.id == undefined || (file.name != 'main.py' && file.name != 'requirements.txt')">
                    <div class="space-x-2">
                        <PVInputText 
                            v-model="file.name" 
                        />
                        <PVButton 
                            severity="danger" 
                            icon="pi pi-trash" 
                            aria-label="Delete File"
                            @click="deleteFile(file)"
                        />
                    </div>
                </template>
                <template v-else>
                    {{ file.name }}
                </template>
            </template>

            <div class="space-y-2">
                <CodeEditor
                    width="100%"
                    :line-nums="true"
                    v-model="file.content"
                    :languages="[['python', 'Python']]"
                />
            </div>
        
        </PVTabPanel>
    </PVTabView>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

// PrimeVue
import PVButton from "primevue/button"
import PVInputText from "primevue/inputtext"
import PVInlineMessage from 'primevue/inlinemessage';
import PVTabView from "primevue/tabview"
import PVTabPanel from "primevue/tabpanel"

// Code Editor
import CodeEditor from "simple-code-editor"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import hljs from 'highlight.js';

// Our Types
import type { NAPluginFile } from "@/types"

const props = defineProps({
    modelValue: {
        type: Array<NAPluginFile>,
        required: false
    }
})

const editFiles = ref<NAPluginFile[]>([]);
const fileErrors = ref<string[]>([]);

onMounted(() => {
    if(props.modelValue)
        editFiles.value = props.modelValue
})

const emits = defineEmits(['update:model-value'])

watch(editFiles, (v) => {
    // Check for Errors
    fileErrors.value = validateFiles(v);

    // If No Errors Emit an Update
    if(fileErrors.value.length == 0) {
        emits('update:model-value', v)
    }
}, { deep: true })

function validateFiles(files: NAPluginFile[]): string[]
{
    const errors: string[] = []

    const index = files.findIndex((file) => { return file.name === 'main.py'})

    // Ensure we have a main.py file
    if (-1 === index)
        errors.push("No main.py File Found!")

    // Ensure the main.py file has a Plugin Class
    if (index != -1 && !files[index].content?.includes('class Plugin:\n'))
        errors.push("Plugin class not detected!")

    // Ensure we don't have duplicate filenames:
    if (new Set(files.map(file => file.name)).size !== files.length)
        errors.push("Multiple files have the same name!")

    return errors
}

function addFile() {
    editFiles.value.push({
        id: undefined,
        name: null,
        content: ''
    })
}

function deleteFile(file: NAPluginFile) {
    // Find the Index
    const index = editFiles.value.findIndex((f) => {
        return f === file
    })
    // Return if Not Found
    if (index == -1) return
    // Delete
    editFiles.value.splice(index, 1);
}

</script>