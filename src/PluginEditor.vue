<template>
    <template v-if="!editPlugin">
        No Plugin Provided
    </template>
    <template v-else>
        <div class="space-y-2 w-full">
            <div>
                <label for="name" class="block text-sm font-medium leading-6">Plugin Name</label>
                <div class="mt-2">
                    <PVInputText class="w-full" id="name" v-model="editPlugin.name" />
                </div>
            </div>
            <div>
                <label for="version" class="block text-sm font-medium leading-6">Plugin Version</label>
                <div class="mt-2">
                    <SemVerInput id="version" v-model="editPlugin.version" />
                </div>
            </div>

            <div>
                <label for="description" class="block text-sm font-medium leading-6">Plugin Description</label>
                <div class="mt-2">
                    <PVTextarea class="w-full" id="description" v-model="editPlugin.description" />
                </div>
            </div>

            <FileEditor v-model="editPlugin.files" />

            <CommandEditor 
                :custom-argument-types="props.customArgumentTypes"
                v-model="editPlugin.commands" 
                :entryFile="entryFile" 
            />
        </div>
    </template>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

// PrimeVue
import PVInputText from "primevue/inputtext"
import PVTextarea from 'primevue/textarea';

// Our Components
import CommandEditor from "./components/CommandEditor.vue";
import FileEditor from "./components/FileEditor.vue"
import SemVerInput from "./components/SemVerInput.vue"

// Types
import type { NAPluginFile, NAPlugin } from "./types";

const props = defineProps({
    modelValue: {
        type: Object as () => NAPlugin,
        required: false
    },
    customArgumentTypes: {
        type: Array<{filter: String, name: String, items: {name: String, value: Number}[]}>,
        required: false,
    }
});

const editPlugin = ref<NAPlugin>();
const entryFile = ref<NAPluginFile>();

const emits = defineEmits(['update:model-value'])

onMounted(() => {
    editPlugin.value = props.modelValue
    if(!editPlugin.value) return
    if (!editPlugin.value.files) {
        editPlugin.value.files = []
        editPlugin.value.files.push(
            {
                id: undefined,
                name: "main.py",
                content: `class Plugin:
    def __init__(self, api: API):
        self.api = api

    def plugin_command(self, name: str, number: int) -> None:
        // Your Code Here ...
`,
            },
            {
                id: undefined,
                name: "requirements.txt",
                content: `##### Plugin Requirements #####
# List any python packages your plugin needs here.
`,
            },
        )
    }
})

watch(() => editPlugin.value?.files, () => {
    // Return as we don't have a plugin we are editing
    if(!editPlugin.value || !editPlugin.value.files) return;

    // Get Entry File Index
    const index = editPlugin.value.files.findIndex((file) => { return file.name === 'main.py' })

    // We don't have the entry file...
    if (index == -1) return;

    // Set the Entry File
    entryFile.value = editPlugin.value.files[index] 
}, {deep: true})


watch(editPlugin, (v) => {
    emits('update:model-value', v)
})


</script>