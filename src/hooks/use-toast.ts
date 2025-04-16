
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export const toast = ({ title, description, action, variant }: ToastProps = {}) => {
  sonnerToast(title, {
    description,
    action,
    className: variant === "destructive" ? "destructive" : undefined
  });
};

// Legacy toast hook for compatibility with existing components
export const useToast = () => {
  return {
    toast: ({ title, description, action, variant }: ToastProps = {}) => {
      sonnerToast(title, {
        description,
        action,
        className: variant === "destructive" ? "destructive" : undefined
      });
    },
    toasts: []
  };
};
