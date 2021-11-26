export default {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    baseID: { type: "string" },
    id: { type: "string" },
  },
  required: ["apiKey"],
} as const;
