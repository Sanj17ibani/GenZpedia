import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GOAL_PROGRESS = 72;
const EXERCISES = [
  { name: "Quiz", status: "complete" },
  { name: "Guess It", status: "complete" },
  { name: "Slang It In", status: "complete" },
  { name: "Match the Vibe", status: "in-progress" },
  { name: "Vibe Check", status: "locked" },
] as const;

export default function DailyGoalScreen() {
  const router = useRouter();

  const completedSteps = EXERCISES.filter((exercise) => exercise.status === "complete").length;
  const isUnlocked = GOAL_PROGRESS >= 100;

  return (
    <LinearGradient
      colors={["#DDF7EA", "#F7F1D8", "#FCE8E1"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#222" />
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrow}>Daily Progress</Text>
              <Text style={styles.title}>Unlock today&apos;s gift box</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <Text style={styles.heroLabel}>Goal Meter</Text>
              <Text style={styles.heroPercent}>{GOAL_PROGRESS}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${GOAL_PROGRESS}%` }]} />
            </View>

            <Text style={styles.heroSubtext}>
              Complete all 5 learning activities to reach 100%.
            </Text>

            <View style={[styles.giftBox, isUnlocked ? styles.giftBoxOpen : styles.giftBoxLocked]}>
              <Text style={styles.giftEmoji}>{isUnlocked ? "🎉" : "🎁"}</Text>
              <Text style={styles.giftTitle}>
                {isUnlocked ? "Gift unlocked" : "Gift locked"}
              </Text>
              <Text style={styles.giftSubtext}>
                {isUnlocked
                  ? "You crushed today's goal. Your reward box is open."
                  : `${100 - GOAL_PROGRESS}% more to unlock the reward.`}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{completedSteps}/5</Text>
              <Text style={styles.statLabel}>Exercises cleared</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>Gift Box</Text>
              <Text style={styles.statLabel}>Reward still locked</Text>
            </View>
          </View>

          <View style={styles.listCard}>
            <Text style={styles.listTitle}>Progress Path</Text>
            {EXERCISES.map((exercise) => {
              const completed = exercise.status === "complete";
              const active = exercise.status === "in-progress";

              return (
                <View key={exercise.name} style={styles.listItem}>
                  <View
                    style={[
                      styles.statusDot,
                      completed && styles.statusDotActive,
                      active && styles.statusDotCurrent,
                    ]}
                  >
                    <Ionicons
                      name={completed ? "checkmark" : active ? "time-outline" : "lock-closed"}
                      size={14}
                      color={completed || active ? "#fff" : "#806A00"}
                    />
                  </View>

                  <View style={styles.listTextWrap}>
                    <Text style={styles.listItemTitle}>{exercise.name}</Text>
                    <Text style={styles.listItemSubtext}>
                      {completed
                        ? "Completed for today's goal."
                        : active
                          ? "This challenge is currently in progress."
                          : "Waiting to be cleared."}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
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
    padding: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.82)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#171717",
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  heroLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
  },
  heroPercent: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0E8F73",
  },
  progressTrack: {
    height: 14,
    backgroundColor: "#E8E1D6",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#19B28A",
  },
  heroSubtext: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: "#575757",
    fontWeight: "600",
  },
  giftBox: {
    marginTop: 22,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  giftBoxLocked: {
    backgroundColor: "#FFF2CC",
  },
  giftBoxOpen: {
    backgroundColor: "#DDF7EA",
  },
  giftEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  giftTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1B1B1B",
    marginBottom: 6,
  },
  giftSubtext: {
    fontSize: 14,
    lineHeight: 21,
    color: "#5B5241",
    textAlign: "center",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 22,
    padding: 18,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#171717",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },
  listCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 28,
    padding: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#171717",
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  statusDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5D979",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusDotActive: {
    backgroundColor: "#19B28A",
  },
  statusDotCurrent: {
    backgroundColor: "#F39C34",
  },
  listTextWrap: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E1E1E",
  },
  listItemSubtext: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginTop: 2,
  },
});
