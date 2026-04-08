import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EXAMPLES = [
  {
    word: "Valid",
    meaning: "Can mean sincere understanding or sarcastic dismissal depending on tone.",
    genuine: "Wow, that's completely valid, I understand.",
    sarcastic: "Oh yeah, definitely valid. (meaning: that makes no sense)",
    tip: "Look at punctuation and facial expression. Calm tone = support, dry tone = sarcasm.",
    bg: "#E3F3EE",
  },
  {
    word: "Slay",
    meaning: "Usually praise, but can also be used in a dry or teasing way.",
    genuine: "You look amazing, slay!",
    sarcastic: "Slay. (deadpan response to something slightly inconvenient)",
    tip: "Excited energy usually means praise. One-word flat reply can sound ironic.",
    bg: "#F6E7EE",
  },
  {
    word: "Bet",
    meaning: "Often means okay or agreed, but can also mean challenge accepted.",
    genuine: "Bet, I'll see you at 5pm.",
    sarcastic: "Bet. (challenge accepted / I doubt it)",
    tip: "In planning chats it means agreement. In arguments it can sound like a warning.",
    bg: "#F0EAF6",
  },
  {
    word: "Sure",
    meaning: "Can be helpful agreement or passive-aggressive annoyance.",
    genuine: "Sure, I can help you with that.",
    sarcastic: "Sure. Do whatever you want.",
    tip: "Extra context matters. Warm follow-up = genuine, short cold reply = attitude.",
    bg: "#EAF6F0",
  },
  {
    word: "Crazy",
    meaning: "Can mean surprising, impressive, or dismissive depending on delivery.",
    genuine: "That's crazy, congrats on your result!",
    sarcastic: "That's crazy... anyway.",
    tip: "If the speaker changes the topic fast, it may be dismissive instead of supportive.",
    bg: "#F9EAF4",
  },
  {
    word: "Wild",
    meaning: "Can mean shocking in an interested way or rude disbelief.",
    genuine: "That's wild, I didn't know you built that by yourself!",
    sarcastic: "Wild. You really thought that was a good idea?",
    tip: "Pairing with curiosity makes it positive. Pairing with judgment makes it negative.",
    bg: "#EEF3FF",
  },
  {
    word: "Okay",
    meaning: "Can show understanding or emotional distance.",
    genuine: "Okay, got it. Thanks for telling me.",
    sarcastic: "Okay...? if you say so.",
    tip: "A plain 'okay' is neutral, but punctuation like '...?' can make it feel shady.",
    bg: "#F6EDE7",
  },
  {
    word: "Period",
    meaning: "Can strongly support a statement or mock someone dramatically.",
    genuine: "You deserve better, period.",
    sarcastic: "Best idea ever, period. 🙄",
    tip: "Confident hype usually means support. Eye-roll energy makes it sarcastic.",
    bg: "#E8F4F8",
  },
  {
    word: "Iconic",
    meaning: "Can mean truly impressive or jokingly chaotic.",
    genuine: "Your presentation was iconic.",
    sarcastic: "You dropped your phone in class? Iconic.",
    tip: "Success moments make it genuine. Embarrassing moments can make it teasing.",
    bg: "#F7EDF9",
  },
  {
    word: "Interesting",
    meaning: "Can signal curiosity or polite disapproval.",
    genuine: "Interesting, tell me more about your idea.",
    sarcastic: "Interesting choice.",
    tip: "If they ask questions after, it is likely genuine. If they stop there, maybe not.",
    bg: "#EAF7EE",
  },
  {
    word: "Nice",
    meaning: "Can be warm encouragement or a dry brush-off.",
    genuine: "Nice! You finished the project early.",
    sarcastic: "Nice. Now look what happened.",
    tip: "Excited punctuation often means praise. Flat tone can make it sound annoyed.",
    bg: "#FFF1E8",
  },
  {
    word: "Love that",
    meaning: "Can show real support or ironic judgment.",
    genuine: "You finally stood up for yourself? Love that for you.",
    sarcastic: "You spilled coffee on your notes? Love that.",
    tip: "Positive situation = support. Negative situation = likely sarcasm.",
    bg: "#F0EEFA",
  },
];

export default function ToneAndContextScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tone & Context</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why tone matters</Text>
            <Text style={styles.infoText}>
              Slang changes meaning completely depending on tone, punctuation,
              timing, and context. A word like "bet" can mean agreement, or it
              can sound like a challenge. Always read the vibe before you type.
            </Text>
          </View>

          <View style={styles.tipBanner}>
            <Ionicons name="bulb-outline" size={20} color="#6F52B5" />
            <Text style={styles.tipBannerText}>
              Watch for emojis, full stops, all caps, dry one-word replies, and
              what happened earlier in the chat.
            </Text>
          </View>

          {EXAMPLES.map((item, idx) => (
            <View key={idx} style={[styles.card, { backgroundColor: item.bg }]}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>

              <View style={styles.exampleRow}>
                <Text style={styles.emoji}>✅</Text>
                <View style={styles.textWrap}>
                  <Text style={styles.label}>Genuine</Text>
                  <Text style={styles.quote}>"{item.genuine}"</Text>
                </View>
              </View>

              <View style={styles.exampleRow}>
                <Text style={styles.emoji}>😒</Text>
                <View style={styles.textWrap}>
                  <Text style={styles.label}>Sarcastic</Text>
                  <Text style={styles.quote}>"{item.sarcastic}"</Text>
                </View>
              </View>

              <View style={styles.tipBox}>
                <Text style={styles.tipLabel}>Context clue</Text>
                <Text style={styles.tipText}>{item.tip}</Text>
              </View>
            </View>
          ))}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Quick reminder</Text>
            <Text style={styles.summaryText}>
              The same word can feel friendly, funny, rude, dismissive, or
              supportive depending on delivery. Meaning is not only in the word
              — it is in the vibe.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.completeButtonText}>Finish Lesson</Text>
          </TouchableOpacity>
        </ScrollView>
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
    marginBottom: 20,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#222" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    color: "#222",
    fontWeight: "900",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontWeight: "600",
  },
  tipBanner: {
    backgroundColor: "#F3EEFF",
    borderWidth: 1,
    borderColor: "#D9CCFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipBannerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#5B4A85",
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  word: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    marginBottom: 6,
  },
  meaning: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    fontWeight: "600",
    marginBottom: 14,
  },
  exampleRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "800",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  quote: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 22,
  },
  tipBox: {
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 12,
    padding: 12,
  },
  tipLabel: {
    fontSize: 12,
    color: "#555",
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  tipText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 19,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#222",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#B8A4E3",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});