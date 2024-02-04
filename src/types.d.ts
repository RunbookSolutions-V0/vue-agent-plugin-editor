export type NAPlugin = {
    id: string | number | undefined;
    name: string | null;
    version: string | undefined;
    description: string | null;
    files: NAPluginFile[] | undefined;
    commands: NAPluginCommand[] | undefined;
}

export type NAPluginFile = {
    id: string | number | undefined;
    name: string | null;
    content: string | undefined;
}

export type NAPluginCommand = {
    id: string | number | undefined;
    name: string | null;
    description: string | null;
    function: string | undefined;
    arguments: NAPluginCommandArgument[] | undefined
}

export type NAPluginCommandArgument = {
    id: string | number | undefined;
    name: string;
    type: int;
    default: string | null;
    required: boolean;
}