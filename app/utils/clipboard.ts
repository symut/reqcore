export async function copyToClipboard(text: string): Promise<boolean> {
  if (!import.meta.client) return false

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for non-secure contexts (e.g. testing via HTTP IP)
      const textArea = document.createElement("textarea")
      textArea.value = text
      
      // Prevent scrolling to bottom of page in MS Edge
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      let successful = false
      try {
        successful = document.execCommand('copy')
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      }
      
      document.body.removeChild(textArea)
      return successful
    }
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}
