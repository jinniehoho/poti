import { StyleSheet, Text, TextInput, View } from 'react-native';

type PlantNameCardProps = {
  plantName: string;
  onChangePlantName: (name: string) => void;
};

export default function PlantNameCard({
  plantName,
  onChangePlantName,
}: PlantNameCardProps) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.questionEmoji}>🌱</Text>

      <Text style={styles.questionTitle}>
        이 식물을 뭐라고 부를까요?
      </Text>

      <Text style={styles.questionDescription}>
        구분하기 쉬운 이름이나 애칭을 입력해주세요.
      </Text>

      <TextInput
        value={plantName}
        onChangeText={onChangePlantName}
        placeholder="예: 초록이"
        placeholderTextColor="#A1A69D"
        style={styles.input}
        maxLength={30}
        autoCorrect={false}
        returnKeyType="done"
      />

      <Text style={styles.characterCount}>
        {plantName.length}/30
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#F3EDE3',
    borderRadius: 20,
    marginTop: 32,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },

  questionEmoji: {
    fontSize: 38,
  },

  questionTitle: {
    color: '#263125',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 14,
  },

  questionDescription: {
    color: '#747B70',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },

  input: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#DED8CC',
    borderRadius: 12,
    color: '#263125',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 22,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  characterCount: {
    color: '#8E948A',
    fontSize: 12,
    marginTop: 7,
    textAlign: 'right',
  },
});