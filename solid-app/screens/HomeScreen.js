import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { useEffect } from 'react';
import { colors } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Scanner');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>S.O.L.I.D</Text>
        <Text style={styles.subtitle}>
          Sistema Optico de Identificacao e{'\n'}
          Localizacao de Serpentes no{'\n'}
          Interior do Dominio Semiarido
        </Text>
      </View>
      <Text style={styles.loading}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loading: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
