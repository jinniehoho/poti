import {
  StyleSheet,
  Text as ReactNativeText,
  TextInput as ReactNativeTextInput,
  type TextProps,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

import { fontFamily } from '../constants/theme';

function resolveFontFamily(
  style: TextProps['style'] | TextInputProps['style'],
) {
  const flattenedStyle = StyleSheet.flatten(
    style,
  ) as TextStyle | undefined;

  if (flattenedStyle?.fontFamily) {
    return flattenedStyle.fontFamily;
  }

  const weight = flattenedStyle?.fontWeight;
  const numericWeight =
    weight === 'bold'
      ? 700
      : typeof weight === 'string'
        ? Number.parseInt(weight, 10)
        : weight ?? 400;

  if (numericWeight >= 700) {
    return fontFamily.bold;
  }

  if (numericWeight >= 600) {
    return fontFamily.semiBold;
  }

  if (numericWeight >= 500) {
    return fontFamily.medium;
  }

  return fontFamily.regular;
}

export function AppText({
  style,
  ...props
}: TextProps) {
  return (
    <ReactNativeText
      {...props}
      style={[
        {
          fontFamily: resolveFontFamily(style),
        },
        style,
      ]}
    />
  );
}

export function AppTextInput({
  style,
  ...props
}: TextInputProps) {
  return (
    <ReactNativeTextInput
      {...props}
      style={[
        {
          fontFamily: resolveFontFamily(style),
        },
        style,
      ]}
    />
  );
}
