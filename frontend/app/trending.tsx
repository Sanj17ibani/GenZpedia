import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

// 🔥 YOUR BACKEND URL
const BASE_URL ="https://unsaddened-stylishly-maeve.ngrok-free.dev";
console.log("🔥 THIS IS MY NEW TRENDING PAGE");
type SlangItem = {
  _id: string;
  word: string;
  meaning: string;
  origin?: string;
  tone?: string;
  emotionalContext?: string;
  example?: string[];
};

export default function TrendingScreen() {
  const router = useRouter();

  const [slangs, setSlangs] = useState<SlangItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSlangs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/slang`);

      console.log("TRENDING RESPONSE:", response.data);

      if (response.data?.data && Array.isArray(response.data.data)) {
        setSlangs(response.data.data);
      } else {
        setSlangs([]);
      }
    } catch (error) {
      console.error("Error fetching slangs:", error);
      setSlangs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSlangs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSlangs();
  };

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Trending 🔥</Text>

          <TouchableOpacity
            onPress={() => router.push("/crowdsource")}
            style={styles.addBtn}
          >
            <Feather name="plus-circle" size={22} color="#F06A7F" />
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#F06A7F" />
            <Text style={styles.loadingText}>Loading slangs...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* EMPTY STATE */}
            {slangs.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyEmoji}>😔</Text>
                <Text style={styles.emptyText}>No trendy slangs found.</Text>
              </View>
            ) : (
              slangs.map((item, idx) => (
                <View key={item._id || idx.toString()} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.wordWrap}>
                      <Text style={styles.wordText}>{item.word}</Text>

                      {idx < 3 && (
                        <View style={styles.rankBadge}>
                          <Text style={styles.rankText}>#{idx + 1}</Text>
                        </View>
                      )}
                    </View>

                    <TouchableOpacity style={styles.heartBtn}>
                      <Ionicons
                        name="heart-outline"
                        size={22}
                        color="#F06A7F"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.meaningText}>{item.meaning}</Text>

                  {item.example && item.example.length > 0 && (
                    <View style={styles.exampleBox}>
                      <Text style={styles.exampleTitle}>Example:</Text>
                      <Text style={styles.exampleText}>
                        "{item.example[0]}"
                      </Text>
                    </View>
                  )}

                  <View style={styles.tagsRow}>
                    {item.tone && (
                      <View style={styles.tagPill}>
                        <Text style={styles.tagText}>{item.tone}</Text>
                      </View>
                    )}

                    {item.emotionalContext && (
                      <View style={[styles.tagPill, styles.tagPillAlt]}>
                        <Text style={[styles.tagText, styles.tagTextAlt]}>
                          {item.emotionalContext}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
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
    marginBottom: 16,
  },

  backBtn: { padding: 4 },

  addBtn: {
    padding: 4,
    backgroundColor: "#FFEAF0",
    borderRadius: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  wordWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  wordText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#222",
  },

  rankBadge: {
    marginLeft: 10,
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  rankText: {
    color: "#EA580C",
    fontSize: 10,
    fontWeight: "800",
  },

  heartBtn: {
    padding: 6,
  },

  meaningText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 12,
  },

  exampleBox: {
    backgroundColor: "#F5F6FA",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#A8A4CE",
    marginBottom: 14,
  },

  exampleTitle: {
    fontSize: 12,
    color: "#888",
    fontWeight: "700",
    marginBottom: 4,
  },

  exampleText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tagPill: {
    backgroundColor: "#E7F4F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    color: "#20B29A",
    fontSize: 11,
    fontWeight: "700",
  },

  tagPillAlt: {
    backgroundColor: "#F3E5F5",
  },

  tagTextAlt: {
    color: "#9C27B0",
  },
});