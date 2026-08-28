import { View, Text, Image, StyleSheet, StatusBar, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '../constants/colors';

const menuItems = [
  { id: 'Scanner', label: 'Identificar cobra', icon: '📷' },
  { id: 'Map', label: 'Mapa de deteccoes', icon: '🗺️' },
  { id: 'Species', label: 'Especies da regiao', icon: '👁️' },
  { id: 'FirstAid', label: 'Primeiros socorros', icon: '🏥' },
  { id: 'Info', label: 'Sobre o SOLID', icon: 'ℹ️' },
];

export default function HomeScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuItems_anim = menuItems.map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(16)).current,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(dotsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(dotsOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          Animated.stagger(80, menuItems_anim.map(item =>
            Animated.parallel([
              Animated.timing(item.opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(item.translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
            ])
          )).start();
        });
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>S.O.L.I.D</Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Sistema Optico de Identificacao e{'\n'}Localizacao de Serpentes no{'\n'}Interior do Dominio Semiarido
      </Animated.Text>

      <Animated.View style={[styles.dots, { opacity: dotsOpacity }]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <Animated.View
            key={item.id}
            style={{
              opacity: menuItems_anim[index].opacity,
              transform: [{ translateY: menuItems_anim[index].translateY }],
            }}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  menu: {
    width: '100%',
    gap: 8,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconText: {
    fontSize: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  menuArrow: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
