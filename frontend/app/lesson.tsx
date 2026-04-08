import React from "react";
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

const lessonCards = [
  {
    title: "Slang 101",
    subtitle: "Learn the most common Gen-Z terms and their meanings.",
    progress: 75,
    bg: "#CFE9DE",
    icon: "📚",
    bar: "#4FB08B",
    route: "/slang101",
  },
  {
    title: "Tone & Context",
    subtitle: "Understand the emotional intent behind digital language.",
    progress: 40,
    bg: "#E7D7EE",
    icon: "💬",
    bar: "#B07AE3",
    route: "/tonecontext",
  },
  {
    title: "Spotting Red Flags",
    subtitle: "Identify cyberbullying, distress signals, and coded language.",
    progress: 20,
    bg: "#F6D7DD",
    icon: "🚩",
    bar: "#F06A7F",
    route: "/reflags",
  },
  {
    title: "Emoji Decoder",
    subtitle: "What do emojis really mean in different contexts?",
    progress: 50,
    bg: "#F6E7B8",
    icon: "🤔",
    bar: "#F1B66C",
    route: "/emoji-decoder",
  },
];

export default function LessonsScreen() {
  const router = useRouter();
  const { name, gender, avatarIndex } = useLocalSearchParams();

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
          <View style={styles.statsRow}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.smallLogo}
              resizeMode="contain"
            />

            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statText}>5 Streak</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>📖</Text>
              <Text style={styles.statText}>87 Decoded</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={styles.statText}>6 Contributed</Text>
            </View>

            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#4</Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <View style={styles.profileLevelWrap}>
              <Image source={selectedProfileImage} style={styles.profileImage} />

              <View style={styles.levelInfo}>
                <Text style={styles.welcomeSmall}>Welcome back</Text>
                <Text style={styles.nameText}>{displayName}</Text>

                <View style={styles.levelPill}>
                  <Text style={styles.levelText}>Level 10</Text>
                  <View style={styles.xpBarBg}>
                    <View style={styles.xpBarFill} />
                  </View>
                  <Text style={styles.xpText}>2,450 XP</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.menuButton}>
              <Feather name="menu" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pageTitle}>LESSONS</Text>

          <View style={styles.cardsWrap}>
            {lessonCards.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={[styles.lessonCard, { backgroundColor: item.bg }]}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  }
                }}
              >
                <View style={styles.lessonIconWrap}>
                  <Text style={styles.lessonIcon}>{item.icon}</Text>
                </View>

                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle}>{item.title}</Text>
                  <Text style={styles.lessonSubtitle}>{item.subtitle}</Text>

                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${item.progress}%`,
                            backgroundColor: item.bar,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{item.progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.continueHeader}>
            <Text style={styles.continueTitle}>Continue Learning</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.continueCard}
            onPress={() => router.push("/slang101")}
          >
            <View style={styles.continueLeft}>
              <View style={styles.continueImageBox}>
                <Text style={styles.continueImageEmoji}>📝</Text>
              </View>

              <View style={styles.continueTextWrap}>
                <Text style={styles.lessonNumber}>Lesson 1</Text>
                <Text style={styles.continueCardTitle}>Slang 101</Text>

                <View style={styles.continueProgressRow}>
                  <View style={styles.continueTrack}>
                    <View style={styles.continueFill} />
                  </View>
                  <Text style={styles.continuePercent}>45%</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push("/slang101")}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>

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

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={22}
              color="#32A67C"
            />
            <Text style={styles.activeNavText}>Dictionary</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="trophy-outline" size={22} color="#999" />
            <Text style={styles.navText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Feather name="search" size={22} color="#999" />
            <Text style={styles.navText}>Search</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 12,
    paddingBottom: 110,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  smallLogo: {
    width: 34,
    height: 34,
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
    color: "#6D6D6D",
    fontWeight: "700",
  },

  rankBadge: {
    backgroundColor: "#E9D8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  rankText: {
    fontSize: 11,
    color: "#9C63B8",
    fontWeight: "800",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  profileLevelWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },

  levelInfo: {
    flex: 1,
  },

  welcomeSmall: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },

  nameText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "800",
    marginBottom: 6,
  },

  levelPill: {
    flexDirection: "row",
    alignItems: "center",
  },

  levelText: {
    fontSize: 10,
    color: "#2E805F",
    fontWeight: "800",
    marginRight: 6,
  },

  xpBarBg: {
    width: 52,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#DCEADF",
    overflow: "hidden",
    marginRight: 6,
  },

  xpBarFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#38B27C",
    borderRadius: 4,
  },

  xpText: {
    fontSize: 10,
    color: "#4B4B4B",
    fontWeight: "700",
  },

  menuButton: {
    padding: 6,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    marginBottom: 18,
    letterSpacing: 0.4,
  },

  cardsWrap: {
    marginBottom: 18,
  },

  lessonCard: {
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  lessonIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  lessonIcon: {
    fontSize: 28,
  },

  lessonContent: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: 18,
    color: "#111",
    fontWeight: "900",
    marginBottom: 4,
  },

  lessonSubtitle: {
    fontSize: 12,
    color: "#666",
    lineHeight: 17,
    fontWeight: "600",
    marginBottom: 10,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 10,
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  progressText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "800",
    width: 34,
    textAlign: "right",
  },

  continueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  continueTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#3D69C8",
  },

  continueCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  continueLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  continueImageBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F4F1FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  continueImageEmoji: {
    fontSize: 30,
  },

  continueTextWrap: {
    flex: 1,
  },

  lessonNumber: {
    fontSize: 12,
    color: "#777",
    fontWeight: "700",
    marginBottom: 2,
  },

  continueCardTitle: {
    fontSize: 18,
    color: "#111",
    fontWeight: "900",
    marginBottom: 8,
  },

  continueProgressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  continueTrack: {
    flex: 1,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#E6E6E6",
    overflow: "hidden",
    marginRight: 8,
  },

  continueFill: {
    width: "45%",
    height: "100%",
    backgroundColor: "#F49D4D",
    borderRadius: 5,
  },

  continuePercent: {
    fontSize: 12,
    color: "#666",
    fontWeight: "800",
  },

  continueButton: {
    backgroundColor: "#5AAE94",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },

  continueButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
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