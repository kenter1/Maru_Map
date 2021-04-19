// canvas.js

import React, { Component } from 'react';
import { v4 } from 'uuid';
import { PanZoom } from 'react-easy-panzoom'
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { green, purple } from '@material-ui/core/colors';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
        color: '#00ff00',
        drawing_toggle:false,
      };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
    this.handleDrawButton = this.handleDrawButton.bind(this);
    this.handleMapButton = this.handleMapButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  isPainting = false;
  // Different stroke styles to be used for user and guest
//   userStrokeStyle = this.state.color;
  guestStrokeStyle = '#F0C987';
  line = [];
  // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
  userId = v4();
  prevPos = { offsetX: 0, offsetY: 0 };

  handleColor=(e)=>{
    this.setState({
      color: e.target.value
    })
  }

  handleDelete(){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMap()
  }

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    if(this.state.drawing_toggle == true){
        this.isPainting = true;

    }

    this.prevPos = { offsetX, offsetY };
  }

  handleDrawButton(){
    this.setState(prevState => ({
      drawing_toggle:true
    }));
  }

  handleMapButton(){
    this.setState(prevState => ({
      drawing_toggle:false
    }));
  }
  test1(){
    this.ctx.beginPath();

    this.ctx.moveTo(20, 20);
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.state.color);
    }
  }
  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      this.sendPaintData();
    }
  }
  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }

  async sendPaintData() {
    const body = {
      line: this.line,
      userId: this.userId,
    };
    // We use the native fetch API to make requests to the server
    const req = await fetch('http://10.0.0.26:3000', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });
    const res = await req.json();
    this.line = [];
  }

  drawMap(){
    const image = new Image(); // Using optional size for image
    let ctx = this.ctx;
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = 'https://vignette1.wikia.nocookie.net/armedassault/images/4/46/Arma3atlis.jpg/revision/latest/scale-to-width-down/2000?cb=20140512130130'
    image.onload = function(){
        ctx.drawImage(image, 0, 0); 

    }

  }

  componentDidMount() {
    // Here we set up the properties of the canvas element. 
    this.canvas.width = 2000;
    this.canvas.height = 2000;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    this.drawMap()
  }

  render() {
    return (
    <div>

    <div>
    <AppBar>
          <Toolbar>
            <Typography variant="h6">MARU</Typography>
            <button value="#00ff00" onClick={this.handleColor}  style={{opacity:.8 ,position:'absolute',left:'8%',  zIndex: 10, backgroundColor:'#00ff00', border:'stripe', padding:'20px', borderRadius:'50%'}}></button>
            <button value="#ff0000" onClick={this.handleColor}  style={{opacity:.8 , position:'absolute',left:'11%',  zIndex: 10, backgroundColor:'#ff0000', border:'stripe', padding:'20px', borderRadius:'50%'}}></button>

            <ButtonGroup style={{ position:'absolute', left:'15%', zIndex: 10}} variant="contained" color="primary" aria-label="contained primary button group">
              <Button onClick={this.handleDrawButton}>Draw</Button>
              <Button onClick={this.handleMapButton}>Navigation</Button>
              <Button onClick={this.handleDelete} color='secondary'>Clear</Button>
            </ButtonGroup>


            {/* <ButtonGroup style={{ position:'absolute', left:'8%', zIndex: 10}} variant="contained" color="primary" aria-label="contained primary button group">
              <Button color='primary'>Blue</Button>
              <Button color='secondary'>Two</Button>
            </ButtonGroup>
            <button style={{ position:'absolute',left:'10%',  zIndex: 10}} onClick={this.handleDrawButton}>Draw: {this.state.drawing_toggle ? "True" : "False"}</button> */}

          </Toolbar>
        </AppBar>

    {/* <button style={{ position:'absolute', left:'20%', zIndex: 10}} onClick={this.handleMapButton}>Navigation: {this.state.drawing_toggle ? "False" : "True"}</button>
    <button style={{ position:'absolute', left:'30%', zIndex: 10}} onClick={this.handleDelete}>Clear</button> */}

    {/* <form >
            <input style={{backgroundColor:'#00ff00' }} type="radio" value="#00ff00 " id="green"
              onChange={this.handleColor} name="color" style={{ transform: 2 }}/>
            <label for="green" style={{backgroundColor:'#00ff00' }}></label>

            <input type="radio" value="#ff0000" id="red"
              onChange={this.handleColor} name="color"/>
            <label for="red">Red</label>
      </form> */}

    <button value="#00ff00" onClick={this.handleColor}  style={{opacity:.8 ,position:'absolute',left:'2%',  zIndex: 10, backgroundColor:'#00ff00', border:'stripe', padding:'20px', borderRadius:'50%'}}></button>
    <button value="#ff0000" onClick={this.handleColor}  style={{opacity:.8 , position:'absolute',left:'5%',  zIndex: 10, backgroundColor:'#ff0000', border:'stripe', padding:'20px', borderRadius:'50%'}}></button>

    <PanZoom
        boundaryRatioVertical={0.8} 
        boundaryRatioHorizontal={0.8} 
        enableBoundingBox={true}
        style={{ border: 'solid 1px green', height: 1000, overflow: 'hidden'}}
        disabled={this.state.drawing_toggle}
       
        >

        <canvas style={{pointerEvents:this.state.drawing_toggle,
            }} id="panzoom-element"
        // We use the ref attribute to get direct access to the canvas element. 
            ref={(ref) => (this.canvas = ref)}
            onMouseDown={this.onMouseDown}
            onMouseLeave={this.endPaintEvent}
            onMouseUp={this.endPaintEvent}
            onMouseMove={this.onMouseMove}
            style={{zIndex: -10}}
        >
        </canvas>

                    
        </PanZoom>

    </div>



    </div>

    );
  }
}
export default Canvas;