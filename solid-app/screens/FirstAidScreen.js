import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const steps = [
  { title: 'Mantenha a calma', desc: 'O pânico acelera a circulação e espalha o veneno mais rápido. Respire fundo e mantenha a vítima tranquila.' },
  { title: 'Imobilize o membro', desc: 'Mantenha o local da picada abaixo do nível do coração. Não movimente desnecessariamente.' },
  { title: 'Não faça torniquete', desc: 'Não amarre, não corte e não tente sugar o veneno. Essas ações pioram o quadro.' },
  { title: 'Retire adornos', desc: 'Retire anéis, pulseiras e calçados do membro afetado antes que o inchaço dificulte.' },
  { title: 'Anote o horário', desc: 'Registre a hora exata da picada e tente lembrar da aparência da cobra para informar a equipe médica.' },
  { title: 'Busque socorro', desc: 'Entre em contato com a Defesa Civil ou vá ao hospital mais próximo imediatamente. O antipeçonhento só pode ser aplicado por médicos.' },
];

const contacts = [
  {
    label: 'Defesa Civil — Boa Viagem',
    number: '(88) 9281-6910',
    raw: '88928169100',
    desc: 'Telefone / WhatsApp de Emergência',
    icon: 'shield-outline',
  },
  {
    label: 'Defesa Civil — Alternativo',
    number: '(88) 98188-7477',
    raw: '88981887477',
    desc: 'Telefone alternativo',
    icon: 'call-outline',
  },
];

export default function FirstAidScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Primeiros Socorros</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.alertCard}>
          <Ionicons name="warning-outline" size={20} color={colors.danger} />
          <Text style={styles.alertText}>
            Em caso de picada de cobra, busque atendimento médico imediatamente. Não tente tratar por conta própria.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>O que fazer</Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Contato de Emergência</Text>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Atendimento presencial: segunda a quinta-feira, das 8h às 12h.{'\n'}
            E-mail: defesacivil.pmbv@boaviagem.ce.gov.br
          </Text>
        </View>

        {contacts.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={styles.contactCard}
            onPress={() => Linking.openURL(`tel:${c.raw}`)}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIcon}>
                <Ionicons name={c.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactDesc}>{c.desc}</Text>
              </View>
            </View>
            <Text style={styles.contactNumber}>{c.number}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  alertCard: { backgroundColor: '#FDECEA', borderRadius: 12, borderLeftWidth: 3, borderLeftColor: colors.danger, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 20 },
  alertText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  stepCard: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 8, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumber: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  stepDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  infoCard: { backgroundColor: colors.cardSecondary, borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginBottom: 12 },
  infoText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  contactCard: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, borderLeftWidth: 3, borderLeftColor: colors.primary, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contactLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  contactIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.cardSecondary, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  contactDesc: { fontSize: 11, color: colors.textSecondary },
  contactNumber: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
});
