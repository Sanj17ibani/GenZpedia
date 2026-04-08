import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const correctSoundFile = require("../assets/sounds/correct.mp3");
const wrongSoundFile = require("../assets/sounds/wrong.mp3");

const avatarMap = {
  female: [
    require("../assets/images/female1.png"),
    require("../assets/images/female2.png"),
    require("../assets/images/female3.png"),
    require("../assets/images/female4.png"),
  ],
  male: [
    require("../assets/images/male1.png"),
    require("../assets/images/male2.png"),
    require("../assets/images/male3.png"),
    require("../assets/images/male4.png"),
  ],
  prefer_not_to_say: [require("../assets/images/prefer_not.png")],
};

const questions = [
  {
    chat: [
      { user: "Ava", text: "who took my fries 😭" },
      { user: "Mia", text: "not me" },
      { user: "Jay", text: "guys let’s stay calm" },
    ],
    options: [
      "We should investigate peacefully.",
      "fanum tax strikes again 💀",
      "Maybe the fries disappeared.",
      "Please purchase more.",
    ],
    answer: "fanum tax strikes again 💀",
    explanation: "Fanum Tax is a joke about stealing your friend’s food.",
  },
  {
    chat: [
      { user: "Riya", text: "the deadline is tonight??" },
      { user: "Nia", text: "bro I thought it was next week" },
      { user: "Ava", text: "same 😭" },
    ],
    options: [
      "Please submit it now.",
      "we are so cooked",
      "That is manageable.",
      "Time is a social construct.",
    ],
    answer: "we are so cooked",
    explanation: "Cooked means doomed / in trouble.",
  },
  {
    chat: [
      { user: "Sam", text: "bro went to the gym once" },
      { user: "Jay", text: "and now he only posts mirror pics" },
    ],
    options: [
      "Fitness is important.",
      "aura farming has begun",
      "He seems disciplined.",
      "That is a health update.",
    ],
    answer: "aura farming has begun",
    explanation:
      "This jokes that he’s trying to gain cool points from tiny effort.",
  },
  {
    chat: [
      { user: "Anu", text: "why is my cousin saying skibidi sigma unironically" },
      { user: "Riya", text: "I’m actually scared" },
    ],
    options: [
      "That is educational slang.",
      "brainrot final boss 😭",
      "He is intelligent.",
      "That sounds poetic.",
    ],
    answer: "brainrot final boss 😭",
    explanation: "This reply fits because the slang combo is absurdly online.",
  },
  {
    chat: [
      { user: "Mia", text: "I ordered fries" },
      { user: "Ava", text: "why are there only 3 left" },
      { user: "Mia", text: "don’t look at me" },
    ],
    options: [
      "This is unfortunate.",
      "caught in 4K",
      "Perhaps the waiter took them.",
      "Food evaporates sometimes.",
    ],
    answer: "caught in 4K",
    explanation: "She’s clearly exposed as the fries thief.",
  },
  {
    chat: [
      { user: "Jay", text: "bro said easy win" },
      { user: "Sam", text: "and then got eliminated first 😭" },
    ],
    options: [
      "That is unlucky.",
      "the delusion is inspiring",
      "He played bravely.",
      "Victory takes time.",
    ],
    answer: "the delusion is inspiring",
    explanation: "He was way too confident for absolutely no reason.",
  },
  {
    chat: [
      { user: "Nia", text: "she posted one sunset pic" },
      { user: "Ava", text: "now her caption is healing in silence" },
    ],
    options: [
      "That is beautiful.",
      "main character mode activated",
      "She likes nature.",
      "Very spiritual.",
    ],
    answer: "main character mode activated",
    explanation:
      "This jokes that she’s being overly dramatic and cinematic.",
  },
  {
    chat: [
      { user: "Riya", text: "he joined the group only to say what’s the topic?" },
      { user: "Anu", text: "after we already finished everything" },
    ],
    options: [
      "He is curious.",
      "NPC teammate fr",
      "That is helpful.",
      "He wants to contribute.",
    ],
    answer: "NPC teammate fr",
    explanation:
      "He’s acting like the most default useless group project member possible.",
  },
  {
    chat: [
      { user: "Ava", text: "I ordered black cargo pants" },
      { user: "Mia", text: "what came?" },
      { user: "Ava", text: "blue leggings 😭" },
    ],
    options: [
      "That is close enough.",
      "nah that seller was moving evil",
      "At least it arrived.",
      "Blue is a nice color.",
    ],
    answer: "nah that seller was moving evil",
    explanation: "This exaggerates how badly the order was messed up.",
  },
  {
    chat: [
      { user: "Nia", text: "she got left on seen for 20 mins" },
      { user: "Ava", text: "and now she says I’ll never trust again" },
    ],
    options: [
      "That is emotional.",
      "girl this is not your villain arc 😭",
      "She is correct.",
      "Very deep.",
    ],
    answer: "girl this is not your villain arc 😭",
    explanation: "The reply mocks how overdramatic the reaction is.",
  },
  {
    chat: [
      { user: "Sam", text: "my little cousin called me unc status" },
      { user: "Jay", text: "NAHHH 😭" },
    ],
    options: [
      "That means you are respected.",
      "that’s a generational violation 💀",
      "Children are honest.",
      "You should thank him.",
    ],
    answer: "that’s a generational violation 💀",
    explanation:
      "The joke is that being called old by a younger kid is brutal.",
  },
  {
    chat: [
      { user: "Riya", text: "I opened the syllabus" },
      { user: "Anu", text: "and?" },
      { user: "Riya", text: "I closed it" },
    ],
    options: [
      "That is discipline.",
      "academic comeback loading… never",
      "You should study.",
      "Good strategy.",
    ],
    answer: "academic comeback loading… never",
    explanation: "This is a funny way to admit total lack of motivation.",
  },
  {
    chat: [
      { user: "Ava", text: "he posted real ones move in silence" },
      { user: "Mia", text: "with 17 hashtags 😭" },
    ],
    options: [
      "That is branding.",
      "the cringe is loud actually",
      "Very inspiring.",
      "That is creative.",
    ],
    answer: "the cringe is loud actually",
    explanation:
      "The post tries too hard to look cool, which makes it embarrassing.",
  },
  {
    chat: [
      { user: "Jay", text: "bro said I’m almost there" },
      { user: "Sam", text: "he’s still in the shower" },
    ],
    options: [
      "He values punctuality.",
      "ETA = pathological liar",
      "He is preparing.",
      "That is efficient.",
    ],
    answer: "ETA = pathological liar",
    explanation:
      "This jokes about people who always lie about how close they are.",
  },
  {
    chat: [
      { user: "Maya", text: "I sent a funny reel" },
      { user: "Ava", text: "what did she reply" },
      { user: "Maya", text: "haha" },
    ],
    options: [
      "That is positive.",
      "nah that convo is on life support 💀",
      "She is expressive.",
      "Very engaging.",
    ],
    answer: "nah that convo is on life support 💀",
    explanation: "A dry haha usually means the energy is dead.",
  },
];

