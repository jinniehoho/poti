import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

type SproutIconProps = {
  illustrationScale?: number;
  size?: number;
};

export default function SproutIcon({
  illustrationScale = 1,
  size = 20,
}: SproutIconProps) {
  const graphicSize =
    Math.min(size - 4, 16) * illustrationScale;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.viewport,
        {
          height: size,
          width: size,
        },
      ]}
    >
      <Image
        resizeMode="contain"
        source={require('../../assets/images/sprout-illustration.png')}
        style={{
          height: graphicSize * 3,
          left:
            (size - graphicSize * 4.5) / 2,
          position: 'absolute',
          top: (size - graphicSize * 3) / 2,
          width: graphicSize * 4.5,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
