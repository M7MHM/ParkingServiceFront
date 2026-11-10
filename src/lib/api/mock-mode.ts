export function isMockApi(): boolean {
  return process.env.MOCK_API === "true";
}
