/**
 * DB da saqlangan URL ni joriy muhitga moslashtiradi.
 * - Production URLlarini (kafedrasayd.uz) BASE_URL ga almashtiradi
 * - Relative pathlarni BASE_URL bilan to'ldiradi
 */
export function resolveUrl(url) {
  if (!url) return null;
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  
  if (url.startsWith("http")) {
    // kafedrasayd.uz → BASE_URL
    return url.replace(/https?:\/\/kafedrasayd\.uz/, baseUrl);
  }
  // /uploads/file.png → http://localhost:5000/uploads/file.png
  return `${baseUrl}${url.startsWith("/") ? url : "/" + url}`;
}

/**
 * Yangi fayl yuklanganda to'liq URL yaratadi
 */
export function buildUploadUrl(filename) {
  if (!filename) return null;
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  return `${baseUrl}/uploads/${filename}`;
}
