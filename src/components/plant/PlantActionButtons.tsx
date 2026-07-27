import { Pressable, StyleSheet, Text, View } from 'react-native';

type PlantActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function PlantActionButtons({
  onEdit,
  onDelete,
}: PlantActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={onEdit}
        style={({ pressed }) => [
          styles.editButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.editButtonText}>
          정보 수정
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.deleteButtonText}>
          식물 삭제
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  editButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#355E3B',
    borderRadius: 18,
    marginTop: 26,
    paddingVertical: 16,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  deleteButton: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7DDD2',
    borderRadius: 18,
    marginTop: 14,
    paddingVertical: 16,
  },

  deleteButtonText: {
    color: '#6B7566',
    fontSize: 16,
    fontWeight: '700',
  },

  pressedButton: {
    opacity: 0.7,
  },
});