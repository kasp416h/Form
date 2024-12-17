function sluggable(data: string): string {
  data = data.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
  data = data.replace(/æ|ä/g, "ae");
  data = data.replace(/ø|ö/g, "oe");
  data = data.replace(/å/g, "aa");
  data = data.replace(/ü/g, "ue");
  data = data.replace(/ß/g, "ss");
  data = data.replace(/Æ|Ä/g, "Ae");
  data = data.replace(/Ø|Ö/g, "Oe");
  data = data.replace(/Å/g, "Aa");
  data = data.replace(/Ü/g, "Ue");
  data = data.replace(/\s+/g, "-").replace(/[^\w/\-]/g, "");
  data = data.replace(/-+/g, "-").replace(/\/+/g, "/");
  data = data.toLowerCase();
  data = data.replace(/^[/-]+|[/-]+$/g, "");

  if (data.charAt(0) !== "/") {
    data = "/" + data;
  }

  return data;
}

function trimWhitespace(data: string): string {
  return data.trim();
}

function toUpperCase(data: string): string {
  return data.toUpperCase();
}

function onlyNumbers(data: string): string {
  data = data.replace(/(\D)/gi, "");
  return data.toLowerCase();
}

function onlyLetters(data: string): string {
  data = data.replace(/([^a-zåæø])/gi, "");
  return data.toLowerCase();
}

function sanitizeEmail(data: string): string {
  return data.trim().toLowerCase();
}

function formatCurrency(data: string): string {
  const numericData = Number.parseFloat(data.replace(/[^\d.]/g, ""));
  return numericData.toFixed(2);
}

export const formHelpers = {
  sluggable,
  trimWhitespace,
  toUpperCase,
  onlyNumbers,
  onlyLetters,
  sanitizeEmail,
  formatCurrency,
};
