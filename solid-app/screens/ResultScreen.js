import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const contacts = [
  { label: 'Defesa Civil — Boa Viagem', number: '(88) 9281-6910', raw: '88928169100', desc: 'WhatsApp / Emergência' },
  { label: 'Defesa Civil — Alternativo', number: '(88) 98188-7477', raw: '88981887477', desc: 'Telefone alternativo' },
];

export default function ResultScreen({ navigation, route }) {
  const { snake, image, confidence } = route.params;

  if (!snake) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Erro</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={styles.infoText}>Dados da cobra não encontrados.</Text>
      </View>
    );
  }

  const getConfidenceColor = (value) => {
    if (value >= 0.85) return colors.safe;
    if (value >= 0.65) return '#E6A817';
    return colors.danger;
  };

  const getConfidenceLabel = (value) => {
    if (value >= 0.85) return 'Alta confiança';
    if (value >= 0.65) return 'Confiança moderada';
    return 'Baixa confiança';
  };

  // Verifica se é uma cobra-verde (Philodryas)
  const isGreenSnake = snake.scientific && snake.scientific.includes('Philodryas');

  // Exibir primeiros socorros se for venenosa OU for cobra-verde
  const shouldShowFirstAid = snake.venomous || isGreenSnake;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {image && (
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{snake.name || 'Espécie não identificada'}</Text>
          <Text style={styles.scientific}>{snake.scientific || 'N/A'}</Text>
        </View>

        <View style={[styles.badge, snake.venomous ? styles.badgeDanger : styles.badgeSafe]}>
          <Ionicons
            name={snake.venomous ? 'warning-outline' : 'checkmark-circle-outline'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.badgeText}>
            {snake.venomous ? 'PEÇONHENTA' : 'NÃO PEÇONHENTA'}
          </Text>
        </View>

        {confidence && (
          <View style={[styles.infoCard, { borderLeftColor: getConfidenceColor(confidence) }]}>
            <Text style={styles.infoLabel}>Confiança da análise</Text>
            <View style={styles.confidenceRow}>
              <Text style={styles.infoValue}>{getConfidenceLabel(confidence)}</Text>
              <Text style={[styles.confidencePercent, { color: getConfidenceColor(confidence) }]}>
                {Math.round(confidence * 100)}%
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Contato de Emergência</Text>

        {contacts.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={styles.contactCard}
            onPress={() => Linking.openURL(`tel:${c.raw}`)}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIcon}>
                <Ionicons name="shield-outline" size={16} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactDesc}>{c.desc}</Text>
              </View>
            </View>
            <Text style={styles.contactNumber}>{c.number}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Status de proteção</Text>
          <View style={styles.protectionRow}>
            {snake.protected && (
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            )}
            <Text style={[styles.infoValue, snake.protected && { color: colors.primary }]}>
              {snake.protection_status || 'Não informado'}
            </Text>
          </View>
        </View>

        {snake.venomous && snake.venom_type && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Tipo de veneno</Text>
            <Text style={styles.infoValue}>{snake.venom_type}</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Sobre a espécie</Text>
          <Text style={styles.infoText}>{snake.description || 'Sem descrição disponível.'}</Text>
        </View>

        {shouldShowFirstAid && snake.first_aid && (
          <View style={[styles.infoCard, styles.firstAidCard]}>
            <View style={styles.firstAidHeader}>
              <Ionicons name="medkit-outline" size={16} color={colors.danger} />
              <Text style={styles.firstAidLabel}>Primeiros Socorros</Text>
            </View>
            <Text style={styles.infoText}>{snake.first_aid}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.scanAgainBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
          <Text style={styles.scanAgainText}>Identificar outra cobra</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24 },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  image: { width: '100%', height: 220, borderRadius: 16, marginBottom: 16 },
  nameContainer: { marginBottom: 12 },
  name: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  scientific: { fontSize: 14, color: colors.textSecondary, fontStyle: 'italic' },
  badge: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  badgeDanger: { backgroundColor: colors.danger },
  badgeSafe: { backgroundColor: colors.safe },
  badgeText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 8, marginTop: 4 },
  infoCard: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: colors.primary, borderWidth: 0.5, borderColor: colors.border },
  infoLabel: { fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  infoValue: { fontSize: 15, color: colors.text, fontWeight: '600' },
  infoText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  confidencePercent: { fontSize: 18, fontWeight: 'bold' },
  protectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  firstAidCard: { borderLeftColor: colors.danger },
  firstAidHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  firstAidLabel: { fontSize: 13, fontWeight: 'bold', color: colors.danger },
  contactCard: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, borderLeftWidth: 3, borderLeftColor: colors.primary, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contactLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  contactIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.cardSecondary, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 1 },
  contactDesc: { fontSize: 11, color: colors.textSecondary },
  contactNumber: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
  scanAgainBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 },
  scanAgainText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
