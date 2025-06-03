import { toast } from "sonner"

export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: 5000,
  })
}

export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description,
    duration: 8000,
  })
}

export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 4000,
  })
}

export const showWarningToast = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    duration: 6000,
  })
}
