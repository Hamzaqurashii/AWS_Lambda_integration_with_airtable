export default {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    baseID: { type: "string" },
    fields: { type: "string" },
  },
  required: ["apiKey"],
} as const;
