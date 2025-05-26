export function formatDate(dateString) {
  if (!dateString) return "Invalid Date";

  try {
    // Remove "at" and time zone info (e.g., "UTC+6")
    const cleanString = dateString
      .replace("at", "")
      .replace(/UTC[+-]\d+/, "")
      .trim();

    const date = new Date(cleanString);

    // Check if it's a valid date
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
}
