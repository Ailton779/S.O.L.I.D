import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { colors } from '../constants/colors';
import { snakes } from '../constants/snakes';

export default function SpeciesScreen() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Especies de Boa Viagem</Text>
        <Text style={styles.subtitle}>Serpentes encontradas na regiao</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
              <View style={[styles.tag, snake.venomous ? styles.tagDanger : styles.tagSafe]}>
                <Text style={[styles.tagText, snake.venomous ? styles.tagTextDanger : styles.tagTextSafe]}>
                  {snake.venomous ? 'Peconhenta' : 'Inofensiva'}
                </Text>
              </View>
            </View>

            {selected?.id === snake.id && (
              <View style={styles.details}>
                <View style={styles.divider} />
                {snake.venomous && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tipo de veneno</Text>
                    <Text style={styles.detailValue}>{snake.venom_type}</Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Protecao ICMBio</Text>
                  <Text style={[styles.detailValue, snake.protected && { color: colors.primary }]}>
                    {snake.protection_status}
                  </Text>
                </View>
                <Text style={styles.description}>{snake.description}</Text>
                {snake.venomous && snake.first_aid && (
                  <View style={styles.firstAidBox}>
                    <Text style={styles.firstAidLabel}>Primeiros Socorros</Text>
                    <Text style={styles.firstAidText}>{snake.first_aid}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitles: {
    flex: 1,
    marginRight: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  cardScientific: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  details: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  firstAidBox: {
    backgroundColor: '#FDECEA',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  firstAidLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 4,
  },
  firstAidText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
});
