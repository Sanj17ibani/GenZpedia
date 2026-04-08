import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from "expo-av";

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
} as const;

const questions = [
  {
    question: "What does “Rizz” mean?",
    options: [
      "A type of dance",
      "Charm or flirting skill",
      "A food trend",
      "A fashion style",
    ],
    correctAnswer: "Charm or flirting skill",
    explanation: "Rizz means someone has charm, especially in flirting.",
  },
  {
    question: "What does “Delulu” mean?",
    options: ["Very rich", "Delusional", "Super stylish", "Extremely lazy"],
    correctAnswer: "Delusional",
    explanation: "Delulu is short for delusional, usually used jokingly.",
  },
  {
    question: "What does “Cap” mean?",
    options: ["A hat", "A lie", "A compliment", "A challenge"],
    correctAnswer: "A lie",
    explanation: "If someone says “That’s cap”, they mean “That’s a lie.”",
  },
  {
    question: "What does “No Cap” mean?",
    options: ["No problem", "No joke / for real", "No fashion", "No clue"],
    correctAnswer: "No joke / for real",
    explanation: "No cap means “I’m being honest” or “for real.”",
  },
  {
    question: "What does “Ate” mean?",
    options: [
      "They were hungry",
      "They did really well",
      "They got angry",
      "They left early",
    ],
    correctAnswer: "They did really well",
    explanation: "If someone “ate”, it means they did something amazingly well.",
  },
  {
    question: "What does “Mid” mean?",
    options: [
      "Amazing",
      "Average / not impressive",
      "Super expensive",
      "Very emotional",
    ],
    correctAnswer: "Average / not impressive",
    explanation: "Mid means something is just okay or overhyped.",
  },
  {
    question: "What does “Slay” mean?",
    options: [
      "To sleep",
      "To do something confidently and amazingly",
      "To lose badly",
      "To copy someone",
    ],
    correctAnswer: "To do something confidently and amazingly",
    explanation: "Slay means someone looked or did something really well.",
  },
  {
    question: "What does “NPC” mean in slang?",
    options: [
      "A super smart person",
      "Someone acting basic or robotic",
      "A gamer winner",
      "A popular creator",
    ],
    correctAnswer: "Someone acting basic or robotic",
    explanation:
      "NPC is used for someone acting generic, repetitive, or lifeless.",
  },
  {
    question: "What does “It’s giving…” usually mean?",
    options: [
      "It is free",
      "It has the vibe of something",
      "It is expensive",
      "It is broken",
    ],
    correctAnswer: "It has the vibe of something",
    explanation: "“It’s giving…” means something has a certain energy or vibe.",
  },
  {
    question: "What does “Sus” mean?",
    options: ["Stylish", "Suspicious", "Sad", "Successful"],
    correctAnswer: "Suspicious",
    explanation: "Sus means someone or something seems suspicious.",
  },
  {
    question: "What does “Bet” mean?",
    options: ["A gamble", "Okay / sure / agreed", "A joke", "A fight"],
    correctAnswer: "Okay / sure / agreed",
    explanation: "Bet is a casual way of saying “okay” or “sounds good.”",
  },
  {
    question: "What does “Lowkey” mean?",
    options: [
      "Secretly / kind of",
      "Very loudly",
      "Totally fake",
      "Extremely obvious",
    ],
    correctAnswer: "Secretly / kind of",
    explanation: "Lowkey means quietly, secretly, or slightly.",
  },
  {
    question: "What does “Highkey” mean?",
    options: ["Secretly", "Strongly / openly", "Very rich", "Very calm"],
    correctAnswer: "Strongly / openly",
    explanation: "Highkey means openly or strongly.",
  },
  {
    question: "What does “Bruh” usually express?",
    options: [
      "Excitement",
      "Confusion, disappointment, or disbelief",
      "Hunger",
      "Respect",
    ],
    correctAnswer: "Confusion, disappointment, or disbelief",
    explanation:
      "Bruh is usually used when something is annoying, dumb, or shocking.",
  },
  {
    question: "What does “Simp” mean?",
    options: [
      "Someone too obsessed with another person",
      "A shy person",
      "A gamer term",
      "A stylish person",
    ],
    correctAnswer: "Someone too obsessed with another person",
    explanation:
      "Simp is used for someone showing too much attention or admiration, often romantically.",
  },
];

const mascotImages = {
  default: require("../assets/images/mascot-default.png"),
  correct: require("../assets/images/mascot-mewing.png"),
  wrong: require("../assets/images/mascot-thumbsdown.png"),
};

