import { Stack } from "expo-router";
import { ProgressProvider } from "./progressContext";

export default function Layout() {
  return (
    <ProgressProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProgressProvider>
  );
}