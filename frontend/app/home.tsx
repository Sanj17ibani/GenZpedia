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
} as const;

export default function HomeScreen() {
  const { name, gender, avatarIndex } = useLocalSearchParams();
  const router = useRouter();

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
                <Text style={styles.levelText}>Level 10</Text>
                <View style={styles.xpBarBg}>
                  <View style={styles.xpBarFill} />
                </View>
                <Text style={styles.xpText}>2,450 XP</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuButton}>
              <Feather name="menu" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>{`WELCOME BACK ${displayName}!`}</Text>

          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Daily Goal</Text>

            <View style={styles.goalProgressWrapper}>
              <View style={styles.goalProgressBg}>
                <View style={styles.goalProgressFill} />
              </View>
              <Text style={styles.goalPercent}>70% complete</Text>
            </View>

            <Text style={styles.giftEmoji}>🎁</Text>
          </View>

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
            style={styles.contributeCard} 
            activeOpacity={0.8}
            onPress={() => router.push("/crowdsource")}
          >
            <View style={styles.contributeLeft}>
              <Text style={styles.contributeIcon}>🔥</Text>
              <View>
                <Text style={styles.contributeTitle}>Contribute</Text>
                <Text style={styles.contributeSubtitle}>Drop a new slang!</Text>
              </View>
            </View>
            <Ionicons name="add-circle" size={32} color="#3F6EDB" />
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

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/leaderboard")}>
            <Ionicons name="trophy-outline" size={22} color="#999" />
            <Text style={styles.navText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/search")}>
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

  contributeCard: {
    backgroundColor: "#EAF0FE",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  contributeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contributeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contributeTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#222",
  },
  contributeSubtitle: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
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
});