import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { avatarMap } from "./avatarData";
import { useProgress } from "./progressContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProgress();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState(profile.password);
  const [gender, setGender] = useState(profile.gender);
  const [avatarIndex, setAvatarIndex] = useState(profile.avatarIndex);
  const [showAvatarChoices, setShowAvatarChoices] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPassword(profile.password);
    setGender(profile.gender);
    setAvatarIndex(profile.avatarIndex);
  }, [profile]);

  const currentAvatars = avatarMap[gender];
  const selectedAvatar =
    currentAvatars[avatarIndex] || avatarMap.prefer_not_to_say[0];

  const handleGenderChange = (nextGender: keyof typeof avatarMap) => {
    setGender(nextGender);
    setAvatarIndex(0);
    setShowAvatarChoices(true);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name,
      email,
      password,
      gender,
      avatarIndex,
    });
    Alert.alert("Saved", "Your profile settings were updated.");
  };

  return (
    <LinearGradient
      colors={["#E3F3EE", "#F0EAF6", "#F6E7EE"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#222" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          <View style={styles.profileCard}>
            <Image source={selectedAvatar} style={styles.avatarCircle} />
            <Text style={styles.profileName}>{name || "User"}</Text>
            <Text style={styles.profileEmail}>{email || "No email available"}</Text>

            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={() => setShowAvatarChoices((prev) => !prev)}
            >
              <Text style={styles.changeAvatarText}>Change Avatar</Text>
            </TouchableOpacity>

            {showAvatarChoices ? (
              <View style={styles.avatarGrid}>
                {currentAvatars.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarOption,
                      avatarIndex === index && styles.avatarOptionActive,
                    ]}
                    onPress={() => setAvatarIndex(index)}
                  >
                    <Image source={avatar} style={styles.avatarOptionImage} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#8A8A8A"
            />

            <Text style={styles.fieldLabel}>Email ID</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#8A8A8A"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" && styles.genderButtonActive,
                ]}
                onPress={() => handleGenderChange("female")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "female" && styles.genderButtonTextActive,
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
                onPress={() => handleGenderChange("male")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "male" && styles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "prefer_not_to_say" && styles.genderButtonActive,
                ]}
                onPress={() => handleGenderChange("prefer_not_to_say")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "prefer_not_to_say" && styles.genderButtonTextActive,
                  ]}
                >
                  Prefer not to say
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Password</Text>
            <Text style={styles.passwordDots}>••••••••••</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Change password"
              placeholderTextColor="#8A8A8A"
              secureTextEntry
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#171717",
  },
  profileCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 14,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#171717",
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
  },
  changeAvatarButton: {
    backgroundColor: "#B8A4E3",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  changeAvatarText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  avatarGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginTop: 18,
  },
  avatarOption: {
    width: "47%",
    borderRadius: 18,
    backgroundColor: "#F8F6FC",
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarOptionActive: {
    borderColor: "#B8A4E3",
  },
  avatarOptionImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 28,
    padding: 22,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#3B3B3B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F6FC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F1F1F",
    marginBottom: 18,
  },
  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  genderButton: {
    backgroundColor: "#F8F6FC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E7DEF5",
  },
  genderButtonActive: {
    backgroundColor: "#B8A4E3",
    borderColor: "#B8A4E3",
  },
  genderButtonText: {
    color: "#4B4B4B",
    fontWeight: "700",
    fontSize: 13,
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  passwordDots: {
    backgroundColor: "#F8F6FC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    color: "#444",
    letterSpacing: 2,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 4,
    backgroundColor: "#32A67C",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
});
