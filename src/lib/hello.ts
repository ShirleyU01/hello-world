const MAX_NAME_LENGTH = 40;

export type HelloResponse = {
  message: string;
  service: "backend";
  node: string;
  time: string;
  name: string | null;
};

export function cleanName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
  return cleaned.length > 0 ? cleaned : null;
}

export function helloMessage(name: string | null): string {
  if (!name) return "Hello from the backend.";
  return `Hello, ${name}. The backend is up.`;
}
