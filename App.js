import React from 'react';
import { StyleSheet, Text, View, Alert, FlatList,
  Animated, Button } from 'react-native';
  import Cell from './Cell.js';
  import SocketIOClient from 'socket.io-client';
  import StartingComponent from './StartingComponent.js'

  export default class App extends React.Component {
    constructor(p) {
      super(p);

      window.navigator.userAgent = 'ReactNative';
      this.socket = SocketIOClient("http://192.168.1.3:3000");
      this.socket.emit('startGame', "");
      this.fadeVal = new Animated.Value(0);
      this.textFadeVal = new Animated.Value(0);

      this.state = {
        field: [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
        {id: 4, title: ""},{id: 5, title: ""},{id: 6, title: ""},
        {id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
        ],
        queue: "X",
        msgTxt: "",
        refreshing: false
      }

      this.checkStep = this.checkStep.bind(this);
      this.startFade = this.startFade.bind(this);
    }

    componentDidMount() {
      this.socket.on('callbackBoutStep', (data) => {
        this.setState({field: data});
      });

      this.socket.on('endGame', (data) => {
        this.setState({field: data, queue: "X"});
      })

      this.socket.on('animIt', (data) => {
        this.startFade(data);
      })
    }

    startFade(val) {  
      this.fadeVal.setValue(0);
      this.textFadeVal.setValue(0);
      if(val == 'draw') {
        this.setState({msgTxt: `Draw`});
      } else {
        this.setState({msgTxt: `Winner: ${val}`});
      } 

      Animated.timing(
        this.textFadeVal,
        { toValue: 1, duration: 3000 }
        ).start();

      Animated.timing(
        this.fadeVal,
        { toValue: 1, duration: 4000 }
        ).start();

      setTimeout(() => {this.setState({queue: "X"})}, 1500);
      setTimeout(() => {this.setState({msgTxt: ""}); this.socket.emit('step', "end")}, 3000);
    }

    render() {

      const opacity = this.fadeVal.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 1]
      }), txtOpacity = this.textFadeVal.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0]
      });
      const Anim = Animated.createAnimatedComponent(FlatList);
// <StartingComponent/>
      return (
        <View key="main" style={styles.container}>        
        <Text key="titleText" style={styles.title}>Chrest Nulls</Text>
        <Animated.Text key="messageText" style={[styles.message, {opacity: txtOpacity}]}>{this.state.msgTxt}</Animated.Text>

        <Anim
        style={{opacity}}
        key="gridList"
        data={this.state.field}
        renderItem={({item}) =>  <Cell item={item} checkStep={this.checkStep}/>}

        numColumns={3}
        />
        </View>
        );
    }

    checkStep(num) {
      let success = true;
      let a = [];

      this.state.field.forEach((e) => {
        if(e.id == num) { 
          if(e.title) {
            a.push({
              id: num,
              title: e.title
            });
            success = false;

            return;
          }     

          a.push({
            id: num,
            title: this.state.queue
          });

          return;
        }

        a.push(e);
      })

      if(!success) return;

      if(a[0].title == "X" && a[1].title == "X" && a[2].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[0].title == "X" && a[3].title == "X" && a[6].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[1].title == "X" && a[4].title == "X" && a[7].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[2].title == "X" && a[5].title == "X" && a[8].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[3].title == "X" && a[4].title == "X" && a[5].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[6].title == "X" && a[7].title == "X" && a[8].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[0].title == "X" && a[4].title == "X" && a[8].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     } else if(a[6].title == "X" && a[4].title == "X" && a[2].title == "X") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "X")
       return;
     }

     if(a[0].title == "O" && a[1].title == "O" && a[2].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[0].title == "O" && a[3].title == "O" && a[6].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[1].title == "O" && a[4].title == "O" && a[7].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[2].title == "O" && a[5].title == "O" && a[8].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[3].title == "O" && a[4].title == "O" && a[5].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[6].title == "O" && a[7].title == "O" && a[8].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[0].title == "O" && a[4].title == "O" && a[8].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     } else if(a[6].title == "O" && a[4].title == "O" && a[2].title == "O") {
       this.setState({field: a});
       this.socket.emit('alertAboutEnd', "O")
       return;
     }

     if(!a.filter((e) => e.title == "").length) {
      this.socket.emit('alertAboutEnd', "draw")
      return;
    }

    if(this.state.queue == "X") {
      this.setState({queue: "O"})
    } else {
      this.setState({queue: "X"})
    }

    this.socket.emit('step', a)
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 40,
    fontSize: 30
  },
  message: {
    marginBottom: 20,
    fontSize: 30,
    color: "#141",
    fontWeight: '600'
  },
  queue
});