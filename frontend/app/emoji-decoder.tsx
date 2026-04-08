import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type EmojiItem = {
  emoji: string;
  literal: string;
  genz: string;
  example: string;
  vibe: string;
};

const emojiData: EmojiItem[] = [
  {
    emoji: "💀",
    literal: "Skull, death, skeleton.",
    genz: "Used to mean 'I’m dead' from laughter, shock, or secondhand embarrassment.",
    example: "That reply was so awkward 💀",
    vibe: "Funny / deadpan / chaotic",
  },
  {
    emoji: "😭",
    literal: "Crying loudly, sadness, tears.",
    genz: "Can mean laughing too hard, emotional overload, or dramatic reaction.",
    example: "Why would he say that 😭",
    vibe: "Overdramatic / emotional / funny",
  },
  {
    emoji: "🤡",
    literal: "Clown face.",
    genz: "Used when someone feels stupid, embarrassed, or played themselves.",
    example: "Me thinking the test was tomorrow 🤡",
    vibe: "Self-roast / embarrassment",
  },
  {
    emoji: "✋",
    literal: "Raised hand, stop, hello.",
    genz: "Used for 'wait', 'stop right there', or playful disbelief.",
    example: "Girl what is this outfit ✋",
    vibe: "Sassy / pause / disbelief",
  },
  {
    emoji: "🤭",
    literal: "Hand over mouth, surprise or giggle.",
    genz: "Used for playful gossip, lowkey shade, or 'oops I said it'.",
    example: "She definitely likes him 🤭",
    vibe: "Gossip / teasing / playful",
  },
  {
    emoji: "🙄",
    literal: "Eye roll, annoyance.",
    genz: "Still means annoyance, but often used in sarcastic or dramatic texting tone.",
    example: "He posted another gym mirror pic 🙄",
    vibe: "Annoyed / sarcastic",
  },
  {
    emoji: "🤔",
    literal: "Thinking face.",
    genz: "Used for suspicion, doubt, or 'something is off here'.",
    example: "He replied after 8 hours? 🤔",
    vibe: "Suspicious / curious",
  },
  {
    emoji: "😭",
    literal: "Crying face, sadness.",
    genz: "Can also mean 'this is too funny' or 'I cannot deal with this'.",
    example: "This meme is sending me 😭",
    vibe: "Funny / overwhelmed",
  },
  {
    emoji: "🫠",
    literal: "Melting face.",
    genz: "Used when someone is cringing, overwhelmed, embarrassed, or emotionally melting.",
    example: "He called on me in class and I forgot everything 🫠",
    vibe: "Awkward / overwhelmed",
  },
  {
    emoji: "😮‍💨",
    literal: "Exhale, relief, sigh.",
    genz: "Used for emotional exhaustion, drama recovery, or 'finally done'.",
    example: "That presentation is over 😮‍💨",
    vibe: "Relief / drained",
  },
  {
    emoji: "👀",
    literal: "Eyes looking.",
    genz: "Used for gossip, attention, suspicion, or 'I’m watching this'.",
    example: "They unfollowed each other? 👀",
    vibe: "Tea / curiosity / drama",
  },
  {
    emoji: "😬",
    literal: "Grimace, awkwardness.",
    genz: "Used for cringe, tension, or uncomfortable situations.",
    example: "He called the teacher mom 😬",
    vibe: "Cringe / awkward",
  },

  {
  emoji: "💅🏻",
  literal: "Painting nails, manicure.",
  genz: "Used to show confidence, sass, or not caring what others think.",
  example: "I said what I said 💅🏻",
  vibe: "Sassy / confident",
},
{
  emoji: "🤷🏻‍♀️",
  literal: "Shrugging woman, uncertainty.",
  genz: "Used for 'I don’t know' or 'I don’t care'.",
  example: "He didn’t text back 🤷🏻‍♀️",
  vibe: "Indifferent / casual",
},
{
  emoji: "🤯",
  literal: "Exploding head, shock.",
  genz: "Mind blown, something shocking or unbelievable.",
  example: "That plot twist was insane 🤯",
  vibe: "Shocked / amazed",
},
{
  emoji: "🤦🏼‍♀️",
  literal: "Facepalm, frustration.",
  genz: "Used when someone does something stupid or embarrassing.",
  example: "He forgot his own birthday 🤦🏼‍♀️",
  vibe: "Frustration / cringe",
},
{
  emoji: "🥸",
  literal: "Disguise face.",
  genz: "Used jokingly when someone is acting fake or suspicious.",
  example: "Bro switched personalities 🥸",
  vibe: "Fake / suspicious / funny",
},
{
  emoji: "😶‍🌫️",
  literal: "Face in clouds, confusion.",
  genz: "Feeling lost, overwhelmed, or mentally gone.",
  example: "After studying all night I’m 😶‍🌫️",
  vibe: "Confused / drained",
},
{
  emoji: "🥵",
  literal: "Hot face, overheating.",
  genz: "Can mean physically hot OR someone is attractive.",
  example: "That guy is so fine 🥵",
  vibe: "Hot / flirty / intense",
},
{
  emoji: "🤛🏻",
  literal: "Left-facing fist, punch.",
  genz: "Used like a friendly fist bump or agreement.",
  example: "We got this 🤛🏻",
  vibe: "Support / teamwork",
},
{
  emoji: "🤌🏻",
  literal: "Pinched fingers gesture.",
  genz: "Used to express perfection or strong emphasis (Italian vibe).",
  example: "This pasta is perfect 🤌🏻",
  vibe: "Perfection / emphasis",
},
{
  emoji: "🫦",
  literal: "Biting lip.",
  genz: "Used for attraction, nervous flirting, or tension.",
  example: "He looked at me and I was like 🫦",
  vibe: "Flirty / nervous",
},
{
  emoji: "🧏🏻‍♀️",
  literal: "Deaf woman / hand near ear.",
  genz: "Used as 'I’m not listening' or ignoring drama.",
  example: "Not my problem 🧏🏻‍♀️",
  vibe: "Ignoring / unbothered",
},
{
  emoji: "💦",
  literal: "Water droplets, sweat.",
  genz: " Often denotes sexual desire",
  example: "That workout was crazy 💦",
  vibe: "steamy / vulgur ",
 },
];

