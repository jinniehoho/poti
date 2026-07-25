import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export type WateringMode = 'automatic' | 'custom';

type WateringModeCardProps = {
  mode: WateringMode;
  recommendedDays: number | null;
  customDays: string;
  onChangeMode: (mode: WateringMode) => void;
  onChangeCustomDays: (days: string) => void;
};

export default function WateringModeCard({
  mode,
  recommendedDays,
  customDays,
  onChangeMode,
  onChangeCustomDays,
}: WateringModeCardProps) {
  const isAutomatic = mode === 'automatic';
  const isCustom = mode === 'custom';

  return (
    <View style={styles.formCard}>
      <Text style={styles.questionEmoji}>💧</Text>

      <Text style={styles.questionTitle}>
        물을 얼마나 자주 줄까요?
      </Text>

      <Text style={styles.questionDescription}>
        추천 주기를 사용하거나 직접 물주기 간격을 설정할 수 있어요.
      </Text>

      <View style={styles.optionList}>
        <Pressable
          onPress={() => onChangeMode('automatic')}
          style={({ pressed }) => [
            styles.optionItem,
            isAutomatic && styles.optionItemSelected,
            pressed && styles.optionItemPressed,
          ]}
        >
          <View style={styles.optionTextArea}>
            <Text style={styles.optionName}>자동 추천</Text>

            <Text style={styles.optionDescription}>
              {recommendedDays !== null
                ? `${recommendedDays}일마다 물주기를 추천해요.`
                : '식물 종류를 선택하면 추천 주기가 표시돼요.'}
            </Text>
          </View>

          <View
            style={[
              styles.radioOuter,
              isAutomatic && styles.radioOuterSelected,
            ]}
          >
            {isAutomatic && <View style={styles.radioInner} />}
          </View>
        </Pressable>

        <Pressable
          onPress={() => onChangeMode('custom')}
          style={({ pressed }) => [
            styles.optionItem,
            isCustom && styles.optionItemSelected,
            pressed && styles.optionItemPressed,
          ]}
        >
          <View style={styles.optionTextArea}>
            <Text style={styles.optionName}>직접 설정</Text>

            <Text style={styles.optionDescription}>
              내 환경에 맞는 물주기 간격을 입력할게요.
            </Text>
          </View>

          <View
            style={[
              styles.radioOuter,
              isCustom && styles.radioOuterSelected,
            ]}
          >
            {isCustom && <View style={styles.radioInner} />}
          </View>
        </Pressable>
      </View>

      {isCustom && (
        <View style={styles.customInputArea}>
          <Text style={styles.customInputLabel}>
            며칠마다 물을 줄까요?
          </Text>

          <View style={styles.customInputRow}>
            <TextInput
              value={customDays}
              onChangeText={(text) => {
                const numbersOnly = text.replace(/[^0-9]/g, '');
                onChangeCustomDays(numbersOnly);
              }}
              placeholder="7"
              placeholderTextColor="#A1A69D"
              keyboardType="number-pad"
              maxLength={3}
              style={styles.customInput}
            />

            <Text style={styles.daysText}>일마다</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#F3EDE3',
    borderRadius: 20,
    marginTop: 20,
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

  optionList: {
    marginTop: 20,
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#DED8CC',
    borderRadius: 14,
    marginBottom: 10,
    padding: 16,
  },

  optionItemSelected: {
    backgroundColor: '#EDF2E8',
    borderColor: '#6E7D68',
    borderWidth: 2,
  },

  optionItemPressed: {
    opacity: 0.75,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 12,
  },

  optionName: {
    color: '#263125',
    fontSize: 15,
    fontWeight: '800',
  },

  optionDescription: {
    color: '#858B81',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  radioOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#B7BCAF',
    borderRadius: 11,
  },

  radioOuterSelected: {
    borderColor: '#5C6B57',
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#5C6B57',
    borderRadius: 5,
  },

  customInputArea: {
    backgroundColor: '#FFFDF8',
    borderRadius: 14,
    marginTop: 4,
    padding: 16,
  },

  customInputLabel: {
    color: '#4F594C',
    fontSize: 13,
    fontWeight: '700',
  },

  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  customInput: {
    width: 88,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DED8CC',
    borderRadius: 10,
    color: '#263125',
    fontSize: 17,
    fontWeight: '800',
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlign: 'center',
  },

  daysText: {
    color: '#4F594C',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
});