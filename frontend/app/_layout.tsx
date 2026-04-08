import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNav from "../components/BottomNav";

export default function Layout() {
  const pathname = usePathname();

  const hideBottomNavOn = ["/", "/login", "/signup", "/avatar"];
  const showBottomNav = !hideBottomNavOn.includes(pathname);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {showBottomNav && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});