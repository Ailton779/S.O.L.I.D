import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { snakes } from '../constants/snakes';

export default function SpeciesScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Espécies de Boa Viagem</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Serpentes encontradas na região da Caatinga</Text>

        {snakes.map(snake => (
          <TouchableOpacity
            key={snake.id}
            style={styles.card}
            onPress={() => setSelected(selected?.id === snake.id ? null : snake)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>{snake.name}</Text>
                <Text style={styles.cardScientific}>{snake.scientific}</Text>
              </View>
              <View style={styles.cardRight}>
                <View style={[styles.tag, snake.venomous ? styles.tagDanger : styles.tagSafe]}>
                  <Text style={[styles.tagText, snake.venomous ? styles.tagTextDanger : styles.tagTextSafe]}>
                    {snake.venomous ? 'Peçonhenta' : 'Inofensiva'}
                  </Text>
                </View>
                <Ionicons
                  name={selected?.id === snake.id ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>

            {selected?.id === snake.id && (
              <View style={styles.details}>
                <View style={styles.divider} />
                <Image
                  source={{ uri: snake.image }}
                  style={styles.snakeImage}
                  resizeMode="cover"
                />
                {snake.protected && (
                  <View style={styles.protectedBadge}>
                    <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                    <Text style={styles.protectedText}>{snake.protection_status}</Text>
                  </View>
                )}
                <Text style={styles.description}>{snake.description}</Text>

                <Text style={styles.sectionLabel}>Características</Text>
                {snake.characteristics.map((c, i) => (
                  <View key={i} style={styles.charRow}>
                    <Ionicons name="ellipse" size={6} color={colors.primary} />
                    <Text style={styles.charText}>{c}</Text>
                  </View>
                ))}

                {/* Exibe primeiros socorros sempre que existir, independente de ser venenosa */}
                {snake.first_aid && (
                  <View style={styles.firstAidBox}>
                    <View style={styles.firstAidHeader}>
                      <Ionicons name="medkit-outline" size={16} color={colors.danger} />
                      <Text style={styles.firstAidLabel}>Primeiros Socorros</Text>
                    </View>
                    <Text style={styles.firstAidText}>{snake.first_aid}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardTitles: { flex: 1, marginRight: 12 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  cardScientific: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  cardRight: { alignItems: 'flex-end' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagDanger: { backgroundColor: '#FDECEA' },
  tagSafe: { backgroundColor: '#E8F5ED' },
  tagText: { fontSize: 11, fontWeight: '600' },
  tagTextDanger: { color: colors.danger },
  tagTextSafe: { color: colors.safe },
  details: { marginTop: 12 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  snakeImage: { width: '100%', height: 180, borderRadius: 10, marginBottom: 12 },
  protectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  protectedText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  description: { fontSize: 13, color: colors.text, lineHeight: 20, marginBottom: 12 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  charRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  charText: { fontSize: 13, color: colors.text },
  firstAidBox: { backgroundColor: '#FDECEA', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: colors.danger, marginTop: 8 },
  firstAidHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  firstAidLabel: { fontSize: 13, fontWeight: 'bold', color: colors.danger },
  firstAidText: { fontSize: 12, color: colors.text, lineHeight: 18 },
});