export default function EmojiDecoderScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"literal" | "genz">("literal");
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return emojiData;

    return emojiData.filter((item) => {
      return (
        item.emoji.includes(trimmed) ||
        item.literal.toLowerCase().includes(trimmed) ||
        item.genz.toLowerCase().includes(trimmed) ||
        item.vibe.toLowerCase().includes(trimmed) ||
        item.example.toLowerCase().includes(trimmed)
      );
    });
  }, [query]);

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

          <Text style={styles.headerTitle}>Emoji Decoder</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>🤔</Text>
            <Text style={styles.heroTitle}>Literal Mode vs Gen Z Mode</Text>
            <Text style={styles.heroText}>
              Search an emoji and see what it means normally and what it means in
              Gen Z texting culture.
            </Text>
          </View>

          <View style={styles.searchWrap}>
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search emoji or meaning..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.toggleWrap}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                mode === "literal" && styles.activeLiteralBtn,
              ]}
              onPress={() => setMode("literal")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "literal" && styles.activeToggleText,
                ]}
              >
                Literal Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                mode === "genz" && styles.activeGenZBtn,
              ]}
              onPress={() => setMode("genz")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "genz" && styles.activeToggleText,
                ]}
              >
                Gen Z Mode
              </Text>
            </TouchableOpacity>
          </View>

          {filteredData.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>😕</Text>
              <Text style={styles.emptyTitle}>No emoji found</Text>
              <Text style={styles.emptyText}>
                Try searching with an emoji like 💀 or a word like crying,
                clown, awkward, funny.
              </Text>
            </View>
          ) : (
            filteredData.map((item, index) => (
              <View key={`${item.emoji}-${index}`} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.emojiBubble}>
                    <Text style={styles.emojiText}>{item.emoji}</Text>
                  </View>
                  <View style={styles.vibePill}>
                    <Text style={styles.vibeText}>{item.vibe}</Text>
                  </View>
                </View>

                <Text style={styles.modeLabel}>
                  {mode === "literal" ? "Literal Meaning" : "Gen Z Meaning"}
                </Text>

                <Text style={styles.mainMeaning}>
                  {mode === "literal" ? item.literal : item.genz}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.secondaryLabel}>
                  {mode === "literal" ? "Gen Z Meaning" : "Literal Meaning"}
                </Text>

                <Text style={styles.secondaryMeaning}>
                  {mode === "literal" ? item.genz : item.literal}
                </Text>

                <View style={styles.exampleBox}>
                  <Text style={styles.exampleTitle}>Example</Text>
                  <Text style={styles.exampleText}>{item.example}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
    marginBottom: 10,
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  heroCard: {
    backgroundColor: "#F6E7B8",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  heroEmoji: {
    fontSize: 34,
    marginBottom: 8,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 6,
  },

  heroText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555",
    fontWeight: "600",
  },

  searchWrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    paddingVertical: 14,
    fontWeight: "600",
  },

  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#ffffff99",
    borderRadius: 18,
    padding: 4,
    marginBottom: 18,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  activeLiteralBtn: {
    backgroundColor: "#DDF1E7",
  },

  activeGenZBtn: {
    backgroundColor: "#F2E4F8",
  },

  toggleText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#777",
  },

  activeToggleText: {
    color: "#111",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#222",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  emojiBubble: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F8F4FB",
    alignItems: "center",
    justifyContent: "center",
  },

  emojiText: {
    fontSize: 30,
  },

  vibePill: {
    backgroundColor: "#EAF7F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    maxWidth: "65%",
  },

  vibeText: {
    color: "#2E8D67",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  modeLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  mainMeaning: {
    fontSize: 16,
    color: "#111",
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginBottom: 12,
  },

  secondaryLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  secondaryMeaning: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
    fontWeight: "600",
    marginBottom: 14,
  },

  exampleBox: {
    backgroundColor: "#F6F7FB",
    borderRadius: 14,
    padding: 12,
  },

  exampleTitle: {
    fontSize: 12,
    color: "#888",
    fontWeight: "800",
    marginBottom: 4,
  },

  exampleText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
    lineHeight: 20,
  },
});