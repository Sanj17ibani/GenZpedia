import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { fetchAllSlangs } from "./services/api";
import { useProgress } from "./progressContext";
const HARDCODED_QUIZ = [
  { question: "What does 'GOAT' mean?", options: ["Worst player", "Greatest of all time", "Old person", "Random"], answer: 1 },
  { question: "What does 'Cap' mean?", options: ["Hat", "Lie", "Truth", "Money"], answer: 1 },
  { question: "What is 'Rizz'?", options: ["Style", "Charm", "Food", "Luck"], answer: 1 },
  { question: "What does 'Sus' mean?", options: ["Suspicious", "Awesome", "Boring", "Fast"], answer: 0 },
  { question: "What does 'Bet' mean?", options: ["Money", "No", "Okay/Agreed", "Stop"], answer: 2 }
];

const QUESTION_TIME = 10;

type MascotMood = "neutral" | "happy" | "angry";

const mascotImages = {
  neutral: require("../assets/images/chameleon-neutral.png"),
  happy: require("../assets/images/chameleon-happy-green.png"),
  angry: require("../assets/images/chameleon-angry-red.png"),
};

export default function QuizScreen() {
  const router = useRouter();
  const { addXp, addGoalProgress } = useProgress();

  const [questions, setQuestions] = useState<any[]>(HARDCODED_QUIZ);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [xp, setXp] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>("neutral");
  const [xpPopup, setXpPopup] = useState<number | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupTranslateY = useRef(new Animated.Value(0)).current;

  // Dynamic fetching removed as per request.

  const progressPercent = useMemo(() => {
    if (questions.length === 0) return 0;
    return ((currentQ + 1) / questions.length) * 100;
  }, [currentQ, questions]);

  const playSound = async (file: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if ("didJustFinish" in status && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Sound error:", error);
    }
  };

  const showXPPopup = (amount: number) => {
    setXpPopup(amount);
    popupOpacity.setValue(1);
    popupTranslateY.setValue(0);

    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(popupTranslateY, {
        toValue: -40,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setXpPopup(null));
  };

  const playCorrectAnimation = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -15,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const playWrongAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (selected !== null || showResult || gameOver) return;

    if (timeLeft <= 3 && timeLeft > 0) {
      playSound(require("../assets/sounds/tick.mp3"));
    }

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selected, showResult, gameOver]);

  const resetForNextQuestion = () => {
    setSelected(null);
    setTimeLeft(QUESTION_TIME);
    setMascotMood("neutral");
    scaleAnim.setValue(1);
    translateY.setValue(0);
    shakeAnim.setValue(0);
  };

  const moveToNextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((prev) => prev + 1);
      resetForNextQuestion();
    } else {
      addGoalProgress(25);
      setShowResult(true);
    }
  };

  const handleTimeout = () => {
    if (selected !== null) return;

    setSelected(-1);
    setStreak(0);
    setMascotMood("angry");
    playWrongAnimation();
    playSound(require("../assets/sounds/wrong.mp3"));

    const updatedLives = lives - 1;
    setLives(updatedLives);

    setTimeout(() => {
      if (updatedLives <= 0) {
        addGoalProgress(25);
        setGameOver(true);
      } else {
        moveToNextQuestion();
      }
    }, 1200);
  };

  const handleSelect = (index: number) => {
    if (selected !== null || questions.length === 0) return;

    setSelected(index);
    const question = questions[currentQ];
    const isCorrect = index === question.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));
      setMascotMood("happy");
      playCorrectAnimation();

      const gainedXP = 10 + Math.max(0, newStreak - 1) * 5;
      setXp((prev) => prev + gainedXP);
      addXp(gainedXP);
      showXPPopup(gainedXP);

      playSound(require("../assets/sounds/correct.mp3"));
    } else {
      setStreak(0);
      setMascotMood("angry");
      playWrongAnimation();

      const updatedLives = lives - 1;
      setLives(updatedLives);

      playSound(require("../assets/sounds/wrong.mp3"));
    }

    setTimeout(() => {
      const updatedLives = isCorrect ? lives : lives - 1;

      if (updatedLives <= 0) {
        addGoalProgress(25);
        setGameOver(true);
      } else {
        moveToNextQuestion();
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setLives(3);
    setXp(0);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(QUESTION_TIME);
    setStreak(0);
    setBestStreak(0);
    setMascotMood("neutral");
    setXpPopup(null);
    scaleAnim.setValue(1);
    translateY.setValue(0);
    shakeAnim.setValue(0);
  };

  if (gameOver) {
    return (
      <LinearGradient
        colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.center}>
          <Image
            source={mascotImages.angry}
            style={styles.endMascot}
            resizeMode="contain"
          />
          <Text style={styles.endTitle}>Game Over</Text>
          <Text style={styles.scoreText}>XP Earned: {xp}</Text>
          <Text style={styles.scoreText}>Best Streak: {bestStreak}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleRestart}>
            <Text style={styles.actionButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryActionText}>← Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showResult) {
    return (
      <LinearGradient
        colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.center}>
          <Image
            source={mascotImages.happy}
            style={styles.endMascot}
            resizeMode="contain"
          />
          <Text style={styles.endTitle}>Quiz Complete</Text>
          <Text style={styles.scoreText}>Total XP: {xp}</Text>
          <Text style={styles.scoreText}>Best Streak: {bestStreak}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleRestart}>
            <Text style={styles.actionButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryActionText}>← Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {xpPopup !== null && (
          <Animated.View
            style={[
              styles.xpPopup,
              {
                opacity: popupOpacity,
                transform: [{ translateY: popupTranslateY }],
              },
            ]}
          >
            <Text style={styles.xpPopupText}>+{xpPopup} XP ⚡</Text>
          </Animated.View>
        )}

        <View style={styles.topBar}>
          <Text style={styles.topText}>❤️ {lives}</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.topText}>⚡ {xp}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏳ {timeLeft}s</Text>
          <Text style={styles.metaText}>🔥 x{streak}</Text>
        </View>

        {loading || questions.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#B8A4E3" />
            <Text style={{ marginTop: 10 }}>Loading modules...</Text>
          </View>
        ) : (
          <>
            <View style={styles.questionSection}>
              <View style={{ flex: 1 }}>
                <Text style={styles.questionLabel}>
                  Question {currentQ + 1} / {questions.length}
                </Text>
                <Text style={styles.question}>{questions[currentQ].question}</Text>
              </View>

              <Animated.Image
                source={mascotImages[mascotMood]}
                style={[
                  styles.mascot,
                  {
                    transform: [
                      { scale: scaleAnim },
                      { translateY: translateY },
                      { translateX: shakeAnim },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </View>

            <View style={styles.optionsContainer}>
              {questions[currentQ].options.map((opt: any, i: number) => {
                let bgColor = "#fff";
                let borderColor = "#E5D3F3";

                if (selected !== null) {
                  if (i === questions[currentQ].answer) {
                    bgColor = "#BFF3CD";
                    borderColor = "#4CAF50";
                  } else if (i === selected) {
                    bgColor = "#FFD2D2";
                    borderColor = "#E35D5D";
                  }
                }

                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.option, { backgroundColor: bgColor, borderColor }]}
                    onPress={() => handleSelect(i)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.bottomHint}>
          <Text style={styles.bottomHintText}>
            Correct answers give 10 XP + streak bonus
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  topText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
    width: 60,
    textAlign: "center",
  },

  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#67C3A4",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  metaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  questionSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },

  questionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "600",
  },

  question: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
  },

  mascot: {
    width: 90,
    height: 90,
    marginLeft: 10,
  },

  optionsContainer: {
    padding: 20,
    gap: 12,
  },

  option: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
  },

  optionText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#222",
    fontSize: 16,
  },

  xpPopup: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    backgroundColor: "#B8A4E3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },

  xpPopupText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  bottomHint: {
    marginTop: 20,
    alignItems: "center",
  },

  bottomHintText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  endMascot: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },

  endTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111",
    marginBottom: 14,
  },

  scoreText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },

  actionButton: {
    backgroundColor: "#B8A4E3",
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 22,
  },

  actionButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  secondaryAction: {
    marginTop: 16,
  },

  secondaryActionText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
  },
});
