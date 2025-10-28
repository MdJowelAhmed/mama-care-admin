export const getImageUrl = (path?: string): string => {
  if (!path) {
    return "/assets/image4.png"; // default image
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = "https://moshfiqur5002.binarybards.online";
  return `${baseUrl}/${path}`;
};
