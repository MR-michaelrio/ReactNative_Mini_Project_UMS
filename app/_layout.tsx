import { DarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  const customTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#007BFF",
      background: "#FFFFFF",
      surface: "#FFFFFF",
      text: "#000000",
    },
  };

  return (
    <PaperProvider theme={customTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : NavDefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#007BFF" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            contentStyle: { backgroundColor: "#f5f6fa" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "🏠 Home" }} />
          <Stack.Screen name="pelanggan" options={{ title: "👤 Pelanggan" }} />
          <Stack.Screen name="barang" options={{ title: "📦 Barang" }} />
          <Stack.Screen name="penjualan" options={{ title: "🧾 Penjualan" }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </PaperProvider>
  );
}
