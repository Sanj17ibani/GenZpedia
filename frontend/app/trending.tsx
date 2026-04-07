import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "../config";


interface Slang {
  _id: string;
  word: string;
  meaning: string;
  example: string[];
}

export default function TrendingScreen() {
  const router = useRouter();
  const [slangs, setSlangs] = useState<Slang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingSlangs();
  }, []);

  const fetchTrendingSlangs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/slang`);
      const result = await res.json();
      if (result && result.data) {
        setSlangs(result.data.slice(0, 10)); // Top 10 for trending
      }
    } catch (error) {
      console.error("Error fetching slangs:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: Slang; index: number }) => {
    const isTop3 = index < 3;
    return (
      <View style={styles.card}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rankText, isTop3 && styles.topRankText]}>
            #{index + 1}
          </Text>
          {index === 0 && <Text style={styles.fireEmoji}>🔥</Text>}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.word}>{item.word}</Text>
          <Text style={styles.meaning} numberOfLines={2}>
            {item.meaning}
          </Text>
          {item.example && item.example.length > 0 && (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleText}>"{item.example[0]}"</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#FFEAF2", "#F0EAF6", "#E3F3EE"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>TRENDING NOW</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#F06A7F" />
          </View>
        ) : (
          <FlatList
            data={slangs}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    letterSpacing: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  rankContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    width: 40,
  },
  rankText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#888",
  },
  topRankText: {
    color: "#F06A7F",
    fontSize: 26,
  },
  fireEmoji: {
    fontSize: 20,
    marginTop: -4,
  },
  contentContainer: {
    flex: 1,
  },
  word: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  meaning: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 8,
  },
  exampleBox: {
    backgroundColor: "#F4F1FB",
    padding: 10,
    borderRadius: 12,
  },
  exampleText: {
    fontSize: 13,
    color: "#6D5380",
    fontStyle: "italic",
    fontWeight: "600",
  },
});
