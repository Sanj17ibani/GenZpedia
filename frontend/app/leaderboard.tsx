import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "../config";

interface LeaderboardUser {
  _id: string;
  name: string;
  xp: number;
  avatarIndex?: string;
  gender?: "male" | "female" | "prefer_not_to_say";
}

const DUMMY_USERS: LeaderboardUser[] = [
  { _id: "1", name: "Alexes", xp: 14500, gender: "female", avatarIndex: "2" },
  { _id: "2", name: "Rhyth", xp: 12400, gender: "male", avatarIndex: "1" },
  { _id: "3", name: "Sam", xp: 11200, gender: "prefer_not_to_say", avatarIndex: "0" },
  { _id: "4", name: "Charlie", xp: 9500, gender: "male", avatarIndex: "0" },
  { _id: "5", name: "Jordan", xp: 8200, gender: "female", avatarIndex: "1" },
  { _id: "6", name: "Taylor", xp: 7400, gender: "prefer_not_to_say", avatarIndex: "0" },
  { _id: "7", name: "Morgan", xp: 6800, gender: "male", avatarIndex: "2" },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/leaderboard`);
      if (res.ok) {
        const result = await res.json();
        if (result && result.data && result.data.length > 0) {
           setUsers(result.data);
           return;
        }
      }
    } catch (e) {
      console.log("Error fetching leaderboard:", e);
    } finally {
      // Fallback to dummy data if API fails or returns empty
      if (users.length === 0) {
        setUsers(DUMMY_USERS);
      }
      setLoading(false);
    }
  };

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  // Reusing the mascot as a generic avatar for now or fallback
  const fallbackAvatar = require("../assets/images/mascot.png");

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>Leaderboard</Text>
          <View style={{ width: 28 }} />
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#B8A4E3" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Top 3 Podium */}
            <View style={styles.podiumContainer}>
              {top3[1] && (
                <View style={[styles.podiumItem, styles.podiumSecond]}>
                  <Text style={styles.rankEmoji}>🥈</Text>
                  <Image source={fallbackAvatar} style={styles.avatarMediun} />
                  <Text style={styles.podiumName} numberOfLines={1}>{top3[1].name}</Text>
                  <Text style={styles.podiumXp}>{top3[1].xp} XP</Text>
                </View>
              )}

              {top3[0] && (
                <View style={[styles.podiumItem, styles.podiumFirst]}>
                  <Text style={styles.rankEmojiFirst}>👑</Text>
                  <Image source={fallbackAvatar} style={styles.avatarLarge} />
                  <Text style={styles.podiumName} numberOfLines={1}>{top3[0].name}</Text>
                  <Text style={styles.podiumXpFirst}>{top3[0].xp} XP</Text>
                </View>
              )}

              {top3[2] && (
                <View style={[styles.podiumItem, styles.podiumThird]}>
                  <Text style={styles.rankEmoji}>🥉</Text>
                  <Image source={fallbackAvatar} style={styles.avatarMediun} />
                  <Text style={styles.podiumName} numberOfLines={1}>{top3[2].name}</Text>
                  <Text style={styles.podiumXp}>{top3[2].xp} XP</Text>
                </View>
              )}
            </View>

            <View style={styles.listContainer}>
              {rest.map((user, index) => (
                <View key={user._id || index} style={styles.listItem}>
                  <Text style={styles.listRank}>{index + 4}</Text>
                  <Image source={fallbackAvatar} style={styles.listAvatar} />
                  <Text style={styles.listName}>{user.name}</Text>
                  <Text style={styles.listXp}>{user.xp} XP</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#222",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
    marginBottom: 40,
    height: 200,
  },
  podiumItem: {
    alignItems: "center",
    width: "30%",
  },
  podiumFirst: {
    marginBottom: 20,
    zIndex: 2,
    transform: [{ scale: 1.1 }],
  },
  podiumSecond: {
    marginRight: -10,
    zIndex: 1,
  },
  podiumThird: {
    marginLeft: -10,
    zIndex: 1,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFDF00",
    backgroundColor: "#fff",
  },
  avatarMediun: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#C0C0C0",
    backgroundColor: "#fff",
  },
  rankEmojiFirst: {
    fontSize: 30,
    marginBottom: -10,
    zIndex: 10,
  },
  rankEmoji: {
    fontSize: 24,
    marginBottom: -5,
    zIndex: 10,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginTop: 8,
    textAlign: "center",
  },
  podiumXpFirst: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D4AF37",
    marginTop: 2,
  },
  podiumXp: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginTop: 2,
  },
  listContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: 400,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  listRank: {
    fontSize: 16,
    fontWeight: "800",
    color: "#888",
    width: 30,
    textAlign: "center",
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 10,
  },
  listName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  listXp: {
    fontSize: 14,
    fontWeight: "800",
    color: "#B8A4E3",
  },
});
