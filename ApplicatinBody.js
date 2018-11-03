import React from 'react';
import { StyleSheet, StatusBar, Text, View, Alert, FlatList, Animated, TouchableOpacity, BackHandler, AsyncStorage } from 'react-native';
import Cell from './Cell.js';
import SocketIOClient from 'socket.io-client';
import StartingComponent from './StartingComponent.js'
import checkField from "./assets/checkingFunction.js"
import { connect } from 'react-redux';
import { changeName } from './assets/redux/reducer.js'
import { BoxShadow } from 'react-native-shadow'

const defaultArr = [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
{id: 4, title: ""},{id: 5, title: ""},{id: 6, title: ""},
{id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
];

class App extends React.Component {
  constructor(p) {
    super(p);

    window.navigator.userAgent = 'ReactNative';
    this.socket = SocketIOClient("http://192.168.1.2:3000");

    this.winTextVal = new Animated.Value(0);
    this.winnerPanelVal = new Animated.Value(300);
    this.cellsOpacity = new Animated.Value(2);
    this.playingOffline = false;
    this.winningNumbers = [];

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
      botMake: false,
      canLeave: true,
      hideOthers: false
    }

    this.checkStep = this.checkStep.bind(this);
    this.startFade = this.startFade.bind(this);
    this.startOffline = this.startOffline.bind(this);
    this.botMakeStep = this.botMakeStep.bind(this);
    this.comeBack = this.comeBack.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {

    if(this.state.readyPlay && this.state.canLeave) {
      this.comeBack();
      return true;
    } else if(!this.state.canLeave) {
      return true;
    }     
    return false;
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    BackHandler.addEventListener('hardwareBackPress', this.goBack);

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

    this.socket.on('leaveGame', (obj) => {
      this.winTextVal = new Animated.Value(0);
      this.winnerPanelVal = new Animated.Value(300);
      this.cellsOpacity = new Animated.Value(0);
      this.setState({readyPlay: false, next: "", field: obj, queue: "X"});
    })
  } 

  componentWillUnmount() {
    StatusBar.setHidden(false);
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  comeBack() {
    this.socket.emit('leaveGame');

    if(this.playingOffline) {
      this.playingOffline = false;   
      this.setState({readyPlay: false, field: [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
        {id: 4, title: ""},{id: 5, title: ""},{id: 6, title: ""},
        {id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
        ], queue: "X"})
    }
  }

  startOffline() {
    let random = Math.random().toFixed(0);
    let next;

    if(random == 1) {
      next = this.props.language.you;
    } else {
      next = this.props.language.bot;
    }

    this.playingOffline = true;
    this.setState({readyPlay: true, next: next});

    if(next == this.props.language.bot) {
      this.setState({disablePlay: true})
      setTimeout(() => {
        this.setState({next: this.props.language.you, field: [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
          {id: 4, title: ""},{id: 5, title: "X"},{id: 6, title: ""},
          {id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
          ], queue: 'O', disablePlay: false});
      }, 1000);
    } else {
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

    this.setState({field: obj, next: this.props.language.bot, botMake: true, disablePlay: true})

    setTimeout(() => {
      this.checkStep(false, a, "bot");
    }, 500)
  }

  startFade(val, obj) {  
    this.setState({disablePlay: true, canLeave: false, hideOthers: true});
    if(obj) {
      this.setState({field: obj});
    }

    this.winTextVal.setValue(0);
    this.winnerPanelVal.setValue(300);

    if(val == 'draw') {
      this.setState({msgTxt: this.props.language.draw});
    } else {
      this.setState({msgTxt: `${this.props.language.winner}: ${this.state.next}`});
    } 

    Animated.timing(
      this.winnerPanelVal,
      { toValue: 80, duration: 1500 }
      ).start();

    Animated.timing(
      this.winTextVal,
      { toValue: -180, duration: 1500 }
      ).start();

    Animated.timing(
      this.cellsOpacity,
      { toValue: 0, duration: 2000 }
      ).start();

    this.setState({canLeave: false})

    setTimeout(() => {this.setState({queue: "X"});

     Animated.timing(
      this.winnerPanelVal,
      { toValue: 300, duration: 1500 }
      ).start();

     Animated.timing(
      this.winTextVal,
      { toValue: 0, duration: 1500 }
      ).start();

     Animated.timing(
      this.cellsOpacity,
      { toValue: 1, duration: 2000 }
      ).start();

   }, 1500);

    if(this.playingOffline) {
      setTimeout(() => {this.setState({msgTxt: ""}); this.setState({field: defaultArr, queue: "X"}); this.setState({disablePlay: false});}, 3500);
    }
    setTimeout(() => {this.setState({msgTxt: "", disablePlay: false, botMake: false, hideOthers: false, canLeave: true}); this.socket.emit('step', "end"); if(this.playingOffline) this.startOffline(); this.winningNumbers = []}, 3500);
  }

  render() {

    if(!this.state.readyPlay) {
      return (
        <View key="main" style={styles.container}>        
        <StartingComponent botOn={this.startOffline} socket={this.socket}></StartingComponent>
        </View>
        );
    } else {

      const Anim = Animated.createAnimatedComponent(FlatList);

      const letMove = () => {
        if(this.state.next == this.props.language.you || this.state.next == this.props.name) {
          if(this.state.hideOthers) return;
          return <Animated.Text style={styles.queue}>{this.props.language.nextStep}, {this.state.queue}</Animated.Text>
        }
      }

      let cellVal = this.cellsOpacity.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      });

      return (
        <View key="main" style={styles.container}>
        <Animated.View style={[styles.winnerPanel, {transform: [{translateY: this.winnerPanelVal}]}]}>
          <View style={{marginTop: 20, flex: 1, justifyContent: 'center', alignItems: 'center'}}><Animated.Text style={[styles.panelText, {transform: [{translateY: this.winTextVal}]}]}>{this.state.msgTxt}</Animated.Text></View>
          </Animated.View>
        <View style={styles.playingField}>                    
        <Text key="titleText" style={styles.title}>{this.props.language.appName}</Text>

        <Anim
        key="gridList"
        data={this.state.field}
        renderItem={({item}) => {

          let setAnimationOpprt = () => {
            if(this.winningNumbers.indexOf(item.id-1) != -1) return [styles.button, {opacity: cellVal}];
            return styles.button
          }

          return <TouchableOpacity 
                   onPress={() => {this.checkStep(item.id)}}
                   key={`cell${item.id}`}
                   color='#fff'>

                <Animated.View style={setAnimationOpprt()}>
                    <Text style={{color: '#000', fontSize: 36, fontWeight: '600', textAlign: 'center'}}>{item.title}</Text>
                </Animated.View>
            </TouchableOpacity>
        }}
        keyExtractor={({item}, index) => index}
        numColumns={3}
        />
        {letMove()} 

        </View>        
        </View>
        )
    }
  }
// if(this.winningNumbers.indexOf(item.id-1) != -1) {
//             return <Cell item={item} access={false} style={this.cellsOpacity} checkStep={this.checkStep}/>
//           } else {
//             return <Cell item={item} access={true} style={this.cellsOpacity} checkStep={this.checkStep}/>
//           }}}
  checkStep(num, obj, player) {
    let success = true;
    let a = [];

    if(this.state.disablePlay && player != "bot") return;

    if(!this.playingOffline) {
      if(this.state.next != this.props.name) return;
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
    } else {
      a = obj;
    }

    if(!success) return;

    if(a[0].title == "X" && a[1].title == "X" && a[2].title == "X") {
     this.setState({field: a});
     if(this.playingOffline) {
      this.startFade("X");
      this.winningNumbers = [0,1,2];
    } else {
      this.socket.emit('alertAboutEnd', "X", a)
    }
    return;
  } else if(a[0].title == "X" && a[3].title == "X" && a[6].title == "X") {
   this.setState({field: a});
   if(this.playingOffline) {
    this.startFade("X");
    this.winningNumbers = [0,3,6];
  } else {
    this.socket.emit('alertAboutEnd', "X", a)
  }   
  return;
} else if(a[1].title == "X" && a[4].title == "X" && a[7].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
  this.winningNumbers = [1,4,7];
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[2].title == "X" && a[5].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
  this.winningNumbers = [2,5,8];
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[3].title == "X" && a[4].title == "X" && a[5].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
  this.winningNumbers = [3,4,5];
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[6].title == "X" && a[7].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
  this.winningNumbers = [6,7,8];
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[0].title == "X" && a[4].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
  this.winningNumbers = [0,4,8];
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[6].title == "X" && a[4].title == "X" && a[2].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
  this.winningNumbers = [6,4,2];
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
}

if(a[0].title == "O" && a[1].title == "O" && a[2].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [0,1,2];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[0].title == "O" && a[3].title == "O" && a[6].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [0,3,6];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[1].title == "O" && a[4].title == "O" && a[7].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [1,4,7];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[2].title == "O" && a[5].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [2,5,8];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[3].title == "O" && a[4].title == "O" && a[5].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [3,4,5];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[6].title == "O" && a[7].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [6,7,8];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[0].title == "O" && a[4].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [0,4,8];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[6].title == "O" && a[4].title == "O" && a[2].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
  this.winningNumbers = [6,4,2];
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
}

if(!a.filter((e) => e.title == "").length) {
  if(this.playingOffline) {
    this.startFade("draw", a);
    this.winningNumbers = [0,1,2,3,4,5,6,7,8];
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
    this.setState({field: a, botMake: false, next: this.props.language.you, disablePlay: false})
  } else {
    this.botMakeStep(a);
  }
} else {
  this.socket.emit('step', a)
} 
}
}

let mapStateToProps = state => {
  return {
    name: state.userName,
    language: state.languageSettings[state.activeLang]
  };
}

let mapDispachToProps = dispatch => {
  return {
    changeName: name => dispatch(changeName(name))
  }
}

export default connect(mapStateToProps, mapDispachToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252129',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerPanel: {
    zIndex: 100,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: "100%",
    height: 250,
    backgroundColor: "#2980b6"
  },
  panelText: {
    position: "absolute",
    bottom: 0,
    textAlign: "center",
    fontSize: 38,
    color: "#fff"
  },
  playingField: {
    marginTop: 40
  },
  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 80,
    fontSize: 30
  },
  message: {
    marginBottom: 20,
    fontSize: 30,
    color: "#fff",
    fontWeight: '600',
    textAlign: "center"
  },
  queue: {
    marginBottom: 60,
    fontSize: 30,
    color: "#fff",
    textAlign: "center"
  },
  button: {
    marginLeft: 5,
    marginTop: 5,
    width: 80,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    maxHeight: 80,
    height: 80,
    paddingTop: 20
  }
});