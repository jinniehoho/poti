import { StyleSheet, Text, View } from 'react-native';

type PlantDetailHeaderProps = {
  emoji: string;
  name: string;
  typeName: string;
};

export default function PlantDetailHeader({
  emoji,
  name,
  typeName,
}: PlantDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.emoji}>{emoji}</Text>

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.typeName}>{typeName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  emoji: {
    fontSize: 64,
  },

  name: {
    color: '#263125',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 14,
  },

  typeName: {
    color: '#6B7566',
    fontSize: 16,
    marginTop: 6,
  },
});