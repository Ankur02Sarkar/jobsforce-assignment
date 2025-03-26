"use client";

import { useCallback, useState } from "react";
import { useLoader } from "./LoaderContext";

interface UseLoadingOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * A hook to easily handle loading states with the global loader
 * @example
 * // Basic usage
 * const { withLoading, isLoading } = useLoading();
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
 * const { withLoading, isLoading } = useLoading({
 *   onSuccess: () => toast.success("Operation completed successfully"),
 *   onError: (error) => toast.error(error.message)
 * });
 */
export function useLoading(options: UseLoadingOptions = {}) {
  const { showLoader, hideLoader } = useLoader();
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(
    async <T>(promise: () => Promise<T>): Promise<T | undefined> => {
      try {
        showLoader();
        setIsLoading(true);
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
        setIsLoading(false);
      }
    },
    [showLoader, hideLoader, options],
  );

  return { withLoading, isLoading };
}
