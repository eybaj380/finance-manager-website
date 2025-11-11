import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import UserAvatar from '../../assets/images/user-avatar.svg';

export default function HomeScreen() {
  return (
      <View style={styles.container}>
        <Image source={UserAvatar} style={styles.avatarContainer}/>
        <View style={styles.inputForm}>
          <Text style={styles.title}>Hello, User!</Text>
          <View>
            <Text>Hourly wage</Text>
            <Text>Enter a dollar amount...</Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  flexDirection: 'row',
  marginTop: 15,
  marginLeft: 35,
  marginRight: 50
 },
  avatarContainer: {
  width: 112,
  height: 110.78,
  marginRight: 35,
 },
 title: {
  color: '#BE5EAC',
  fontSize: 32,
  fontWeight: 'heavy',
  fontFamily: 'AlikeAngular-Regular',
 },
 inputForm: {
  flexDirection: 'column',
  gap: 22
 }
});
