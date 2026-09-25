with open("frontend/src/utils/session.ts", "r") as f:
    content = f.read()

old_format = """export function formatElapsedTime(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs % 3600) / 60)
  const remainingSecs = secs % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSecs)}`
  }
  return `${pad(minutes)}:${pad(remainingSecs)}`
}"""

new_format = """export function formatElapsedTime(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs % 3600) / 60)
  const remainingSecs = secs % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSecs)}`
}"""

content = content.replace(old_format, new_format)

with open("frontend/src/utils/session.ts", "w") as f:
    f.write(content)
