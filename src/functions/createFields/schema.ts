export default {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    baseID: { type: "string" },
    fields: { type: "array" },
  },
  required: ["apiKey"],
} as const;
