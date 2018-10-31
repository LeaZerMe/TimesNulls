import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

export default class StartingComponent extends React.Component {
  constructor(p) {
    super(p);

    this.name = '';
    this.state = {
      seeking: false
    }
  }
  start() {
    this.setState({seeking: true});
    this.props.socket.emit('startSeekGame', this.name);
  }

  cancel() {
    this.setState({seeking: false});
    this.props.socket.emit('cancelSeekGame');
  }

  startOffline() {
    this.props.botOn();
  }

  render() {
    if(this.state.seeking) {
      return (<View style={styles.container}>
         <Text style={styles.waitText}>Wait, {this.name}. We seeking...</Text>
         <ActivityIndicator size="large" color="#0000ff" />

          <TouchableOpacity onPress={this.cancel.bind(this)} style={{backgroundColor: 'red',padding: 5, width: 'auto'}}>
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>

       </View>)
    } else if(this.name) {

    return (<View style={styles.container}>
      <TouchableOpacity onPress={this.start.bind(this)} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
      </View>)
    } else {

      return (<View style={styles.container}>
        <Text style={{textAlign: 'center', fontSize: 38}}>LogIn</Text>

          <TextInput onChangeText={(text) => {
            this.name = text; 
            this.props.answerName(text)
          }} 
             style={styles.textInputs}
             placeholder="Name"
             underlineColorAndroid="transparent"
          ></TextInput>

        <TouchableOpacity onPress={this.start.bind(this)} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Save & Start</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.startOffline.bind(this)} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Play offline</Text>
        </TouchableOpacity>
        </View>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 50
  },
  textInputs: {
    height: 100,
    marginTop: 20,
    padding: 20,
    color: '#141',
    fontSize: 22
  },
  buttonContainer:{
    backgroundColor: '#2980b6',
    padding: 15,
    marginBottom: 10
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 22
  },
  waitText: {
    fontSize: 28,
    marginBottom: 10
  }
})