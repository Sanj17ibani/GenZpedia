import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuickSearchModal from "./QuickSearchModal";

const avatarMap = {
  female: [
    require("../assets/images/female1.png"),
    require("../assets/images/female2.png"),
    require("../assets/images/female3.png"),
    require("../assets/images/female4.png"),
  ],
  male: [
    require("../assets/images/male1.png"),
    require("../assets/images/male2.png"),
    require("../assets/images/male3.png"),
    require("../assets/images/male4.png"),
  ],
  prefer_not_to_say: [require("../assets/images/prefer_not.png")],
};

export default function PracticeScreen() {
  const router = useRouter();
  const { name, gender, avatarIndex } = useLocalSearchParams();
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  const safeGender =
    gender === "female" || gender === "male" || gender === "prefer_not_to_say"
      ? gender
      : "prefer_not_to_say";

  const safeAvatarIndex = Number(avatarIndex) || 0;

  const selectedProfileImage =
    avatarMap[safeGender][safeAvatarIndex] || avatarMap.prefer_not_to_say[0];

  const displayName = name ? String(name).toUpperCase() : "USER";

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.profileRow}>
              <Image source={selectedProfileImage} style={styles.profileImage} />
              <View>
                <Text style={styles.welcomeSmall}>Practice Time</Text>
                <Text style={styles.nameText}>{displayName}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuButton}>
              <Feather name="menu" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          {/* HERO */}
          <View style={styles.heroCard}>
            <Text style={styles.heroSubtitle}>
              Show them who's the GOAT!🗿
            </Text>
          </View>

          {/* SECTION */}
          <Text style={styles.sectionTitle}>Practice Modes</Text>

          {/* CARDS */}
          <View style={styles.cardGrid}>
            {/* Guess It */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.practiceCard, styles.cardMint]}
              onPress={() =>
                router.push({
                  pathname: "/guess-it",
                  params: {
                    name: String(name || "User"),
                    gender: String(gender || "prefer_not_to_say"),
                    avatarIndex: String(avatarIndex || "0"),
                  },
                })
              }
            >
              <Text style={styles.cardEmoji}>🤔</Text>
              <Text style={styles.cardTitle}>Guess It</Text>
              <Text style={styles.cardText}>
                Decode the meaning of slang and pick the right vibe.
              </Text>

              <View style={styles.arrowWrapper}>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#222" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Slang It In */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.practiceCard, styles.cardLavender]}
              onPress={() =>
                router.push({
                  pathname: "/slang-it-in",
                  params: {
                    name: String(name || "User"),
                    gender: String(gender || "prefer_not_to_say"),
                    avatarIndex: String(avatarIndex || "0"),
                  },
                })
              }
            >
              <Text style={styles.cardEmoji}>🔥</Text>
              <Text style={styles.cardTitle}>Slang It In!</Text>
              <Text style={styles.cardText}>
                Fill in the blank with the right slang like a pro.
              </Text>

              <View style={styles.arrowWrapper}>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#222" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Match the Vibe */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.practiceCard, styles.cardPeach]}
              onPress={() =>
                router.push({
                  pathname: "/match-the-vibe",
                  params: {
                    name: String(name || "User"),
                    gender: String(gender || "prefer_not_to_say"),
                    avatarIndex: String(avatarIndex || "0"),
                  },
                })
              }
            >
              <Text style={styles.cardEmoji}>😎</Text>
              <Text style={styles.cardTitle}>Match the Vibe</Text>
              <Text style={styles.cardText}>
                Match phrases to the mood, tone, or emoji energy.
              </Text>

              <View style={styles.arrowWrapper}>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#222" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Real Chat Challenge */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.practiceCard, styles.cardYellow]}
              onPress={() =>
                router.push({
                  pathname: "/VibeCheckScreen",
                  params: {
                    name: String(name || "User"),
                    gender: String(gender || "prefer_not_to_say"),
                    avatarIndex: String(avatarIndex || "0"),
                  },
                })
              }
            >
              <Text style={styles.cardEmoji}>💬</Text>
              <Text style={styles.cardTitle}>Real Chat Challenge</Text>
              <Text style={styles.cardText}>
                Practice with real-style chats and choose the best reply.
              </Text>

              <View style={styles.arrowWrapper}>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#222" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BOTTOM NAV */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() =>
              router.push({
                pathname: "/home",
                params: {
                  name: String(name || "User"),
                  gender: String(safeGender),
                  avatarIndex: String(safeAvatarIndex),
                },
              })
            }
          >
            <Ionicons name="home-outline" size={22} color="#999" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dictionary")}>
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={22}
              color="#999"
            />
            <Text style={styles.navText}>Dictionary</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="trophy-outline" size={22} color="#999" />
            <Text style={styles.navText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setShowQuickSearch(true)}>
            <Feather name="search" size={22} color="#999" />
            <Text style={styles.navText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="flash-outline" size={22} color="#32A67C" />
            <Text style={styles.activeNavText}>Practice</Text>
          </TouchableOpacity>
        </View>
        <QuickSearchModal visible={showQuickSearch} onClose={() => setShowQuickSearch(false)} />
      </SafeAreaView>
    </LinearGradient>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 110,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: { width: 45, height: 45, marginRight: 10 },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  welcomeSmall: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  nameText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "800",
  },

  menuButton: { padding: 6 },

  heroCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  heroSubtitle: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 16,
  },

  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  practiceCard: {
    width: "47.5%",
    borderRadius: 20,
    padding: 16,
    minHeight: 175,
  },

  cardMint: { backgroundColor: "#CFF3E6" },
  cardLavender: { backgroundColor: "#E5D3F3" },
  cardPeach: { backgroundColor: "#F8D8E0" },
  cardYellow: { backgroundColor: "#F7E9AE" },

  cardEmoji: { fontSize: 28, marginBottom: 12 },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 17,
    fontWeight: "600",
  },

  arrowWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 12,
  },

  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderTopWidth: 1,
    borderTopColor: "#e6d6df",
    paddingTop: 10,
    paddingBottom: 16,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontWeight: "600",
  },

  activeNavText: {
    fontSize: 11,
    color: "#32A67C",
    marginTop: 4,
    fontWeight: "700",
  },
});
