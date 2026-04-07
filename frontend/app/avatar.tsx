import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";

const avatars = {
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

export default function AvatarSelection() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  const [gender, setGender] = useState<"female" | "male" | "prefer_not_to_say">(
    "prefer_not_to_say"
  );
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const currentAvatars = avatars[gender];

  const handleContinue = () => {
    if (selectedAvatar === null) {
      Alert.alert("Select Avatar", "Please choose an avatar.");
      return;
    }

    router.push({
      pathname: "/home",
      params: {
        name: String(name || "User"),
        gender,
        avatarIndex: String(selectedAvatar),
      },
    });
  };

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Choose Your Avatar</Text>
        <Text style={styles.subtitle}>
          Select your gender and avatar to personalize your profile
        </Text>

        <View style={styles.genderContainer}>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "female" && styles.genderButtonActive,
              ]}
              onPress={() => {
                setGender("female");
                setSelectedAvatar(null);
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "female" && styles.genderTextActive,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "male" && styles.genderButtonActive,
              ]}
              onPress={() => {
                setGender("male");
                setSelectedAvatar(null);
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "male" && styles.genderTextActive,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.genderButton,
              styles.preferButton,
              gender === "prefer_not_to_say" && styles.genderButtonActive,
            ]}
            onPress={() => {
              setGender("prefer_not_to_say");
              setSelectedAvatar(null);
            }}
          >
            <Text
              style={[
                styles.genderText,
                gender === "prefer_not_to_say" && styles.genderTextActive,
              ]}
            >
              Prefer not to say
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarGrid}>
          {currentAvatars.map((avatar, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.avatarCard,
                selectedAvatar === index && styles.avatarCardSelected,
              ]}
              onPress={() => setSelectedAvatar(index)}
            >
              <Image source={avatar} style={styles.avatarImage} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  genderContainer: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center",
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  genderButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  preferButton: {
    alignSelf: "center",
  },
  genderButtonActive: {
    backgroundColor: "#B8A4E3",
    borderColor: "#B8A4E3",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  genderTextActive: {
    color: "#fff",
  },
  avatarGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    marginBottom: 30,
  },
  avatarCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 3,
  },
  avatarCardSelected: {
    borderColor: "#B8A4E3",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  continueButton: {
    backgroundColor: "#B8A4E3",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backText: {
    marginTop: 20,
    color: "#555",
    fontSize: 15,
  },
});