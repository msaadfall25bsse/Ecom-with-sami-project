import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "Ecom With Sami - Master UAE & KSA Dropshipping",
  description: "Learn high-ticket GCC e-commerce & dropshipping with Sami Ur Rehman",
  prerender: {
    partial: true
  },

  extends: [vikeReact],
};

export default config;
