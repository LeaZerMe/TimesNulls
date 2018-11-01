import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, BackHandler, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class StartingComponent extends React.Component {
  constructor(p) {
    super(p);

    this.name = this.props.name;

    this.state = {
      seeking: false,
      spinner: false
    }

    this.goBack = this.goBack.bind(this)
  }

  goBack() {
    if(this.state.seeking) {
      this.setState({seeking: false});
      this.props.socket.emit('cancelSeekGame');
      return true;
    }

    return false;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
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
    let name, inputName;
    if(!this.name) {
      name = "Player"
      inputName = "Name"
    } else {
      name = this.name
      inputName = this.name
    }

    if(this.state.seeking) {
      return (<View style={styles.container}>
         <Text style={styles.waitText}>Wait, {name}. We seeking...</Text>
          <ActivityIndicator size="large" color="#fff"/>

          <TouchableOpacity onPress={this.cancel.bind(this)} style={{backgroundColor: '#2980b6', padding: 10, marginHorizontal: 75, marginTop: 40, borderRadius: 40}}>
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>

       </View>)
    } else {

      return (<View style={styles.parentElement}>
        <View style={styles.container}>
          <Text style={{textAlign: 'center', fontSize: 34, color: "#fff", marginBottom: 45}}>Times&Nulles</Text>
        
            <TextInput onChangeText={(text) => {
              this.name = text; 
              this.props.answerName(text)
            }} 
               style={styles.textInputs}
               placeholder={inputName}
               placeholderTextColor="#E2E2E2"
               blurOnSubmit={true}
            ></TextInput>
        
          <TouchableOpacity onPress={this.start.bind(this)} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>MultiPlayer</Text>
          </TouchableOpacity>
        
          <TouchableOpacity onPress={this.startOffline.bind(this)} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>SinglePlayer</Text>
          </TouchableOpacity>
          </View>
      </View>)
    }
  }
}

const styles = StyleSheet.create({
  parentElement: {
    width: "100%",
    marginTop: 20,
    flex: 1,
    backgroundColor: '#252129',
    justifyContent: 'center'
  },
  container: { 
    marginBottom: 50,
    width: "100%"
  },
  textInputs: {
    height: 100,
    marginTop: 20,
    marginRight: 30,
    marginLeft: 30,
    padding: 20,
    color: '#fff',
    fontSize: 28,
    paddingBottom: 2,
    marginBottom: 40,
    textAlign: 'center'
  },
  buttonContainer:{
    backgroundColor: '#2980b6',
    padding: 15,
    marginBottom: 10,
    marginRight: 45,
    marginLeft: 45
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 24
  },
  waitText: {
    marginTop: 40,
    fontSize: 34,
    marginBottom: 20,
    color: "#fff",
    textAlign: "center"
  },
  color: {
    color: "#E2E2E2"
  }
})