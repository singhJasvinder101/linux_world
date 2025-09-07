/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, context) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });
    return config;
  },
}

module.exports = nextConfig