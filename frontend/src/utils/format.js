export function formatINR(amount) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

export function toISODateInputValue(date) {
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}