type ChatMessage = {
  user: string;
  text: string;
};

export default function VibeCheckScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const { name, gender, avatarIndex } = useLocalSearchParams();

  const safeGender =
    gender === "female" || gender === "male" || gender === "prefer_not_to_say"
      ? gender
      : "prefer_not_to_say";

  const safeAvatarIndex = Number(avatarIndex) || 0;

  const selectedProfileImage =
    avatarMap[safeGender][safeAvatarIndex] || avatarMap.prefer_not_to_say[0];

  const displayName = name ? String(name).toUpperCase() : "USER";

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = useMemo(() => questions[currentQ], [currentQ]);

  const cleanupSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.log("Sound unload error:", error);
      }
      soundRef.current = null;
    }
  };

  const playSound = async (isCorrect: boolean) => {
    try {
      await cleanupSound();
      const { sound } = await Audio.Sound.createAsync(
        isCorrect ? correctSoundFile : wrongSoundFile
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("Sound play error:", error);
    }
  };

  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, []);

  useEffect(() => {
    if (!question || quizFinished) return;

    setVisibleMessages([]);
    const timers: ReturnType<typeof setTimeout>[] = [];

    question.chat.forEach((msg, index) => {
      const timer = setTimeout(() => {
        if (msg) {
          setVisibleMessages((prev) => [...prev, msg]);
        }
      }, 650 * (index + 1));
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [question, quizFinished]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [visibleMessages, showExplanation]);

  const handleSelect = async (option: string) => {
    if (!question || selected || showExplanation) return;

    setSelected(option);
    const isCorrect = option === question.answer;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    await playSound(isCorrect);

    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setQuizFinished(true);
      return;
    }

    setSelected(null);
    setShowExplanation(false);
    setCurrentQ((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setVisibleMessages([]);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
  };

  const typingVisible =
    !quizFinished &&
    question &&
    visibleMessages.length < question.chat.length &&
    !showExplanation;

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerRow}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.profileRow}>
              <Image
                source={selectedProfileImage}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.welcomeSmall}>Vibe Check</Text>
                <Text style={styles.nameText}>{displayName}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={22} color="#222" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Can You Pass the Vibe Check👀 ?</Text>
            <Text style={styles.heroSubtitle}>Choose the best reply</Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>🔥 Score: {score}</Text>
            </View>
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>⚡ Streak: {streak}</Text>
            </View>
          </View>

          {quizFinished ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>You finished the vibe check 🎉</Text>
              <Text style={styles.resultScore}>Final Score: {score}</Text>
              <Text style={styles.resultSubtext}>
                You completed {questions.length} chats.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : question ? (
            <>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  Chat {currentQ + 1} / {questions.length}
                </Text>
              </View>

              <View style={styles.chatCard}>
                {visibleMessages.map((msg, index) => {
                  if (!msg) return null;

                  const isLeft = index % 2 === 0;

                  return (
                    <View
                      key={`${msg.user}-${index}`}
                      style={[
                        styles.bubble,
                        isLeft ? styles.leftBubble : styles.rightBubble,
                      ]}
                    >
                      <Text style={styles.bubbleUser}>{msg.user}</Text>
                      <Text style={styles.bubbleText}>{msg.text}</Text>
                    </View>
                  );
                })}

                {typingVisible && (
                  <View style={styles.typingBubble}>
                    <Text style={styles.typingText}>Typing...</Text>
                  </View>
                )}
              </View>

              <Text style={styles.questionTitle}>What should you reply?</Text>

              {!showExplanation &&
                question.options.map((option, index) => {
                  const isSelected = selected === option;
                  const isCorrect = option === question.answer;

                  return (
                    <TouchableOpacity
                      key={`${option}-${index}`}
                      activeOpacity={0.8}
                      style={[
                        styles.optionButton,
                        isSelected && isCorrect && styles.correctOption,
                        isSelected && !isCorrect && styles.wrongOption,
                      ]}
                      onPress={() => handleSelect(option)}
                      disabled={!!selected}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}

              {showExplanation && (
                <View style={styles.explanationCard}>
                  <Text style={styles.answerLabel}>Best reply</Text>
                  <Text style={styles.answerText}>{question.answer}</Text>
                  <Text style={styles.explanationText}>
                    {question.explanation}
                  </Text>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleNext}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryButtonText}>
                      {currentQ + 1 === questions.length ? "See Result" : "Next Chat"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : null}
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

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  welcomeSmall: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  nameText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "800",
  },

  menuButton: {
    padding: 6,
  },

  heroCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
    lineHeight: 30,
  },

  heroSubtitle: {
    fontSize: 15,
    color: "#555",
    fontWeight: "700",
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  scorePill: {
    backgroundColor: "#DDF7EA",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  streakPill: {
    backgroundColor: "#FFEBD9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  scoreText: {
    color: "#23966F",
    fontWeight: "800",
    fontSize: 13,
  },

  streakText: {
    color: "#D97706",
    fontWeight: "800",
    fontSize: 13,
  },

  progressRow: {
    marginBottom: 10,
  },

  progressText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "700",
  },

  chatCard: {
    backgroundColor: "#FFFFFFAA",
    borderRadius: 22,
    padding: 14,
    marginBottom: 18,
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 18,
    marginBottom: 10,
  },

  leftBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 6,
  },

  rightBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#DDF7EA",
    borderTopRightRadius: 6,
  },

  bubbleUser: {
    fontSize: 11,
    color: "#666",
    fontWeight: "700",
    marginBottom: 4,
  },

  bubbleText: {
    fontSize: 14,
    color: "#222",
    lineHeight: 20,
    fontWeight: "600",
  },

  typingBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    borderTopLeftRadius: 6,
  },

  typingText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "700",
  },

  questionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginBottom: 12,
  },

  optionButton: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },

  optionText: {
    fontSize: 14,
    color: "#222",
    fontWeight: "700",
    lineHeight: 20,
  },

  correctOption: {
    backgroundColor: "#CFF3E6",
  },

  wrongOption: {
    backgroundColor: "#F8D8E0",
  },

  explanationCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
  },

  answerLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "700",
    marginBottom: 6,
  },

  answerText: {
    fontSize: 17,
    color: "#111",
    fontWeight: "900",
    marginBottom: 10,
  },

  explanationText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontWeight: "600",
    marginBottom: 16,
  },

  primaryButton: {
    backgroundColor: "#32A67C",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#FFFFFFCC",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "800",
  },

  resultCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 22,
    padding: 22,
    marginTop: 10,
  },

  resultTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 10,
  },

  resultScore: {
    fontSize: 18,
    fontWeight: "900",
    color: "#32A67C",
    marginBottom: 8,
  },

  resultSubtext: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginBottom: 18,
    lineHeight: 20,
  },
});
