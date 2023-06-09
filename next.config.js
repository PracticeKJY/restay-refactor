/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "phinf.pstatic.net",
      "k.kakaocdn.net",
      "res.cloudinary.com",
    ],
  },
  transpilePackages: ["jotai-devtools"],
}

module.exports = nextConfig
