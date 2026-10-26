/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Feed tiles and history thumbnails are small and numerous, so they use a lower quality than the 75 default.
    qualities: [50, 60, 75],
    // New mock generations are served by the picsum.photos random-image API (it redirects to fastly.picsum.photos).
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
