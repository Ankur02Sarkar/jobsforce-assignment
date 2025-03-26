"use client";

import { useCallback } from "react";
import { useLoader } from "./LoaderContext";

interface UseLoadingOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * A hook to easily handle loading states with the global loader
 * @example
 * // Basic usage
 * const { withLoading } = useLoading();
 *
 * // In an event handler or effect
 * const handleSubmit = async () => {
 *   await withLoading(async () => {
 *     await someAsyncOperation();
 *   });
 * };
 *
 * @example
 * // With success and error handlers
 * const { withLoading } = useLoading({
 *   onSuccess: () => toast.success("Operation completed successfully"),
 *   onError: (error) => toast.error(error.message)
 * });
 */
export function useLoading(options: UseLoadingOptions = {}) {
  const { showLoader, hideLoader } = useLoader();

  const withLoading = useCallback(
    async <T>(promise: () => Promise<T>): Promise<T | undefined> => {
      try {
        showLoader();
        const result = await promise();
        if (options.onSuccess) {
          options.onSuccess();
        }
        return result;
      } catch (error) {
        if (options.onError) {
          options.onError(error);
        } else {
          console.error(error);
        }
        return undefined;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader, options],
  );

  return { withLoading };
}
