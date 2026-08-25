import { toast as sonnerToast } from "sonner";

/**
 * Thin wrapper around Sonner (the toast SDK) that preserves the
 * `toast.success(...)`, `toast.error(...)` call-sites already used
 * throughout the app, so every existing caller kept working unchanged.
 */
export const useToast = () => ({
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  warning: (message: string) => sonnerToast.warning(message),
  info: (message: string) => sonnerToast.info(message),
});

export default useToast;
