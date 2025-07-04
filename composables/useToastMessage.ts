// composables/useToastMessage.ts

type ToastColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error'
type ToastType = 'success' | 'error' | 'info' | 'warning'

const toastConfig: Record<ToastType, { color: ToastColor; icon: string }> = {
  success: {
    color: 'success',
    icon: 'i-heroicons-check-circle',
  },
  error: {
    color: 'error',
    icon: 'i-heroicons-exclamation-circle',
  },
  info: {
    color: 'primary',
    icon: 'i-heroicons-information-circle',
  },
  warning: {
    color: 'warning',
    icon: 'i-heroicons-exclamation-triangle',
  },
}

export function useToastMessage() {
  const toast = useToast()

  return (type: ToastType, title: string, description?: string) => {
    const config = toastConfig[type]

    toast.add({
      title,
      description,
      color: config.color, // agora TypeScript aceita
      icon: config.icon,
    })
  }
}

