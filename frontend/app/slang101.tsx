import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchAllSlangs } from "./services/api";

type SlangItem = {
  _id: string;
  word: string;
  meaning: string;
  example?: string[];
  tone?: string;
  emotionalContext?: string;
};

export default function Slang101Screen() {
  const router = useRouter();
  const [slangs, setSlangs] = useState<SlangItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSlangs = async () => {
    try {
      const data = await fetchAllSlangs();
      setSlangs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load slang 101 data:", error);
      setSlangs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlangs();
  }, []);

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Slang 101</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color="#4FB08B" />
            <Text style={styles.loadingText}>Loading lesson...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Learn Common Gen-Z Slang</Text>
              <Text style={styles.heroSubtitle}>
                Explore popular slang terms, meanings, and examples in a lesson-style format.
              </Text>
            </View>

            {slangs.map((item, index) => (
              <View key={item._id || index.toString()} style={styles.slangCard}>
                <View style={styles.topRow}>
                  <Text style={styles.word}>{item.word}</Text>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                </View>

                <Text style={styles.meaning}>{item.meaning}</Text>

                {item.example && item.example.length > 0 && (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>Example</Text>
                    <Text style={styles.exampleText}>{item.example[0]}</Text>
                  </View>
                )}

                <View style={styles.tagRow}>
                  {item.tone ? (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{item.tone}</Text>
                    </View>
                  ) : null}

                  {item.emotionalContext ? (
                    <View style={[styles.tag, styles.altTag]}>
                      <Text style={[styles.tagText, styles.altTagText]}>
                        {item.emotionalContext}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
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
    marginBottom: 10,
  },

  backBtn: { padding: 4 },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontWeight: "600",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  heroCard: {
    backgroundColor: "#CFE4DC",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555",
    fontWeight: "600",
  },

  slangCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  word: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },

  numberBadge: {
    backgroundColor: "#E7F4F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  numberText: {
    color: "#20B29A",
    fontWeight: "800",
    fontSize: 12,
  },

  meaning: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    fontWeight: "500",
    marginBottom: 12,
  },

  exampleBox: {
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  exampleLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#888",
    marginBottom: 4,
  },

  exampleText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    backgroundColor: "#E7F4F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#20B29A",
  },

  altTag: {
    backgroundColor: "#F3E5F5",
  },

  altTagText: {
    color: "#9C27B0",
  },
});