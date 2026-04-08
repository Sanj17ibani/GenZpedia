import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      
      {/* HOME */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
        <Ionicons
          name="home-outline"
          size={22}
          color={pathname === "/home" ? "#32A67C" : "#999"}
        />
        <Text style={pathname === "/home" ? styles.activeNavText : styles.navText}>
          Home
        </Text>
      </TouchableOpacity>

      {/* DICTIONARY (future page) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          // TEMP: show alert until you build page
          alert("Dictionary page coming soon 🚀");
          // later: router.push("/dictionary")
        }}
      >
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={22}
          color={pathname === "/dictionary" ? "#32A67C" : "#999"}
        />
        <Text
          style={pathname === "/dictionary" ? styles.activeNavText : styles.navText}
        >
          Dictionary
        </Text>
      </TouchableOpacity>

      {/* LEADERBOARD */}
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="trophy-outline" size={22} color="#999" />
        <Text style={styles.navText}>Leaderboard</Text>
      </TouchableOpacity>

      {/* SEARCH */}
      <TouchableOpacity style={styles.navItem}>
        <Feather name="search" size={22} color="#999" />
        <Text style={styles.navText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 10,
    paddingBottom: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  activeNavText: {
    fontSize: 11,
    color: "#32A67C",
    marginTop: 4,
    fontWeight: "700",
  },
});