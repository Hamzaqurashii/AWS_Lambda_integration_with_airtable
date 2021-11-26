export default {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    baseID: { type: "string" },
    id: { type: "string" },
    Name: { type: "string" },
    Note: { type: "string" },
  },
  required: ["apiKey"],
} as const;
