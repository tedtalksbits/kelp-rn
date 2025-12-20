// components/ui/use-haptics.ts
import * as Haptics from 'expo-haptics';
export function useHaptics() {
  return {
    success: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warning: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    soft: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
    rigid: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid),
    error: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    selection: () => Haptics.selectionAsync(),
  };
}
