import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProgress } from "./progressContext";
import QuickSearchModal from "./QuickSearchModal";
import { avatarMap } from "./avatarData";

const DAILY_GOAL_PROGRESS = 72;

export default function HomeScreen() {
  const { name, gender, avatarIndex } = useLocalSearchParams();
  const router = useRouter();
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { xp, profile, logout } = useProgress();

  const paramName = typeof name === "string" ? name : "";
  const fallbackGender =
    gender === "female" || gender === "male" || gender === "prefer_not_to_say"
      ? gender
      : profile.gender;
  const safeGender = profile.gender || fallbackGender || "prefer_not_to_say";

  const fallbackAvatarIndex = Number(avatarIndex) || 0;
  const safeAvatarIndex = typeof profile.avatarIndex === "number" ? profile.avatarIndex : fallbackAvatarIndex;

  const selectedProfileImage =
    avatarMap[safeGender][safeAvatarIndex] || avatarMap.prefer_not_to_say[0];

  const profileName = profile.name?.trim() || paramName || "User";
  const emailText = profile.email?.trim() || "No email available";
  const displayName = profileName.toUpperCase();
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpPercent = xp % 100;

  const handleLogout = () => {
    logout();
    setShowSidebar(false);
    router.replace("/");
  };

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
          <View style={styles.topStats}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statText}>5 Streak</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>📘</Text>
              <Text style={styles.statText}>87 Decoded</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={styles.statText}>6 Contributed</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statText}>#4</Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.profileRow}>
              <Image source={selectedProfileImage} style={styles.profileImage} />

              <View style={styles.levelBox}>
                <Text style={styles.levelText}>Level {currentLevel}</Text>
                <View style={styles.xpBarBg}>
                  <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
                </View>
                <Text style={styles.xpText}>{xp} XP</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuButton} onPress={() => setShowSidebar(true)}>
              <Feather name="menu" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>{`WELCOME BACK ${displayName}!`}</Text>

          <TouchableOpacity
            style={styles.goalCard}
            activeOpacity={0.9}
            onPress={() => router.push("/daily-goal")}
          >
            <Text style={styles.goalTitle}>Daily Goal</Text>

            <View style={styles.goalProgressWrapper}>
              <View style={styles.goalProgressBg}>
                <View style={[styles.goalProgressFill, { width: `${DAILY_GOAL_PROGRESS}%` }]} />
              </View>
              <Text style={styles.goalPercent}>{DAILY_GOAL_PROGRESS}% complete</Text>
            </View>

            <Text style={styles.giftEmoji}>🎁</Text>
          </TouchableOpacity>

          <View style={styles.cardGrid}>
            <TouchableOpacity
              style={[styles.featureCard, styles.greenCard]}
              onPress={() =>
                router.push({
                  pathname: "/lesson",
                  params: {
                    name: String(name || "User"),
                    gender: String(safeGender),
                    avatarIndex: String(safeAvatarIndex),
                  },
                })
              }
            >
              <Image
                source={require("../assets/images/lesson.png")}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>LESSONS</Text>
              <View style={styles.cardLine} />
              <View style={styles.cardBottomRow}>
                <Text style={styles.cardSubtitle}>Continue Learning</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={20}
                  color="#333"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, styles.purpleCard]}
              onPress={() => router.push("/quiz")}
            >
              <Image
                source={require("../assets/images/quiz.png")}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>QUIZ</Text>
              <View style={styles.cardLine} />
              <View style={styles.cardBottomRow}>
                <Text style={styles.cardSubtitle}>Test Your Knowledge</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={20}
                  color="#333"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, styles.pinkCard]}
              onPress={() => router.push("/trending")}
            >
              <Image
                source={require("../assets/images/trending.png")}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>TRENDING</Text>
              <View style={styles.cardLine} />
              <View style={styles.cardBottomRow}>
                <Text style={styles.cardSubtitle}>Popular Now!</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={20}
                  color="#333"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, styles.yellowCard]}
              onPress={() =>
                router.push({
                  pathname: "/practice",
                  params: {
                    name: String(name || "User"),
                    gender: String(safeGender),
                    avatarIndex: String(safeAvatarIndex),
                  },
                })
              }
            >
              <Image
                source={require("../assets/images/practice.png")}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>PRACTICE</Text>
              <View style={styles.cardLine} />
              <View style={styles.cardBottomRow}>
                <Text style={styles.cardSubtitle}>Quick Drills!</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={20}
                  color="#333"
                />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.contributeBanner}
            onPress={() => router.push("/crowdsource")}
          >
            <View style={styles.contributeBannerLeft}>
              <Text style={styles.contributeBannerTitle}>Got a new slang?</Text>
              <Text style={styles.contributeBannerSub}>Help the community grow!</Text>
            </View>
            <View style={styles.contributeBannerBtn}>
              <Text style={styles.contributeBannerBtnText}>Contribute</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.continueCard}>
            <Image
              source={require("../assets/images/continue.png")}
              style={styles.continueImage}
            />

            <View style={styles.continueInfo}>
              <Text style={styles.lessonSmall}>Lesson 3</Text>
              <Text style={styles.lessonTitle}>Slang Basics</Text>

              <View style={styles.continueProgressRow}>
                <View style={styles.continueProgressBg}>
                  <View style={styles.continueProgressFill} />
                </View>
                <Text style={styles.continuePercent}>45%</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home-outline" size={22} color="#32A67C" />
            <Text style={styles.activeNavText}>Home</Text>
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
        </View>
        <QuickSearchModal visible={showQuickSearch} onClose={() => setShowQuickSearch(false)} />

        <Modal
          visible={showSidebar}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSidebar(false)}
        >
          <View style={styles.sidebarOverlay}>
            <Pressable style={styles.sidebarBackdrop} onPress={() => setShowSidebar(false)} />
            <View style={styles.sidebarPanel}>
              <View style={styles.sidebarTopRow}>
                <Text style={styles.sidebarTitle}>Your Profile</Text>
                <TouchableOpacity onPress={() => setShowSidebar(false)}>
                  <Ionicons name="close" size={24} color="#222" />
                </TouchableOpacity>
              </View>

              <Image source={selectedProfileImage} style={styles.sidebarAvatar} />
              <Text style={styles.sidebarName}>{profileName}</Text>
              <Text style={styles.sidebarEmail}>{emailText}</Text>

              <TouchableOpacity
                style={styles.sidebarAction}
                onPress={() => {
                  setShowSidebar(false);
                  router.push("/settings");
                }}
              >
                <Ionicons name="settings-outline" size={20} color="#333" />
                <Text style={styles.sidebarActionText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarAction}
                onPress={() => Alert.alert("Language", "English is currently selected.")}
              >
                <Ionicons name="language-outline" size={20} color="#333" />
                <Text style={styles.sidebarActionText}>Language</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sidebarAction, styles.logoutAction]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#B94B67" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 100,
  },

  topStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    alignItems: "center",
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statEmoji: {
    fontSize: 12,
  },

  statText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  levelBox: {
    flex: 1,
  },

  levelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#222",
    marginBottom: 3,
  },

  xpBarBg: {
    width: 90,
    height: 6,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 3,
  },

  xpBarFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#4FA3FF",
    borderRadius: 10,
  },

  xpText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
  },

  menuButton: {
    padding: 6,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    marginBottom: 22,
    lineHeight: 34,
  },

  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },

  goalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#222",
    marginRight: 12,
  },

  goalProgressWrapper: {
    flex: 1,
    justifyContent: "center",
  },

  goalProgressBg: {
    height: 4,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },

  goalProgressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#20B29A",
  },

  goalPercent: {
    fontSize: 10,
    color: "#777",
    textAlign: "right",
  },

  giftEmoji: {
    fontSize: 28,
    marginLeft: 10,
  },

  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginBottom: 26,
  },

  featureCard: {
    width: "47.5%",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  greenCard: {
    backgroundColor: "#CFF3E6",
  },

  purpleCard: {
    backgroundColor: "#E5D3F3",
  },

  pinkCard: {
    backgroundColor: "#F8D8E0",
  },

  yellowCard: {
    backgroundColor: "#F7E9AE",
  },

  cardImage: {
    width: 28,
    height: 28,
    marginBottom: 8,
    resizeMode: "contain",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  cardLine: {
    height: 2,
    backgroundColor: "#b8b8b8",
    width: "70%",
    marginBottom: 10,
    borderRadius: 10,
  },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardSubtitle: {
    fontSize: 10,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },

  contributeBanner: {
    backgroundColor: "#7EC4CF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  contributeBannerLeft: {
    flex: 1,
    marginRight: 10,
  },

  contributeBannerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0B4A53",
    marginBottom: 4,
  },

  contributeBannerSub: {
    fontSize: 12,
    color: "#187888",
    fontWeight: "600",
  },

  contributeBannerBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  contributeBannerBtnText: {
    color: "#0B4A53",
    fontWeight: "800",
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  seeAllText: {
    fontSize: 14,
    color: "#3F6EDB",
    fontWeight: "700",
  },

  continueCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  continueImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
    marginRight: 12,
    resizeMode: "contain",
  },

  continueInfo: {
    flex: 1,
  },

  lessonSmall: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },

  lessonTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 6,
  },

  continueProgressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  continueProgressBg: {
    flex: 1,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8,
  },

  continueProgressFill: {
    width: "45%",
    height: "100%",
    backgroundColor: "#F39C34",
  },

  continuePercent: {
    fontSize: 11,
    color: "#777",
    width: 30,
  },

  continueButton: {
    backgroundColor: "#79D2B0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  continueButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#154D3B",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.7)",
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

  sidebarOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(17,17,17,0.18)",
  },

  sidebarBackdrop: {
    flex: 1,
  },

  sidebarPanel: {
    width: "78%",
    backgroundColor: "#FFF9FC",
    paddingTop: 56,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 10,
  },

  sidebarTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  sidebarTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#171717",
  },

  sidebarAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginBottom: 14,
  },

  sidebarName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#161616",
    marginBottom: 4,
  },

  sidebarEmail: {
    fontSize: 13,
    color: "#6A6A6A",
    fontWeight: "600",
    marginBottom: 26,
  },

  sidebarAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F1FB",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  sidebarActionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
  },

  logoutAction: {
    marginTop: 10,
    backgroundColor: "#FCE9EE",
  },

  logoutText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "900",
    color: "#B94B67",
  },
});
