import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    testTimeout: 30000, // 30 seconds for network-dependent tests
    hookTimeout: 30000,
  },
});
