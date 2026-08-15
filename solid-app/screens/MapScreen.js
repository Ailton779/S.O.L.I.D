import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { colors } from '../constants/colors';

const detections = [
  { id: 1, species: 'Jararaca-da-seca', local: 'Zona Rural, Boa Viagem', date: '14/08/2026', venomous: true },
  { id: 2, species: 'Cascavel', local: 'Sitio Lagoa Seca, Boa Viagem', date: '10/08/2026', venomous: true },
  { id: 3, species: 'Coral-falsa', local: 'Centro, Boa Viagem', date: '07/08/2026', venomous: false },
  { id: 4, species: 'Jiboia', local: 'Distrito Boa Viagem', date: '03/08/2026', venomous: false },
  { id: 5, species: 'Cobra-cipo', local: 'Zona Rural, Boa Viagem', date: '01/08/2026', venomous: false },
];

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Deteccoes em Boa Viagem</Text>
        <Text style={styles.subtitle}>Registros recentes no municipio</Text>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>Mapa de calor — Boa Viagem, CE</Text>
        <Text style={styles.mapSub}>Integracao com localizacao em desenvolvimento</Text>
      </View>

      <Text style={styles.sectionTitle}>Ultimas deteccoes</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {detections.map(d => (
          <View key={d.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardSpecies}>{d.species}</Text>
              <Text style={styles.cardCity}>{d.local} — {d.date}</Text>
            </View>
            <View style={[styles.tag, d.venomous ? styles.tagDanger : styles.tagSafe]}>
              <Text style={[styles.tagText, d.venomous ? styles.tagTextDanger : styles.tagTextSafe]}>
                {d.venomous ? 'Peconhenta' : 'Inofensiva'}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mapPlaceholder: {
    backgroundColor: colors.cardSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginBottom: 20,
    gap: 6,
  },
  mapIcon: {
    fontSize: 40,
  },
  mapText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  mapSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardSpecies: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  cardCity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagDanger: {
    backgroundColor: '#FDECEA',
  },
  tagSafe: {
    backgroundColor: '#E8F5ED',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagTextDanger: {
    color: colors.danger,
  },
  tagTextSafe: {
    color: colors.safe,
  },
});
