<template>
    <template v-if="!props.entryFile">
        <p><b>No Entry file Detected!</b></p>
        <p>Ensure you have a `main.py` file!</p>
    </template>
    <template v-else>
        <PVButton icon="pi pi-plus" label="Add Command" @click="addCommand"/>
        <div v-for="command in commands" :key="command.id" class="space-y-2">
            <div class="flex space-x-2">
                <div>
                    Command:
                    <PVInputText v-model="command.name" />
                </div>
                <div>
                    Function:
                    <PVDropdown
                        option-label="name"
                        option-value="name"
                        v-model="command.function"
                        :options="extractFunctionNames(props.entryFile.content)" 
                    />
                </div>
                <PVButton 
                        icon="pi pi-trash" 
                        aria-label="Delete Command"
                        severity="danger"
                        @click="deleteCommand(command)"
                    />
            </div>
            <div>
                Description:
                <PVTextarea
                    class="w-full"
                    v-model="command.description" 
                />
            </div>
            <ArgumentEditor 
                v-model="command.arguments"
                :entryFile="props.entryFile"
                :function="command.function"
                :custom-argument-types="props.customArgumentTypes"
            />
        </div>
    </template>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// PrimeVue
import PVButton from 'primevue/button'
import PVDropdown from 'primevue/dropdown'
import PVInputText from 'primevue/inputtext'
import PVTextarea from 'primevue/textarea'

// Our Components
import ArgumentEditor from "./ArgumentEditor.vue"

// Types
import type { NAPluginCommand, NAPluginFile } from '@/types';



const props = defineProps({
    modelValue: {
        type: Array<NAPluginCommand>,
        required: false
    },
    entryFile: {
        type: Object as () => NAPluginFile,
        required: false
    },
    customArgumentTypes: {
        type: Array<{filter: String, name: String, items: {name: String, value: Number}[]}>,
        required: false,
    }
})

const commands = ref<NAPluginCommand[]>([]);

const emits = defineEmits(['update:model-value']);

watch(commands, (v) => {
    emits('update:model-value', v)
}, {deep: true});

/**
 * Functions
 */
// Add a new Command
function addCommand() {
    // Push blank command
    commands.value.push({} as NAPluginCommand)
}

// Remove a Command
function deleteCommand(command: NAPluginCommand) {
    // Find the Index
    const index = commands.value.findIndex((c) => { return c === command })
    // Return if not found
    if (index === -1) return;
    // Remove the command
    commands.value.splice(index, 1);
}

/**
 * Extract functions from python source code
 */
function extractFunctionNames(code: string | undefined): {name: string}[] {
    if (!code) return [];

    const ignoredFunctions = ["__init__"];
    const functionRegex = /def\s+(\w+)\s*\(/g;

    const functionNames = (code.match(functionRegex) ?? [])
        .map(
            (match: any) => (
                { name: match.replace(functionRegex, "$1") }
            )
        )
        .filter((functionInfo) => functionInfo.name && !ignoredFunctions.includes(functionInfo.name));

  return functionNames;
}



</script>