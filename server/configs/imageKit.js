import ImageKit from "@imagekit/nodejs";

const imagekit = process.env.IMAGEKIT_PRIVATE_KEY
  ? new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY })
  : null;

export default imagekit;
