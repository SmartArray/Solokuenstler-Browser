import React from 'react';

import { OpenVidu } from 'openvidu-browser';

class TestForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };

    this.setup();
  }

  setup = () => {
    this.video = null;
    this.subscriber = null;
    this.publisher = null;
    this.OV = new OpenVidu();
    this.session = this.OV.initSession();

    this.session.on('streamCreated', (event) => {
      const subscriber = this.session.subscribe(event.stream, 'video-container');
      subscriber.on('videoElementCreated', (event) => {
        this.video = event.element;
        console.log('Subscriber added: ', subscriber.stream.connection);
      });
    });

    this.session.on('connectionDestroyed', (event) => {
      console.log('connectionDestroyed', event);
    });

    this.session.on('sessionDisconnected', (event) => {
      console.log('sessionDisconnected', event);
    });

    this.session.on('streamDestroyed', (event) => {
      console.log('streamDestroyed', event);
    });
  }

  handleChange = (event) => {
    this.setState({ token: event.target.value });
  }

  initVideo = () => {
    if (this.state.token.includes('PUBLISHER')) {
      this.publisher = this.OV.initPublisher('video-container', {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: undefined, // The source of video. If undefined default webcam
        publishAudio: true,   // Whether you want to start publishing with your audio unmuted or not
        publishVideo: true,   // Whether you want to start publishing with your video enabled or not
        resolution: '640x480',  // The resolution of your video
        frameRate: 30,          // The frame rate of your video
        insertMode: 'REPLACE', // How the video is inserted in the target element 'video-container'
        mirror: false         // Whether to mirror your local video or not
      });

      // When our HTML video has been added to DOM...
      this.publisher.on('videoElementCreated', (event) => {
        // document.querySelector("#main-video video").srcObject = event.element.srcObject;
        event.element.setAttribute('muted', true);
      });

      this.session.publish(this.publisher);
    }    
  }

  handleSubmit = (event) => {
    document.getElementById("hidden-video").play(); // User gesture hack SAFARI
    event.preventDefault();

    const token = this.state.token;
    this.subscriber = this.session.connect(token).then(() => {
      this.initVideo();
    }).catch(e => {
      // Example:
      // Unable to join session. Session ses_XXXXXXX cannot be found. Code: 202
      alert(e.message); 
    });
  }

  play = () => {
    this.video.play();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div id="video-container">
            {/* <video width="320" height="240" id="video"></video> */}
          </div>

          <video id="hidden-video"></video>

          <br />

          <label>
            Enter Your Token:
            <input
              type="text"
              value={this.state.token}
              onChange={this.handleChange}
            />
          </label>

          <input type="submit" value="Submit" />
        </form>

        <button onClick={this.play}>
          Play video
        </button>
      </div>
    );
  }
}

export default TestForm;