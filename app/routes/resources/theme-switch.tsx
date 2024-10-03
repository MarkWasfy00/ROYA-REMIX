import { parseWithZod } from '@conform-to/zod';
import { useFetchers } from '@remix-run/react';
import { useHints } from '~/client/client-hints';
import { useRequestInfo } from '~/client/request-info';
import { z } from 'zod';

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  // this is useful for progressive enhancement
  redirectTo: z.string().optional(),
})

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}

export function useOptimisticThemeMode() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(
    (f) => f.formAction === '/'
  );

  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema,
    });

    if (submission.status === 'success') {
      return submission.value.theme;
    }
  }
}