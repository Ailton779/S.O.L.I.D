import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function InfoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o SOLID</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que é o SOLID?</Text>
          <Text style={styles.cardText}>
            O SOLID (Sistema Óptico de Identificação e Localização de Serpentes no Interior do Domínio Semiárido) é um aplicativo mobile desenvolvido para auxiliar a população de Boa Viagem, CE, a identificar serpentes encontradas na região.
          </Text>
          <Text style={styles.cardText}>
            Através de inteligência artificial, o sistema analisa fotos de cobras e retorna informações sobre a espécie, se é peçonhenta e orientações de segurança — tudo em segundos, diretamente pelo celular.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como surgiu</Text>
          <Text style={styles.cardText}>
            O projeto nasceu como trabalho acadêmico na disciplina de Programação para Dispositivos Móveis do curso de Análise e Desenvolvimento de Sistemas do IFCE — Campus Boa Viagem, com o objetivo de aliar tecnologia à conservação da fauna local.
          </Text>
          <Text style={styles.cardText}>
            No interior nordestino, é comum que cobras sejam mortas por engano, sem que a pessoa saiba se são peçonhentas ou protegidas por lei. O SOLID surgiu para mudar isso — informar antes de agir.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como funciona</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepText}>Fotografe ou envie uma imagem da cobra pelo app</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
            <Text style={styles.stepText}>A imagem é analisada pela inteligência artificial Gemini</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
            <Text style={styles.stepText}>O sistema identifica a espécie e informa se é peçonhenta</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>4</Text></View>
            <Text style={styles.stepText}>Em caso de emergência, entre em contato com a Defesa Civil</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Desenvolvido por</Text>
          <View style={styles.devRow}>
            <Ionicons name="school-outline" size={16} color={colors.primary} />
            <Text style={styles.devText}>
              <Text style={styles.devName}>Professor Orientador:</Text> Johnny Rocha Crisostomo
            </Text>
          </View>
          <View style={styles.devRow}>
            <Ionicons name="code-slash-outline" size={16} color={colors.primary} />
            <Text style={styles.devText}>
              <Text style={styles.devName}>José Ailton Carneiro Alves Júnior</Text> — Desenvolvimento
            </Text>
          </View>
          <View style={styles.devRow}>
            <Ionicons name="document-text-outline" size={16} color={colors.primary} />
            <Text style={styles.devText}>
              <Text style={styles.devName}>Germano de Oliveira Moraes e Ronald Vieira Carneiro</Text> — Artigo Científico
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.devRow}>
            <Ionicons name="school-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.devTextSecondary}>IFCE — Campus Boa Viagem</Text>
          </View>
          <View style={styles.devRow}>
            <Ionicons name="phone-portrait-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.devTextSecondary}>Programação para Dispositivos Móveis</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  cardText: { fontSize: 13, color: colors.text, lineHeight: 20, marginBottom: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  stepBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNum: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  stepText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  devText: { fontSize: 13, color: colors.text },
  devName: { fontWeight: 'bold' },
  devTextSecondary: { fontSize: 13, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
});
