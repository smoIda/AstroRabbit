export function formatText(text: string) {
  return text.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");
}
