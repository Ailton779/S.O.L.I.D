import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const steps = [
  { title: 'Mantenha a calma', desc: 'O panico acelera a circulacao e espalha o veneno mais rapido. Respire fundo e mantenha a vitima tranquila.' },
  { title: 'Imobilize o membro', desc: 'Mantenha o local da picada abaixo do nivel do coracao. Nao movimente desnecessariamente.' },
  { title: 'Nao faca torniquete', desc: 'Nao amarre, nao corte e nao tente sugar o veneno. Essas acoes pioram o quadro.' },
  { title: 'Anote o horario', desc: 'Registre a hora exata da picada e tente lembrar da aparencia da cobra para informar a equipe medica.' },
  { title: 'Retire adornos', desc: 'Retire aneis, pulseiras e calcados do membro afetado antes que o inchaço dificulte.' },
  { title: 'Busque socorro', desc: 'Ligue 193 imediatamente e va ao hospital mais proximo. O antipeconhento so pode ser aplicado por medicos.' },
];

const contacts = [
  { label: 'Corpo de Bombeiros', number: '193', desc: 'Canal geral de emergencia' },
  { label: 'Quartel de Caninde', number: '(85) 98510-0193', desc: 'Base regional — cobre Boa Viagem', raw: '85985100193' },
  { label: 'Policia Ambiental', number: '190', desc: 'Batalhao de Policia do Meio Ambiente' },
];

export default function FirstAidScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Primeiros Socorros</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.alertCard}>
          <Ionicons name="warning-outline" size={20} color={colors.danger} />
          <Text style={styles.alertText}>
            Em caso de picada de cobra, busque atendimento medico imediatamente. Nao tente tratar por conta propria.
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

        <Text style={styles.sectionTitle}>Contatos de emergencia</Text>

        {contacts.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={styles.contactCard}
            onPress={() => Linking.openURL(`tel:${c.raw || c.number}`)}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactDesc}>{c.desc}</Text>
            </View>
            <View style={styles.contactRight}>
              <Text style={styles.contactNumber}>{c.number}</Text>
              <Ionicons name="call-outline" size={14} color={colors.danger} />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  alertCard: {
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  contactDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contactRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.danger,
  },
});
