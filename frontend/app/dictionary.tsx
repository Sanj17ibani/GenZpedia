import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QuickSearchModal from "./QuickSearchModal";

// Import the local static copy of the 34 words
import DICTIONARY_DATA from "./dictionaryData.json";

export default function DictionaryScreen() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  const ALPHABETS = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  const filteredData = DICTIONARY_DATA.filter((item: any) => {
    if (!item.word) return false;
    
    const matchesLetter =
      !selectedLetter || selectedLetter === "ALL"
        ? true
        : item.word.toUpperCase().startsWith(selectedLetter);
        
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : item.word.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLetter && matchesSearch;
  });

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>GenZpedia Dictionary</Text>
          <Text style={styles.headerSubtitle}>
            Helping You Keep Up, Bestie!
          </Text>

          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search slangs..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length > 0 && selectedLetter !== "ALL") {
                  setSelectedLetter("ALL");
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.alphabetContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alphabetContent}>
            {ALPHABETS.map((letter, index) => {
              const isActive = selectedLetter === letter || (selectedLetter === null && letter === "ALL");
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.letterButton, isActive && styles.letterButtonActive]}
                  onPress={() => setSelectedLetter(letter === "ALL" ? null : letter)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.letterText, isActive && styles.letterTextActive]}>
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No slangs found {searchQuery ? `for '${searchQuery}'` : `starting with '${selectedLetter}'`}
              </Text>
            </View>
          ) : (
            filteredData.map((item: any, index: number) => (
              <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.wordTitle}>{item.word}</Text>
                <Text style={styles.toneBadge}>{item.tone}</Text>
              </View>

              <Text style={styles.meaningText}>
                <Text style={styles.label}>Meaning: </Text>
                {item.meaning}
              </Text>

              {item.origin ? (
                <Text style={styles.attrText}>
                  <Text style={styles.label}>Origin: </Text>
                  {item.origin}
                </Text>
              ) : null}

              {item.emotionalContext ? (
                <Text style={styles.attrText}>
                  <Text style={styles.label}>Context: </Text>
                  {item.emotionalContext}
                </Text>
              ) : null}

              {item.example && item.example.length > 0 ? (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Example Usage</Text>
                  {item.example.map((ex: string, i: number) => (
                    <Text key={i} style={styles.exampleText}>
                      "{ex.trim()}"
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          )))}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
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

          <TouchableOpacity style={styles.navItem} onPress={() => setShowQuickSearch(true)}>
            <Feather name="search" size={22} color="#999" />
            <Text style={styles.navText}>Search</Text>
          </TouchableOpacity>
        </View>
        <QuickSearchModal visible={showQuickSearch} onClose={() => setShowQuickSearch(false)} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#222",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "600",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E5D3F3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
    fontWeight: "600",
  },

  alphabetContainer: {
    marginBottom: 10,
  },
  alphabetContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  letterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5D3F3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  letterButtonActive: {
    backgroundColor: "#B8A4E3",
    borderColor: "#B8A4E3",
  },
  letterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },
  letterTextActive: {
    color: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E5D3F3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  wordTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#B8A4E3",
    flex: 1,
  },
  toneBadge: {
    backgroundColor: "#F0EAF6",
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 4,
    maxWidth: "50%",
    textAlign: "right",
  },

  label: {
    fontWeight: "800",
    color: "#444",
  },
  meaningText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
  attrText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    lineHeight: 18,
  },

  exampleBox: {
    marginTop: 10,
    backgroundColor: "#F9F6FC",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#BFF3CD",
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#32A67C",
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    marginBottom: 2,
  },

  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
    textAlign: "center",
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
