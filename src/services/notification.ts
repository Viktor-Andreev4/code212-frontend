import { createStandaloneToast } from '@chakra-ui/toast'

const { toast } = createStandaloneToast()

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

const notification = (title: string, description: string, status: ToastStatus) => {
    toast({
        title,
        description,
        status,
        isClosable: true,
        duration: 4000
    })
}

export const successNotification = (title : string, description: string) => {
    notification(
        title,
        description,
        "success"
    )
}

export const errorNotification = (title: string, description: string) => {
    notification(
        title,
        description,
        "error"
    )
}