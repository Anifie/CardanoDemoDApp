import { toPng } from 'html-to-image';


export const getYoutubeThumbnail = (ytbId, resolution) => {
  return `https://ou9cmwssz2.execute-api.ap-northeast-1.amazonaws.com/ytb-img?ytbId=${ytbId}&resolution=${resolution}`;
};

export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
export const divToBase64 = (divId) => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementById(divId);
      if (!element) {
        reject(new Error('Element not found'));
        return;
      }

      // Use html2canvas to capture the div content
      // Create a canvas element

      toPng(element, {cacheBust: true}).then(dataUrl => {
        resolve(dataUrl);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const fetchImageToBase64 = async (url) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const blob = await response.blob();
    return await imageToBase64(blob);
  } catch (error) {
    throw error;
  }
};