export default function GuessItScreen() {
  const router = useRouter();
  const { name, gender, avatarIndex } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);

  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);

  const safeGender =
    gender === "female" || gender === "male" || gender === "prefer_not_to_say"
      ? gender
      : "prefer_not_to_say";

  const safeAvatarIndex = Number(avatarIndex) || 0;

  const selectedProfileImage =
    avatarMap[safeGender][safeAvatarIndex] || avatarMap.prefer_not_to_say[0];

  const displayName = name ? String(name).toUpperCase() : "USER";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const isCorrect = useMemo(() => {
    if (!selectedOption) return false;
    return selectedOption === currentQuestion.correctAnswer;
  }, [selectedOption, currentQuestion]);

  const mascotSource = !selectedOption
    ? mascotImages.default
    : isCorrect
      ? mascotImages.correct
      : mascotImages.wrong;

  useEffect(() => {
    let mounted = true;
    let loadedCorrectSound: Audio.Sound | null = null;
    let loadedWrongSound: Audio.Sound | null = null;

    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });

        const { sound: correct } = await Audio.Sound.createAsync(
          correctSoundFile
        );
        const { sound: wrong } = await Audio.Sound.createAsync(wrongSoundFile);

        loadedCorrectSound = correct;
        loadedWrongSound = wrong;

        if (mounted) {
          setCorrectSound(correct);
          setWrongSound(wrong);
        }
      } catch (error) {
        console.log("Error loading sounds:", error);
      }
    };

    loadSounds();

    return () => {
      mounted = false;

      if (loadedCorrectSound) {
        loadedCorrectSound.unloadAsync();
      }

      if (loadedWrongSound) {
        loadedWrongSound.unloadAsync();
      }
    };
  }, []);

  const handleOptionPress = async (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    setShowExplanation(true);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setXp((prev) => prev + 10);

      try {
        if (correctSound) {
          await correctSound.setPositionAsync(0);
          await correctSound.playAsync();
        }
      } catch (error) {
        console.log("Error playing correct sound:", error);
      }
    } else {
      try {
        if (wrongSound) {
          await wrongSound.setPositionAsync(0);
          await wrongSound.playAsync();
        }
      } catch (error) {
        console.log("Error playing wrong sound:", error);
      }
    }

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 250);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);

      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }, 100);
    } else {
      setQuizFinished(true);

      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }, 100);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setXp(0);
    setQuizFinished(false);

    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, 100);
  };

  const progressPercent =
    ((currentQuestionIndex + (quizFinished ? 1 : 0)) / questions.length) * 100;

  if (quizFinished) {
    return (
      <LinearGradient
        colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <View style={styles.resultContainer}>
              <View style={styles.resultTopRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() =>
                    router.push({
                      pathname: "/practice",
                      params: {
                        name: String(name || "User"),
                        gender: String(safeGender),
                        avatarIndex: String(safeAvatarIndex),
                      },
                    })
                  }
                >
                  <Ionicons name="arrow-back" size={22} color="#222" />
                </TouchableOpacity>

                <View style={styles.profileMini}>
                  <Image source={selectedProfileImage} style={styles.profileImage} />
                  <Text style={styles.profileMiniText}>{displayName}</Text>
                </View>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultEmoji}>🏆</Text>
                <Text style={styles.resultTitle}>Quiz Complete!</Text>
                <Text style={styles.resultSubtitle}>
                  You finished Guess It like a true slang boss.
                </Text>

                <View style={styles.resultStatsRow}>
                  <View style={styles.resultStatBox}>
                    <Text style={styles.resultStatNumber}>
                      {score}/{questions.length}
                    </Text>
                    <Text style={styles.resultStatLabel}>Correct</Text>
                  </View>

                  <View style={styles.resultStatBox}>
                    <Text style={styles.resultStatNumber}>+{xp} XP</Text>
                    <Text style={styles.resultStatLabel}>Earned</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleRestart}
                >
                  <Text style={styles.primaryButtonText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() =>
                    router.push({
                      pathname: "/practice",
                      params: {
                        name: String(name || "User"),
                        gender: String(safeGender),
                        avatarIndex: String(safeAvatarIndex),
                      },
                    })
                  }
                >
                  <Text style={styles.secondaryButtonText}>Back to Practice</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
        >
          <View style={styles.screenPadding}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  router.push({
                    pathname: "/practice",
                    params: {
                      name: String(name || "User"),
                      gender: String(safeGender),
                      avatarIndex: String(safeAvatarIndex),
                    },
                  })
                }
              >
                <Ionicons name="arrow-back" size={22} color="#222" />
              </TouchableOpacity>

              <View style={styles.topProfileRow}>
                <Image source={selectedProfileImage} style={styles.profileImage} />
                <View>
                  <Text style={styles.smallLabel}>Guess It</Text>
                  <Text style={styles.nameText}>{displayName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.xpCard}>
              <View style={styles.xpTopRow}>
                <Text style={styles.xpTitle}>Your XP</Text>
                <Text style={styles.xpValue}>+{xp} XP</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                />
              </View>

              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </View>

            <View style={styles.questionCard}>
              <View style={styles.questionTopRow}>
                <Image source={mascotSource} style={styles.mascotImage} />

                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>⚡ +10 XP</Text>
                  </View>
                  <View style={styles.badgePurple}>
                    <Text style={styles.badgeText}>🔥 Slang Mode</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.questionText}>{currentQuestion.question}</Text>

              <View style={styles.optionsWrapper}>
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index);
                  const isSelected = selectedOption === option;
                  const isAnswerCorrect = option === currentQuestion.correctAnswer;

                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        selectedOption && isAnswerCorrect && styles.correctOption,
                        selectedOption &&
                        isSelected &&
                        !isAnswerCorrect &&
                        styles.wrongOption,
                      ]}
                      onPress={() => handleOptionPress(option)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.optionLeft}>
                        <View style={styles.optionLetterCircle}>
                          <Text style={styles.optionLetter}>{optionLetter}</Text>
                        </View>
                        <Text style={styles.optionText}>{option}</Text>
                      </View>

                      {selectedOption && isAnswerCorrect && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color="#1F9D55"
                        />
                      )}

                      {selectedOption && isSelected && !isAnswerCorrect && (
                        <Ionicons name="close-circle" size={22} color="#D64545" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {showExplanation && (
                <View
                  style={[
                    styles.explanationBox,
                    isCorrect ? styles.explanationCorrect : styles.explanationWrong,
                  ]}
                >
                  <Text style={styles.resultText}>
                    {isCorrect ? "✅ Correct! +10 XP" : "❌ Wrong answer"}
                  </Text>
                  <Text style={styles.explanationText}>
                    {currentQuestion.explanation}
                  </Text>

                  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex === questions.length - 1
                        ? "See Results"
                        : "Next Question"}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  screenPadding: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  topProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileMini: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileMiniText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222",
    marginLeft: 8,
  },

  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
  },

  smallLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  nameText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "800",
  },

  xpCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },

  xpTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  xpTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111",
  },

  xpValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#32A67C",
  },

  progressBarBg: {
    height: 10,
    backgroundColor: "#E4E4E4",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#32A67C",
    borderRadius: 10,
  },

  progressText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "700",
  },

  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },

  questionTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  mascotImage: {
    width: 72,
    height: 72,
    resizeMode: "contain",
    marginRight: 12,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end",
  },

  badge: {
    backgroundColor: "#DDF8EC",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgePurple: {
    backgroundColor: "#EEE2FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#222",
  },

  questionText: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111",
    lineHeight: 33,
    marginBottom: 20,
  },

  optionsWrapper: {
    gap: 12,
  },

  optionButton: {
    backgroundColor: "#F7F7F8",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  optionLetterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionLetter: {
    fontSize: 14,
    fontWeight: "900",
    color: "#333",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    flexShrink: 1,
  },

  correctOption: {
    backgroundColor: "#E8F8EE",
    borderColor: "#63C98D",
  },

  wrongOption: {
    backgroundColor: "#FDEEEE",
    borderColor: "#E88A8A",
  },

  explanationBox: {
    marginTop: 20,
    borderRadius: 18,
    padding: 16,
  },

  explanationCorrect: {
    backgroundColor: "#EAF9F0",
  },

  explanationWrong: {
    backgroundColor: "#FFF1F1",
  },

  resultText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  explanationText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 14,
  },

  nextButton: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  nextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  resultContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },

  resultTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },

  resultEmoji: {
    fontSize: 56,
    marginBottom: 14,
  },

  resultTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  resultSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 22,
  },

  resultStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 12,
  },

  resultStatBox: {
    flex: 1,
    backgroundColor: "#F7F7F8",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  resultStatNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 4,
  },

  resultStatLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },

  primaryButton: {
    backgroundColor: "#32A67C",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    backgroundColor: "#EFEFEF",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#222",
    fontSize: 15,
    fontWeight: "800",
  },
});
