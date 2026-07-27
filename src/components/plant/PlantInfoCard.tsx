import { StyleSheet, Text, View } from 'react-native';

type PlantInfoCardProps = {
  intervalDays: number;
  statusLabel: string;
  lastWateredLabel: string;
  nextWateringLabel: string;
};

type InfoRowProps = {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
};

function InfoRow({
  icon,
  label,
  value,
  isLast = false,
}: InfoRowProps) {
  return (
    <View
      style={[
        styles.infoRow,
        isLast && styles.lastInfoRow,
      ]}
    >
      <Text style={styles.infoIcon}>{icon}</Text>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function PlantInfoCard({
  intervalDays,
  statusLabel,
  lastWateredLabel,
  nextWateringLabel,
}: PlantInfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <InfoRow
        icon="🌞"
        label="물주기"
        value={`${intervalDays}일마다`}
      />

      <InfoRow
        icon="💧"
        label="현재 상태"
        value={statusLabel}
      />

      <InfoRow
        icon="🕒"
        label="마지막 물주기"
        value={lastWateredLabel}
      />

      <InfoRow
        icon="📅"
        label="다음 물주기"
        value={nextWateringLabel}
        isLast
      />
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  lastInfoRow: {
    marginBottom: 0,
  },

  infoIcon: {
    width: 34,
    fontSize: 26,
    marginRight: 16,
    textAlign: 'center',
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: '#8A9584',
    fontSize: 13,
  },

  infoValue: {
    color: '#283526',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
});