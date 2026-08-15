import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../constants/colors';

const firstAidSteps = [
  { step: '1', title: 'Mantenha a calma', desc: 'O panico acelera a circulacao e espalha o veneno mais rapido.' },
  { step: '2', title: 'Imobilize o membro', desc: 'Mantenha o local da picada abaixo do nivel do coracao.' },
  { step: '3', title: 'Nao faca torniquete', desc: 'Nao amarre, nao corte e nao tente sugar o veneno.' },
  { step: '4', title: 'Anote o horario', desc: 'Registre a hora da picada e tente lembrar da aparencia da cobra.' },
  { step: '5', title: 'Busque socorro', desc: 'Ligue 193 e va ao hospital mais proximo com urgencia.' },
];

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sobre o SOLID</Text>
          <Text style={styles.subtitle}>Sistema Optico de Identificacao e Localizacao de Serpentes no Interior do Dominio Semiarido</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que e o SOLID?</Text>
          <Text style={styles.cardText}>
            O SOLID e um aplicativo desenvolvido por estudantes do IFCE — Campus Boa Viagem para auxiliar a populacao local a identificar serpentes encontradas na regiao, informando se sao peconhentas e se estao protegidas pelo ICMBio.
          </Text>
          <Text style={styles.cardText}>
            O objetivo principal nao e apenas tecnologico, mas educativo e de conservacao: muitas cobras inofensivas sao mortas por engano no interior nordestino. O SOLID quer mudar isso.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Primeiros Socorros — Picada de cobra</Text>

        {firstAidSteps.map(item => (
          <View key={item.step} style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{item.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Contatos de Emergencia</Text>

        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('tel:193')}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Corpo de Bombeiros</Text>
            <Text style={styles.contactDesc}>Canal geral de emergencia — CBMCE</Text>
          </View>
          <Text style={styles.contactNumber}>193</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('tel:85985100193')}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Quartel de Caninde</Text>
            <Text style={styles.contactDesc}>Base regional — cobre Boa Viagem</Text>
          </View>
          <Text style={styles.contactNumber}>(85) 98510-0193</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('tel:190')}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Policia Ambiental</Text>
            <Text style={styles.contactDesc}>Batalhao de Policia do Meio Ambiente</Text>
          </View>
          <Text style={styles.contactNumber}>190</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Desenvolvido por</Text>
          <Text style={styles.cardText}>Ailton e Germano — Desenvolvimento</Text>
          <Text style={styles.cardText}>Ronald — Artigo Cientifico</Text>
          <Text style={styles.cardText}>IFCE — Campus Boa Viagem</Text>
          <Text style={styles.cardText}>Disciplina: Programacao para Dispositivos Moveis</Text>
        </View>

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
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
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
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
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
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  contactDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contactNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.danger,
  },
});
