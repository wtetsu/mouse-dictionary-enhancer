import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "./vitest.setup.ts",
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src"],
      exclude: [
        "src/@types/*.ts",
      ],
    },
  },
});
