import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './constants/colors';

import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import MapScreen from './screens/MapScreen';
import SpeciesScreen from './screens/SpeciesScreen';
import InfoScreen from './screens/InfoScreen';
import FirstAidScreen from './screens/FirstAidScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Species" component={SpeciesScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="FirstAid" component={FirstAidScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
