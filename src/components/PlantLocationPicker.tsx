import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '../preferences/LanguageContext';
import type { PlantLocation } from '../services/plantLocationService';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import {
  AppText as Text,
  AppTextInput as TextInput,
} from '../theme/Typography';
import FormSectionHeader from './FormSectionHeader';

type PlantLocationPickerProps = {
  locations: PlantLocation[];
  selectedLocationId: string | null;
  isLoading?: boolean;
  loadError?: string | null;
  onSelect: (locationId: string | null) => void;
  onAdd: (name: string) => Promise<void>;
  onDelete: (locationId: string) => Promise<void>;
};

export default function PlantLocationPicker({
  locations,
  selectedLocationId,
  isLoading = false,
  loadError = null,
  onSelect,
  onAdd,
  onDelete,
}: PlantLocationPickerProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newLocationName, setNewLocationName] =
    useState('');
  const [actionError, setActionError] =
    useState<string | null>(null);
  const [busyLocationId, setBusyLocationId] =
    useState<string | null>(null);

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId,
  );

  const handleSelect = (locationId: string | null) => {
    onSelect(locationId);
    setActionError(null);
    setIsOpen(false);
  };

  const handleAdd = async () => {
    const name = newLocationName.trim();

    if (!name) {
      setActionError(t('location.nameRequired'));
      return;
    }

    try {
      setBusyLocationId('new');
      setActionError(null);
      await onAdd(name);
      setNewLocationName('');
      setIsAdding(false);
    } catch (error) {
      setActionError(
        error instanceof Error &&
          error.message === 'DUPLICATE_LOCATION_NAME'
          ? t('location.duplicateError')
          : t('location.addError'),
      );
    } finally {
      setBusyLocationId(null);
    }
  };

  const handleDelete = async (locationId: string) => {
    try {
      setBusyLocationId(locationId);
      setActionError(null);
      await onDelete(locationId);

      if (selectedLocationId === locationId) {
        onSelect(null);
      }
    } catch {
      setActionError(t('location.deleteError'));
    } finally {
      setBusyLocationId(null);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <FormSectionHeader
          description={t('location.description')}
          title={t('location.title')}
        />

        <Pressable
          accessibilityLabel={t(
            'location.selectAccessibility',
          )}
          accessibilityRole="button"
          disabled={isLoading}
          onPress={() => {
            setActionError(null);
            setIsOpen(true);
          }}
          style={({ pressed }) => [
            styles.selector,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.selectorText}>
            {isLoading
              ? t('location.loading')
              : selectedLocation?.name ??
                t('location.unset')}
          </Text>
          <Text style={styles.chevron}>⌄</Text>
        </Pressable>

        {loadError ? (
          <Text style={styles.inlineError}>{loadError}</Text>
        ) : null}
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios' ? 'padding' : undefined
          }
          style={styles.modalRoot}
        >
          <Pressable
            accessibilityLabel={t(
              'location.closeAccessibility',
            )}
            onPress={() => setIsOpen(false)}
            style={styles.backdrop}
          />

          <View
            style={[
              styles.sheet,
              {
                paddingBottom: Math.max(
                  insets.bottom,
                  theme.spacing.lg,
                ),
              },
            ]}
          >
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {t('location.sheetTitle')}
              </Text>
              <Pressable
                accessibilityLabel={t(
                  'location.closeAccessibility',
                )}
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.locationList}
            >
              <Pressable
                onPress={() => handleSelect(null)}
                style={styles.locationRow}
              >
                <Text style={styles.locationName}>
                  {t('location.unset')}
                </Text>
                {selectedLocationId === null ? (
                  <Text style={styles.selectedMark}>✓</Text>
                ) : null}
              </Pressable>

              {locations.map((location) => (
                <View
                  key={location.id}
                  style={styles.locationRow}
                >
                  <Pressable
                    accessibilityLabel={t(
                      'location.selectNamed',
                      { name: location.name },
                    )}
                    onPress={() => handleSelect(location.id)}
                    style={styles.locationSelectArea}
                  >
                    <Text style={styles.locationName}>
                      {location.name}
                    </Text>
                    {selectedLocationId === location.id ? (
                      <Text style={styles.selectedMark}>✓</Text>
                    ) : null}
                  </Pressable>

                  <Pressable
                    accessibilityLabel={t(
                      'location.deleteNamed',
                      { name: location.name },
                    )}
                    disabled={busyLocationId !== null}
                    hitSlop={8}
                    onPress={() => {
                      void handleDelete(location.id);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>
                      {t('location.delete')}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>

            {isAdding ? (
              <View style={styles.addArea}>
                <TextInput
                  autoFocus
                  editable={busyLocationId === null}
                  maxLength={50}
                  onChangeText={setNewLocationName}
                  onSubmitEditing={() => {
                    void handleAdd();
                  }}
                  placeholder={t(
                    'location.newNamePlaceholder',
                  )}
                  placeholderTextColor={theme.colors.textMuted}
                  returnKeyType="done"
                  style={styles.input}
                  value={newLocationName}
                />
                <Pressable
                  disabled={busyLocationId !== null}
                  onPress={() => {
                    void handleAdd();
                  }}
                  style={styles.addConfirmButton}
                >
                  <Text style={styles.addConfirmText}>
                    {t('location.add')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setActionError(null);
                  setIsAdding(true);
                }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>
                  {t('location.addNew')}
                </Text>
              </Pressable>
            )}

            {actionError ? (
              <Text style={styles.actionError}>{actionError}</Text>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fontWeight, radius, spacing } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      marginTop: 20,
      padding: spacing.lg,
      paddingTop: 22,
    },
    selector: {
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
      minHeight: 48,
      paddingHorizontal: spacing.lg,
    },
    selectorText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: fontWeight.bold,
    },
    chevron: {
      color: colors.primary,
      fontSize: 20,
    },
    inlineError: {
      color: colors.danger,
      fontSize: 12,
      marginTop: spacing.sm,
    },
    pressed: {
      opacity: 0.7,
    },
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '78%',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
    },
    handle: {
      alignSelf: 'center',
      backgroundColor: colors.borderStrong,
      borderRadius: radius.pill,
      height: 4,
      width: 42,
    },
    sheetHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    sheetTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: fontWeight.extraBold,
    },
    closeButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    closeText: {
      color: colors.textSecondary,
      fontSize: 28,
    },
    locationList: {
      marginTop: spacing.sm,
    },
    locationRow: {
      alignItems: 'center',
      borderBottomColor: colors.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      minHeight: 50,
    },
    locationSelectArea: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 50,
    },
    locationName: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: 15,
    },
    selectedMark: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: fontWeight.extraBold,
      marginLeft: spacing.md,
    },
    deleteButton: {
      marginLeft: spacing.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.md,
    },
    deleteText: {
      color: colors.danger,
      fontSize: 12,
      fontWeight: fontWeight.bold,
    },
    addButton: {
      alignItems: 'center',
      borderColor: colors.primary,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginTop: spacing.lg,
      minHeight: 48,
      justifyContent: 'center',
    },
    addButtonText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: fontWeight.extraBold,
    },
    addArea: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      flex: 1,
      fontSize: 15,
      minHeight: 48,
      paddingHorizontal: spacing.lg,
    },
    addConfirmButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: spacing.lg,
    },
    addConfirmText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: fontWeight.extraBold,
    },
    actionError: {
      color: colors.danger,
      fontSize: 12,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
}
