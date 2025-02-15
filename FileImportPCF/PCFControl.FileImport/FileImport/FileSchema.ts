import type { JSONSchema4 } from 'json-schema' 

export const FileSchema: JSONSchema4  = {
    description: "Please select file or image",
    title: 'File',
    type: 'object',
    properties: {
        content: {
            type: "string",
            // format: "byte"
        },
        name: {
            type: "string"
        }
    },
    "x-ms-content-hint": 'FILE',
    "x-ms-dynamically-added": true
}