/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "twirpz.files.wordpress.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "soham-twitter-dev.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

module.exports = nextConfig;
