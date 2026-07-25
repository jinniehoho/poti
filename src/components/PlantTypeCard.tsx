import { Pressable, StyleSheet, Text, View } from 'react-native';

export type PlantTypeOption = {
  id: number;
  name: string;
  scientificName: string;
  emoji: string;
  defaultIntervalDays: number;
};

type PlantTypeCardProps = {
  options: PlantTypeOption[];
  selectedPlantTypeId: number | null;
  onSelectPlantType: (plantTypeId: number) => void;
};

export default function PlantTypeCard({
  options,
  selectedPlantTypeId,
  onSelectPlantType,
}: PlantTypeCardProps) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.questionEmoji}>🪴</Text>

      <Text style={styles.questionTitle}>
        어떤 식물인가요?
      </Text>

      <Text style={styles.questionDescription}>
        식물 종류를 선택하면 기본 물주기 주기를 추천해드려요.
      </Text>

      <View style={styles.optionList}>
        {options.map((option) => {
          const isSelected = selectedPlantTypeId === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelectPlantType(option.id)}
              style={({ pressed }) => [
                styles.optionItem,
                isSelected && styles.optionItemSelected,
                pressed && styles.optionItemPressed,
              ]}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
              </View>

              <View style={styles.optionTextArea}>
                <Text style={styles.optionName}>{option.name}</Text>

                <Text style={styles.optionScientificName}>
                  {option.scientificName}
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}
      </View>
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
    padding: 14,
  },

  optionItemSelected: {
    backgroundColor: '#EDF2E8',
    borderColor: '#6E7D68',
    borderWidth: 2,
  },

  optionItemPressed: {
    opacity: 0.75,
  },

  optionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: '#F6F6EF',
    borderRadius: 12,
  },

  optionEmoji: {
    fontSize: 27,
  },

  optionTextArea: {
    flex: 1,
    marginLeft: 13,
  },

  optionName: {
    color: '#263125',
    fontSize: 15,
    fontWeight: '800',
  },

  optionScientificName: {
    color: '#858B81',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },

  radioOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#B7BCAF',
    borderRadius: 11,
    marginLeft: 10,
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
});