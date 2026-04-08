import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import DICTIONARY_DATA from "./dictionaryData.json";

interface QuickSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function QuickSearchModal({
  visible,
  onClose,
}: QuickSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData =
    searchQuery.trim() === ""
      ? []
      : DICTIONARY_DATA.filter(
          (item: any) =>
            item.word &&
            item.word.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Quick Search</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search words instantly..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results */}
          <View style={styles.resultsContainer}>
            {searchQuery.trim() === "" ? (
              <Text style={styles.emptyPrompt}>Type to search slang...</Text>
            ) : filteredData.length === 0 ? (
              <Text style={styles.emptyPrompt}>No results found.</Text>
            ) : (
              <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <View style={styles.resultItem}>
                    <Text style={styles.wordText}>{item.word}</Text>
                    <Text style={styles.meaningText}>{item.meaning}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F1FB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5D3F3",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    fontWeight: "600",
  },
  resultsContainer: {
    flexShrink: 1,
    minHeight: 100,
  },
  emptyPrompt: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "600",
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  wordText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#B8A4E3",
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
