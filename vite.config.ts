import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import legacy from "@vitejs/plugin-legacy";
import vitePluginAliOss from "vite-plugin-ali-oss";

// https://vitejs.dev/config/
export default defineConfig(({ mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // base: !ssrBuild ? env.PUBLIC_URL : "/",
    build: {
      assetsDir: "mobile-assets",
    },
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ["ie >= 11"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
      // !ssrBuild &&
      //   vitePluginAliOss({
      //     region: env.ALIYUN_OSS_REGION,
      //     accessKeyId: env.ACCESS_KEY_ID,
      //     accessKeySecret: env.ACCESS_KEY_SECRET,
      //     bucket: env.ALIYUN_OSS_BUCKET,
      //     overwrite: true,
      //   }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    ssr: {
      format: "cjs",
    },
  };
});
