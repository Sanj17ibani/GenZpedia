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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllSlangs } from "./services/api";
import { useProgress } from "./progressContext";

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

const mascotImages = {
  default: require("../assets/images/mascot-default.png"),
  correct: require("../assets/images/mascot-mewing.png"),
  wrong: require("../assets/images/mascot-thumbsdown.png"),
};


export default function SlangItInScreen() {
  const router = useRouter();
  const { name, gender, avatarIndex } = useLocalSearchParams();
  const { addXp, addGoalProgress } = useProgress();
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
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];

  const isCorrect = useMemo(() => {
    if (!selectedOption || !currentQuestion) return false;
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

    const loadQuestions = async () => {
      try {
        const data = await fetchAllSlangs();
        if (data && data.length > 0) {
          const fetchedSlangs = data.sort(() => 0.5 - Math.random());
          const generated = fetchedSlangs.slice(0, 5).map((slang: any) => {
            const word = slang.word;
            const example = slang.example && slang.example.length > 0 ? slang.example[0] : `This is so ${word}`;

            let questionText = example.replace(new RegExp(`\\b${word}\\b`, 'gi'), '___');
            if (questionText === example) {
              questionText = example.replace(new RegExp(word, 'gi'), '___');
            }
            if (questionText === example) {
              questionText = `What is a common scenario for ___ (meaning: ${slang.meaning})?`;
            }

            const others = data.filter((s: any) => s._id !== slang._id);
            const falseOptions = others.sort(() => 0.5 - Math.random()).slice(0, 3).map((s: any) => s.word);
            while (falseOptions.length < 3) {
              falseOptions.push(Math.random().toString(36).substring(7));
            }
            const options = [...falseOptions, word].sort(() => 0.5 - Math.random());

            return {
              question: `"${questionText}"`,
              options,
              correctAnswer: word,
              explanation: slang.meaning,
            };
          });
          setQuestions(generated.length > 0 ? generated : [{
            question: "“She thinks he likes her… that’s so ___”",
            options: ["valid", "delulu", "mid", "sus"],
            correctAnswer: "delulu",
            explanation: "Means delusional.",
          }]);
        } else {
          setQuestions([{
            question: "“She thinks he likes her… that’s so ___”",
            options: ["valid", "delulu", "mid", "sus"],
            correctAnswer: "delulu",
            explanation: "Means delusional.",
          }]);
        }
      } catch (err) {
        setQuestions([{
          question: "“She thinks he likes her… that’s so ___”",
          options: ["valid", "delulu", "mid", "sus"],
          correctAnswer: "delulu",
          explanation: "Means delusional.",
        }]);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();

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
      addGoalProgress(25);
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
                  <Image
                    source={selectedProfileImage}
                    style={styles.profileImage}
                  />
                  <Text style={styles.profileMiniText}>{displayName}</Text>
                </View>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultEmoji}>🔥</Text>
                <Text style={styles.resultTitle}>Slang Mastered!</Text>
                <Text style={styles.resultSubtitle}>
                  You filled in the blanks like a true icon.
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
                  <Text style={styles.secondaryButtonText}>
                    Back to Practice
                  </Text>
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
                  <Text style={styles.smallLabel}>Slang It In!</Text>
                  <Text style={styles.nameText}>{displayName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>Ready to Slay ✨</Text>
            </View>

            <View style={styles.xpCard}>
              <View style={styles.xpTopRow}>
                <Text style={styles.xpTitle}>Your XP</Text>
                <Text style={styles.xpValue}>+{xp} XP</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </View>

            {loading || questions.length === 0 ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading questions...</Text>
              </View>
            ) : (
              <View style={styles.questionCard}>
                <View style={styles.questionTopRow}>
                  <Image source={mascotSource} style={styles.mascotImage} />

                  <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>⚡ +10 XP</Text>
                    </View>
                    <View style={styles.badgePurple}>
                      <Text style={styles.badgeText}>📝 Fill Mode</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.questionText}>{currentQuestion.question}</Text>

                <View style={styles.optionsWrapper}>
                  {currentQuestion.options.map((option: string, index: number) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected = selectedOption === option;
                    const isAnswerCorrect = option === currentQuestion.correctAnswer;

                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          selectedOption &&
                          isAnswerCorrect &&
                          styles.correctOption,
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
                          <Ionicons
                            name="close-circle"
                            size={22}
                            color="#D64545"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {showExplanation && (
                  <View
                    style={[
                      styles.explanationBox,
                      isCorrect
                        ? styles.explanationCorrect
                        : styles.explanationWrong,
                    ]}
                  >
                    <Text style={styles.resultText}>
                      {isCorrect ? "✅ Correct! +10 XP" : "❌ Wrong answer"}
                    </Text>
                    <Text style={styles.answerText}>
                      Answer: {currentQuestion.correctAnswer}
                    </Text>
                    <Text style={styles.explanationText}>
                      {currentQuestion.explanation}
                    </Text>

                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={handleNext}
                    >
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
            )}
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
    marginBottom: 16,
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

  quoteCard: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: "center",
  },

  quoteText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#6E44B8",
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
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    lineHeight: 32,
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

  answerText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333",
    marginBottom: 6,
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
