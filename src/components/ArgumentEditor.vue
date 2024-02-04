<template>
    <div class="space-y-2">
        <template v-for="argument in editArguments" :key="argument.name">
            <div class="flex space-x-2 ml-20">
                <div>
                    Name:
                    <PVInputText v-model="argument.name" readonly disabled />
                </div>
                <div>
                    Type:
                    <PVDropdown
                        v-model="argument.type"
                        :options="getArgumentTypes(argument.name)" 
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Argument Type" 
                        class="w-full md:w-14rem"
                        optionGroupLabel="name" 
                        optionGroupChildren="items"
                    />
                </div>
                <div>
                    Default:
                    <PVInputText v-model="argument.default" />
                </div>
                <!-- <PVButton 
                        icon="pi pi-trash" 
                        aria-label="Delete Command"
                        severity="danger"
                        @click="deleteCommand(command)"
                    /> -->
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// PrimeVue
import PVDropdown from 'primevue/dropdown'
import PVInputText from 'primevue/inputtext'

// Types
import type { NAPluginCommandArgument, NAPluginFile } from '@/types';
import argumentTypes from "./argumentTypes"

const props = defineProps({
    modelValue: {
        type: Array<NAPluginCommandArgument>,
        required: false,
    },
    entryFile: {
        type: Object as () => NAPluginFile,
        required: false
    },
    function: {
        type: String,
        required: false,
    },
    customArgumentTypes: {
        type: Array<{filter: String, name: String, items: {name: String, value: Number}[]}>,
        required: false,
    }
})

const editArguments = ref<NAPluginCommandArgument[]>([]);

const emits = defineEmits(['update:model-value'])

watch(editArguments, (v) => {
    emits('update:model-value', v)
}, {deep: true})

function getArgumentTypes(argumentName: string)
{
    const codeArgument = extractFunctionArguments(props.entryFile?.content, props.function)
        .find((arg) => { 
            return arg.key === argumentName
        })
    if (!codeArgument) return [];

    let allTypes = argumentTypes;
    if(props.customArgumentTypes) {
        allTypes = allTypes.concat(props.customArgumentTypes)
    }

    return allTypes.filter((argType) => { return argType.filter === codeArgument.type})
}

function getArgumentValue(argumentType: string) : Number
{
    let allTypes = argumentTypes;
    return allTypes.find((argType) => { return argType.filter === argumentType})?.items[0].value || 0

}


watch(() => props.function, () => {
    console.log("Function Changed!");

    // Set the arguments from the props
    if(props.modelValue) editArguments.value = props.modelValue

    // Get the arguments from python source code
    const functionArguments = extractFunctionArguments(props.entryFile?.content, props.function);

    // Iterate though arguments from source code
    functionArguments.forEach((arg) => {
        // Check if its already defined
        const index = editArguments.value.findIndex((eArg) => {
            return eArg.name == arg.key
        })
        if (index == -1) {
            editArguments.value.push({
                id: undefined,
                name: arg.key,
                type: getArgumentValue(arg.type),
                default: arg.default,
                required: arg.required
            })
        }else{
            console.log("Argument Already Exists")
        }
    })

}, {deep:true});

watch(editArguments, (v)=> {
    emits('update:model-value', v)
}, { deep: true })

/**
 * Extract Argument info from python source code
 */
 type ArgumentInput = {
  key: string;
  type: string;
  default: any;
  required: boolean;
}
function extractFunctionArguments(code: string | undefined, functionName: string | undefined): ArgumentInput[] {
    if(!code || !functionName) return [];

    const functionRegex = new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`, "g");
    const match = functionRegex.exec(code);

    if (match && match[1]) {
        const argumentDetails: ArgumentInput[] = [];

        const argumentList = match[1].split(",");

        argumentList.forEach((argument) => {
            const [nameWithType, defaultValue] = argument.trim().split("=").map((item) => item.trim());
            const [name, type] = nameWithType.split(":").map((item) => item.trim());

            const required = typeof defaultValue === "undefined";
            if (name !== "self") {
                argumentDetails.push({key: name, type: type, required: required, default: defaultValue?.replace(/"/g, "")} as ArgumentInput);
            }
        });

        return argumentDetails;
    }

    return [];
}
</script>