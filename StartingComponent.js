import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

export default class StartingComponent extends React.Component {

	render() {
		return (<View style={styles.container}>
      <Text style={{textAlign: 'center', fontSize: 38}}>LogIn</Text>
      <TextInput style={styles.textInputs}
       placeholder="Name"
       underlineColorAndroid="transparent"
      ></TextInput>

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Save & Start</Text>
      </TouchableOpacity>
      </View>)
	}
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 5
  },
  textInputs: {
    height: 100,
    marginTop: 20,
    padding: 20,
    color: '#141',
    fontSize: 32
  },
  buttonContainer:{
    backgroundColor: '#2980b6',
    padding: 15
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 22
  }
})