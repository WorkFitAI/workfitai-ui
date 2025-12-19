import { toast, ToastOptions, TypeOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, { ...defaultOptions, ...options });
    },

    error: (message: string, options?: ToastOptions) => {
        toast.error(message, { ...defaultOptions, ...options });
    },

    warning: (message: string, options?: ToastOptions) => {
        toast.warning(message, { ...defaultOptions, ...options });
    },

    info: (message: string, options?: ToastOptions) => {
        toast.info(message, { ...defaultOptions, ...options });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            pending: string;
            success: string;
            error: string;
        },
        options?: ToastOptions
    ) => {
        return toast.promise(promise, messages, { ...defaultOptions, ...options });
    },
};

// Helper to extract error message from API response
export const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return "An unexpected error occurred";
};
