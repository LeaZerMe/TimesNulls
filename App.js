import React from 'react';
import { StyleSheet, Text, View, Alert, FlatList, Animated, Button } from 'react-native';
import Cell from './Cell.js';
import SocketIOClient from 'socket.io-client';
import StartingComponent from './StartingComponent.js'
import checkField from "./assets/checkingFunction.js"


const defaultArr = [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
{id: 4, title: ""},{id: 5, title: ""},{id: 6, title: ""},
{id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
];

export default class App extends React.Component {
  constructor(p) {
    super(p);

    window.navigator.userAgent = 'ReactNative';
    this.socket = SocketIOClient("http://192.168.1.2:3000");

    this.fadeVal = new Animated.Value(0);
    this.textFadeVal = new Animated.Value(0);
    this.name = "";
    this.playingOffline = false;
    this.playersPositions = {};

    this.state = {
      field: [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
      {id: 4, title: ""},{id: 5, title: ""},{id: 6, title: ""},
      {id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
      ],
      queue: "X",
      msgTxt: "",
      readyPlay: false,
      next: "",
      disablePlay: false,
      botMake: false
    }

    this.checkStep = this.checkStep.bind(this);
    this.startFade = this.startFade.bind(this);
    this.answerName = this.answerName.bind(this);
    this.startOffline = this.startOffline.bind(this);
    this.botMakeStep = this.botMakeStep.bind(this);
  }

  componentDidMount() {
    this.socket.on('callbackBoutStep', (data, queue, name) => {
      this.setState({field: data, queue: queue, next: name});
    });

    this.socket.on('endGame', (data) => {
      this.setState({field: data, queue: "X"});
    })

    this.socket.on('animIt', (data, obj) => {
      this.startFade(data, obj);
    })

    this.socket.on('startGame', (name) => {
      this.setState({readyPlay: true, next: name});
    })
  }

  answerName(name) {
    this.name = name;
  }

  startOffline() {
    let random = Math.random().toFixed(0);
    let next;

    if(random == 1) {
      next = "You";
    } else {
      next = 'Bot';
    }

    this.playersPositions["You"] = [];
    this.playersPositions["Bot"] = [];

    this.name = "You";
    this.playingOffline = true;
    this.setState({readyPlay: true, next: next});

    if(next == "Bot") {
      setTimeout(() => {
        this.setState({next: "You", field: [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
          {id: 4, title: ""},{id: 5, title: "X"},{id: 6, title: ""},
          {id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
          ], queue: 'O'});
        this.playersPositions["Bot"].push(5);
      }, 1000);
    } 
  }

  botMakeStep(obj) {
    let a = [], ready = false, queue = "";

    if(this.state.queue == "X") {
      queue = "O"
    } else {
      queue = "X"
    }

    let position = checkField(obj, queue);

    obj.forEach((e) => {
      if(e.id == position) {
        a.push({id: position, title: queue})
      } else {
        a.push(e) 
      }     
    })

    this.setState({field: obj, next: "Bot", botMake: true})

    setTimeout(() => {
      this.checkStep(false, a);
    }, 500)
  }

  startFade(val, obj) {  
    this.setState({disablePlay: true});
    if(obj) {
      this.setState({field: obj});
    }

    this.fadeVal.setValue(0);
    this.textFadeVal.setValue(0);

    if(val == 'draw') {
      this.setState({msgTxt: `Draw`});
    } else {
      this.setState({msgTxt: `Winner: ${this.state.next}`});
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
    if(this.playingOffline) {
      setTimeout(() => {this.setState({msgTxt: ""}); this.setState({field: defaultArr, queue: "X"}); this.setState({disablePlay: false});}, 3000);
    }
    setTimeout(() => {this.setState({msgTxt: "", disablePlay: false, botMake: false}); this.socket.emit('step', "end"); this.startOffline()}, 3000);
  }

  render() {
    if(!this.state.readyPlay) {
      return (
        <View key="main" style={styles.container}>        
        <StartingComponent botOn={this.startOffline} socket={this.socket} answerName={this.answerName}></StartingComponent>
        </View>
        );
    } else {

      const opacity = this.fadeVal.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 1]
      }), txtOpacity = this.textFadeVal.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0]
      });
      const Anim = Animated.createAnimatedComponent(FlatList);

      return (
        <View key="main" style={styles.container}>        
        <Text key="titleText" style={styles.title}>Chrest Nulls</Text>
        <Animated.Text key="messageText" style={[styles.message, {opacity: txtOpacity}]}>{this.state.msgTxt}</Animated.Text>

        <Anim
        style={{opacity}}
        key="gridList"
        data={this.state.field}
        renderItem={({item}) =>  <Cell item={item} checkStep={this.checkStep}/>}
        keyExtractor={({item}, index) => index}
        numColumns={3}
        />
        <Text style={styles.queue}>Next step: {this.state.next}, {this.state.queue}</Text>
        </View>
        );
    }
  }

  checkStep(num, obj) {
    let success = true;
    let a = [];

    if(this.state.disablePlay) return;

    if(!this.playingOffline) {
      if(this.state.next != this.name) return;
    }  

    if(num) {

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
      this.playersPositions["You"].push(num);
    } else {
      a = obj;
    }

    if(!success) return;

    if(a[0].title == "X" && a[1].title == "X" && a[2].title == "X") {
     this.setState({field: a});
     if(this.playingOffline) {
      this.startFade("X");
    } else {
      this.socket.emit('alertAboutEnd', "X")
    }
    return;
  } else if(a[0].title == "X" && a[3].title == "X" && a[6].title == "X") {
   this.setState({field: a});
   if(this.playingOffline) {
    this.startFade("X");
  } else {
    this.socket.emit('alertAboutEnd', "X")
  }   
  return;
} else if(a[1].title == "X" && a[4].title == "X" && a[7].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X")
}   return;
} else if(a[2].title == "X" && a[5].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X")
}   return;
} else if(a[3].title == "X" && a[4].title == "X" && a[5].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X")
}   return;
} else if(a[6].title == "X" && a[7].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X")
}   return;
} else if(a[0].title == "X" && a[4].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X")
}   return;
} else if(a[6].title == "X" && a[4].title == "X" && a[2].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X")
}   return;
}

if(a[0].title == "O" && a[1].title == "O" && a[2].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[0].title == "O" && a[3].title == "O" && a[6].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[1].title == "O" && a[4].title == "O" && a[7].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[2].title == "O" && a[5].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[3].title == "O" && a[4].title == "O" && a[5].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[6].title == "O" && a[7].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[0].title == "O" && a[4].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
} else if(a[6].title == "O" && a[4].title == "O" && a[2].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O")
}  return;
}

if(!a.filter((e) => e.title == "").length) {
  if(this.playingOffline) {
    this.startFade("draw", a);
  } else {
    this.socket.emit('alertAboutEnd', "draw", a)
  } 
  return;
}

if(this.state.queue == "X") {
  this.setState({queue: "O"})
} else {
  this.setState({queue: "X"})
}

if(this.playingOffline) {
  if(this.state.botMake) {
    this.setState({field: a, botMake: false, next: "You"})
  } else {
    this.botMakeStep(a);
  }
} else {
  this.socket.emit('step', a)
} 
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
  queue: {
    marginBottom: 30,
    fontSize: 30,
    color: "#141"
  }
});