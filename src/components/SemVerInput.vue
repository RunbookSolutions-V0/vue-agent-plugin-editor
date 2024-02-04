<template>
    <PVInputGroup>
        <PVInputNumber
            showButtons
            v-model="major"
            :min="0"
        />
        <PVInputGroupAddon>.</PVInputGroupAddon>
        <PVInputNumber
            showButtons
            v-model="minor"
            :min="0"
        />
        <PVInputGroupAddon>.</PVInputGroupAddon>
        <PVInputNumber
            showButtons
            v-model="patch"
            :min="0"
        />
    </PVInputGroup>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

// PrimeVue
import PVInputGroup from 'primevue/inputgroup';
import PVInputGroupAddon from 'primevue/inputgroupaddon';
import PVInputNumber from 'primevue/inputnumber'

const props = defineProps({
    modelValue: {
        type: String,
        required: false
    }
});

const emits = defineEmits(['update:model-value'])

const major = ref(0);
const minor = ref(0);
const patch = ref(0);

const versionString = computed(() => {
    return major.value.toString() + 
        "." + minor.value.toString() + 
        "." + patch.value.toString()
})

watch(versionString, (v) => {
    emits('update:model-value', v)
})

onMounted(() => {
    if(props.modelValue)
        processPropVersion()
})

function processPropVersion() {
    if(!props.modelValue) return

    const version = props.modelValue;

    const split = version.split(".")
    if(split.length != 3) return

    major.value = Number.parseInt(split[0])
    minor.value = Number.parseInt(split[1])
    patch.value = Number.parseInt(split[2])
}

</script>