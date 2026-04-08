import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const LEADERBOARD_DATA = [
  { id: 1, name: "CryptoKing", score: 15420, streak: 12, mascot: require("../assets/images/mascot.png") },
  { id: 2, name: "SlayQueen99", score: 14200, streak: 8, mascot: require("../assets/images/mascot.png") },
  { id: 3, name: "NoCapBro", score: 13500, streak: 15, mascot: require("../assets/images/mascot.png") },
  { id: 4, name: "ValidUser", score: 12100, streak: 5, mascot: require("../assets/images/mascot.png") },
  { id: 5, name: "VibeCheck", score: 11800, streak: 3, mascot: require("../assets/images/mascot.png") },
  { id: 6, name: "BetMate", score: 11500, streak: 1, mascot: require("../assets/images/mascot.png") },
  { id: 7, name: "TeaSpiller", score: 10900, streak: 7, mascot: require("../assets/images/mascot.png") },
  { id: 8, name: "GigaChad", score: 10200, streak: 0, mascot: require("../assets/images/mascot.png") },
  { id: 9, name: "DripLord", score: 9500, streak: 2, mascot: require("../assets/images/mascot.png") },
  { id: 10, name: "Ghosted", score: 9200, streak: 4, mascot: require("../assets/images/mascot.png") },
  { id: 11, name: "TouchGrass", score: 8800, streak: 1, mascot: require("../assets/images/mascot.png") },
  { id: 12, name: "BopMaster", score: 8100, streak: 0, mascot: require("../assets/images/mascot.png") },
  { id: 13, name: "GlowUp", score: 7500, streak: 9, mascot: require("../assets/images/mascot.png") },
  { id: 14, name: "BasicBot", score: 6200, streak: 2, mascot: require("../assets/images/mascot.png") },
  { id: 15, name: "NPC_01", score: 5000, streak: 0, mascot: require("../assets/images/mascot.png") },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const { name, gender, avatarIndex } = useLocalSearchParams();

  return (
    <LinearGradient colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard 🏆</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.subtitle}>Top Decoders this Week</Text>

          {/* LIST */}
          <View style={styles.listContainer}>
            {LEADERBOARD_DATA.map((user, index) => {
              const isTop3 = index < 3;
              let rankColor = "#666";
              if (index === 0) rankColor = "#FFD700"; // Gold
              if (index === 1) rankColor = "#C0C0C0"; // Silver
              if (index === 2) rankColor = "#CD7F32"; // Bronze

              return (
                <View key={user.id} style={[styles.card, isTop3 && styles.topCard]}>
                  
                  <View style={styles.rankBadge}>
                    <Text style={[styles.rankText, { color: rankColor, fontSize: isTop3 ? 18 : 14 }]}>
                      #{index + 1}
                    </Text>
                  </View>

                  <View style={styles.avatarWrap}>
                    <Image source={user.mascot} style={styles.avatarImage} resizeMode="contain" />
                  </View>

                  <View style={styles.infoWrap}>
                    <Text style={[styles.nameText, isTop3 && { fontSize: 16 }]}>{user.name}</Text>
                    <Text style={styles.streakText}>🔥 {user.streak} streak</Text>
                  </View>

                  <View style={styles.scoreWrap}>
                    <Text style={styles.scoreText}>{user.score} XP</Text>
                  </View>
                  
                </View>
              );
            })}
          </View>
          
        </ScrollView>

        {/* BOTTOM NAV */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push({ pathname: "/home", params: { name, gender, avatarIndex } })}
          >
            <Ionicons name="home-outline" size={22} color="#999" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push({ pathname: "/lesson", params: { name, gender, avatarIndex } })}
          >
            <MaterialCommunityIcons name="book-open-page-variant-outline" size={22} color="#999" />
            <Text style={styles.navText}>Dictionary</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="trophy" size={22} color="#F1B66C" />
            <Text style={styles.activeNavText}>Leaderboard</Text>
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
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#222" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  subtitle: { fontSize: 16, color: "#666", fontWeight: "600", marginBottom: 16, textAlign: "center" },
  listContainer: { gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topCard: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FBE39A",
    borderWidth: 1,
  },
  rankBadge: { width: 35, alignItems: "center" },
  rankText: { fontWeight: "900" },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0EAF6",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  avatarImage: { width: 30, height: 30 },
  infoWrap: { flex: 1 },
  nameText: { fontSize: 14, fontWeight: "800", color: "#222", marginBottom: 2 },
  streakText: { fontSize: 11, color: "#888", fontWeight: "600" },
  scoreWrap: { alignItems: "flex-end" },
  scoreText: { fontSize: 14, fontWeight: "900", color: "#38B27C" },
  
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    paddingTop: 10,
    paddingBottom: 25,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 11, color: "#999", marginTop: 4, fontWeight: "600" },
  activeNavText: { fontSize: 11, color: "#F1B66C", marginTop: 4, fontWeight: "700" },
});