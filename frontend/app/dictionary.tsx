import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "../config";

interface Slang {
  _id: string;
  word: string;
  meaning: string;
  example: string;
  category?: string;
}

export default function DictionaryScreen() {
  const router = useRouter();
  const [slangs, setSlangs] = useState<Slang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlangs();
  }, []);

  const fetchSlangs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/slang`);
      if (res.ok) {
        const result = await res.json();
        if (result && result.data) {
          // Sort alphabetically
          const sorted = result.data.sort((a: Slang, b: Slang) => 
            a.word.localeCompare(b.word)
          );
          setSlangs(sorted);
        }
      }
    } catch (e) {
      console.log("Dictionary fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Slang }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.slangWord}>{item.word}</Text>
        {item.category && (
           <View style={styles.categoryBadge}>
             <Text style={styles.categoryText}>{item.category}</Text>
           </View>
        )}
      </View>
      <Text style={styles.meaningText}>{item.meaning}</Text>
      {item.example ? (
        <Text style={styles.exampleText}>"{item.example}"</Text>
      ) : null}
    </View>
  );

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
          <Text style={styles.title}>Dictionary</Text>
          <TouchableOpacity onPress={() => router.push("/search")} style={styles.searchBtn}>
            <Feather name="search" size={24} color="#222" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#B8A4E3" />
          </View>
        ) : slangs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No slangs found.</Text>
            <Text style={styles.emptySubtext}>Maybe it's time to contribute!</Text>
            <TouchableOpacity style={styles.contributeButton} onPress={() => router.push("/crowdsource")}>
              <Text style={styles.contributeButtonText}>Add a Slang</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={slangs}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
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
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  searchBtn: {
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  slangWord: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#EAF0FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3F6EDB",
  },
  meaningText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    backgroundColor: "#F9F9FB",
    padding: 10,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  contributeButton: {
    backgroundColor: "#B8A4E3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contributeButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
