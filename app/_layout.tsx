import ConsentModal from "@/components/ui/common/ConsentModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const scheme = useColorScheme();
  const [consentVisible, setConsentVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const accepted = await AsyncStorage.getItem("consent.accepted");
      if (!accepted) setConsentVisible(true);
    })();
  }, []);

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <ConsentModal
        visible={consentVisible}
        onAccept={async () => {
          await AsyncStorage.setItem("consent.accepted", "true");
          setConsentVisible(false);
        }}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
