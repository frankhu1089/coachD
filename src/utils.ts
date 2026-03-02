export async function shareText(text: string) {
  if (navigator.share) {
    try { await navigator.share({ text }) } catch { /**/ }
  } else {
    await navigator.clipboard.writeText(text)
  }
}
