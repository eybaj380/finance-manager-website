import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import UserAvatar from '../../assets/images/user-avatar.svg';

export default function HomeScreen() {
  return (
      <View style={styles.container}>
        <Image source={UserAvatar} style={styles.avatarContainer}/>
        <Text>This is a test</Text>
      </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  marginLeft: 35,
  marginRight: 50
 },
 avatarContainer: {
  width: 112,
  height: 110.78,
 }
});
