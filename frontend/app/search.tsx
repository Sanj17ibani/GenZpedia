import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
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

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [slangs, setSlangs] = useState<Slang[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all slangs initially to allow local filtering
    // In a real large app, you might debounce and search server-side instead
    const fetchAllSlangs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/slang`);
        if (res.ok) {
          const result = await res.json();
          if (result && result.data) {
            setSlangs(result.data);
          }
        }
      } catch (e) {
        console.log("Search fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSlangs();
  }, []);

  const filteredSlangs = slangs.filter((slang) => {
    return (
      slang.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slang.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
          <View style={styles.searchBarContainer}>
            <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search slangs, meanings..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#B8A4E3" />
          </View>
        ) : searchQuery.length > 0 && filteredSlangs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🧐</Text>
            <Text style={styles.emptyText}>No results found.</Text>
            <Text style={styles.emptySubtext}>We couldn't find anything for "{searchQuery}".</Text>
          </View>
        ) : (
          <FlatList
            data={searchQuery.length > 0 ? filteredSlangs : []}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                searchQuery.length === 0 ? (
                    <View style={styles.suggestionContainer}>
                        <Text style={styles.suggestionTitle}>Suggested Searches</Text>
                        <View style={styles.suggestionTags}>
                            {["GOAT", "Rizz", "Cap", "Slay", "Bet"].map(tag => (
                                <TouchableOpacity 
                                    key={tag} 
                                    style={styles.tagBtn}
                                    onPress={() => setSearchQuery(tag)}
                                >
                                    <Text style={styles.tagText}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : null
            }
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
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
    marginRight: 10,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    height: "100%",
  },
  clearBtn: {
    padding: 4,
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#B8A4E3",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  slangWord: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  categoryBadge: {
    backgroundColor: "#EAF0FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3F6EDB",
  },
  meaningText: {
    fontSize: 14,
    color: "#444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: -100, // Move it up slightly
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  suggestionContainer: {
    marginTop: 20,
  },
  suggestionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#555",
      marginBottom: 15,
  },
  suggestionTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
  },
  tagBtn: {
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
  },
  tagText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#222",
  }
});
