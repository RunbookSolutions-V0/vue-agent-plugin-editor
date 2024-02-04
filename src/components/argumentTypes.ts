export default [
    // Text Types
    { filter: 'str', name: 'Built-In', items: [
        { filter: 'str', name: 'Text', value: 0 },
    ]},

    // Numeric Types
    { filter: 'int', name: 'Built-In', items: [
        { name: 'Integer', value: 1 },
    ]},
    { filter: 'float', name: 'Built-In', items: [
        { name: 'Float', value: 2 },
    ]},
    { filter: 'complex', name: 'Built-In', items: [
        { name: 'Complex', value: 3 },
    ]},

    // Sequence Types
    { filter: 'list', name: 'Built-In', items: [
        { name: 'List', value: 4 },
    ]},
    { filter: 'tuple', name: 'Built-In', items: [
        { name: 'Tuple', value: 5 },
    ]},

    // Mapping Types
    { filter: 'dict', name: 'Built-In', items: [
        { name: 'Dictonary', value: 6 },
    ]},

    // Sets
    { filter: 'set', name: 'Built-In', items: [
        { name: 'Set', value: 7 },
    ]},

    // Boolean
    { filter: 'bool', name: 'Built-In', items: [
        { name: 'Boolean', value: 8 },
    ]},

    // Binary
    { filter: 'bytes', name: 'Built-In', items: [
        { filter: 'bytes', name: 'Bytes', value: 9 },
    ]},
] as Array<{filter: String, name: String, items: {name: String, value: Number}[]}>