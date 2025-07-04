// composables/useFileUpload.ts

export function useFileUpload() {
  const file = ref<File | null>(null)
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref<string | null>(null)
  const returnedFileName = ref<string | null>("https://quizou.s3.us-east-1.amazonaws.com/placeholder/thumb_placeholder.png");

  async function uploadFile(fileToUpload = file.value) {
    const config = useRuntimeConfig();

    if (!fileToUpload) return
    const formData = new FormData()
    formData.append('file', fileToUpload)

    isUploading.value = true
    error.value = null

    try {
      const res = await fetch(`${config.public.apiBase}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Falha no upload')

      returnedFileName.value = await res.text();


    } catch (err: any) {
      error.value = err.message || 'Erro desconhecido'
    } finally {
      isUploading.value = false
    }
  }

  function selectFile(event: Event) {
    const target = event.target as HTMLInputElement
    const selected = target.files?.[0]
    if (selected) {
      file.value = selected
      uploadFile(selected)
    }
  }

  return {
    file,
    isUploading,
    uploadProgress,
    error,
    selectFile,
    uploadFile,
    returnedFileName
  }
}

