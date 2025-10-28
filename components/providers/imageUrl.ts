export const getImageUrl = (path?: string): string => {
  if (!path) {
    return "/assets/image4.png"; // default image
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = "http://10.10.7.111:5002";
  return `${baseUrl}/${path}`;
};
