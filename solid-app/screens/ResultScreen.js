import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { colors } from '../constants/colors';

export default function ResultScreen({ navigation, route }) {
  const { snake, image } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.backButton}>← Escanear novamente</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {image && (
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{snake.name}</Text>
          <Text style={styles.scientific}>{snake.scientific}</Text>
        </View>

        <View style={[styles.badge, snake.venomous ? styles.badgeDanger : styles.badgeSafe]}>
          <Text style={styles.badgeText}>
            {snake.venomous ? 'PECОНHENTA' : 'NAO PECОНHENTA'}
          </Text>
        </View>

        {snake.venomous && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Tipo de veneno</Text>
            <Text style={styles.infoValue}>{snake.venom_type}</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Status de proteção</Text>
          <Text style={[styles.infoValue, snake.protected && { color: colors.primary }]}>
            {snake.protection_status}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Sobre a espécie</Text>
          <Text style={styles.infoText}>{snake.description}</Text>
        </View>

        {snake.venomous && snake.first_aid && (
          <View style={[styles.infoCard, styles.firstAidCard]}>
            <Text style={styles.firstAidLabel}>Primeiros Socorros</Text>
            <Text style={styles.infoText}>{snake.first_aid}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  nameContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  scientific: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  badge: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeDanger: {
    backgroundColor: colors.danger,
  },
  badgeSafe: {
    backgroundColor: colors.safe,
  },
  badgeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  firstAidCard: {
    borderLeftColor: colors.danger,
  },
  firstAidLabel: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
