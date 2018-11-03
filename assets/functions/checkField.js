function checkField(thiss, a) {

	if(a[0].title == "X" && a[1].title == "X" && a[2].title == "X") {
     this.setState({field: a});
     if(this.playingOffline) {
      this.startFade("X");
    } else {
      this.socket.emit('alertAboutEnd', "X", a)
    }
    return;
  } else if(a[0].title == "X" && a[3].title == "X" && a[6].title == "X") {
   this.setState({field: a});
   if(this.playingOffline) {
    this.startFade("X");
  } else {
    this.socket.emit('alertAboutEnd', "X", a)
  }   
  return;
} else if(a[1].title == "X" && a[4].title == "X" && a[7].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[2].title == "X" && a[5].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[3].title == "X" && a[4].title == "X" && a[5].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[6].title == "X" && a[7].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[0].title == "X" && a[4].title == "X" && a[8].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
} else if(a[6].title == "X" && a[4].title == "X" && a[2].title == "X") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("X");
} else {
  this.socket.emit('alertAboutEnd', "X", a)
}   return;
}

if(a[0].title == "O" && a[1].title == "O" && a[2].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[0].title == "O" && a[3].title == "O" && a[6].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[1].title == "O" && a[4].title == "O" && a[7].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[2].title == "O" && a[5].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[3].title == "O" && a[4].title == "O" && a[5].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[6].title == "O" && a[7].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[0].title == "O" && a[4].title == "O" && a[8].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
} else if(a[6].title == "O" && a[4].title == "O" && a[2].title == "O") {
 this.setState({field: a});
 if(this.playingOffline) {
  this.startFade("O");
} else {
  this.socket.emit('alertAboutEnd', "O", a)
}  return;
}
}