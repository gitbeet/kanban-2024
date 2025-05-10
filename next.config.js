/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "b0ys30u6uc.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default config;
