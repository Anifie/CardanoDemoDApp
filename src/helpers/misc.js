export function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
export function fromTo(from, to) {
  return from <= to ? Math.floor(Math.random() * (to - from + 1)) + from : null;
}
export function pickIn(array) {
  if (array == null || array.length == 0) return null;
  return array[fromTo(0, array.length - 1)];
}

export const uuidv4 = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback implementation if crypto.randomUUID is not available
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export function stringToColor(str) {
  // Create a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }

  return color;
}
export async function delay(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}