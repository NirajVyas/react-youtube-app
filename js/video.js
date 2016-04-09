var VideoCardList = React.createClass({

  getInitialState() {
    console.log("getInitialState VideoCardList")
    return {
      videos: []
    };
  },

  componentWillMount: function() {
    var self = this;
    $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UU29ju8bIPH5as8OGnQzwJyA&key=AIzaSyCjbqecI19O7sF6ASXXMEC2JaCz2t0LwAg", function(results) {

      console.log(results)

      for (var i = 0; i < results.items.length; i++) {
        self.videoData(results.items[i].snippet.description.substring(0, 50), results.items[i].snippet.resourceId.videoId, results.items[i].snippet.thumbnails.medium.url);
      }

    })
  },

  uniqueKey: function() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  },

  videoData: function(description, videoID, thumbnail) {
    var arr = this.state.videos;
    arr.push({
      id: this.uniqueKey(),
      videoID: videoID,
      thumbnail: thumbnail,
      description: description
    });

    // console.log(this.state.videos)
    this.setState({videos:arr})
  },

  eachVideo: function(video, i) {
    return (
        <VideoCard 
          key={video.id}
          index={i}
          description={video.description}
          thumbnail={video.thumbnail}
          videoID={video.videoID} />
      )
  },
  render: function() {
    return (<div className="video-list">
              {this.state.videos.map(this.eachVideo)}
          </div>
    );
  }

});

var VideoCard = React.createClass({

  // getInitialState() {
  //   console.log("getInitialState VideoCard");
  //   return {
  //     videos: []
  //   };
  // },

  // render: function() {
  //  return (
  //       <div className="video"
  //       </div>
  //       );
  // },

  // componentWillMount: function() {
  //   var self = this;
  //   $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UU29ju8bIPH5as8OGnQzwJyA&key=AIzaSyCjbqecI19O7sF6ASXXMEC2JaCz2t0LwAg", function(results) {

  //     console.log(results)

  //     for (var i = 0; i < results.items.length; i++) {
  //       self.videoData(results.items[i].snippet.description.substring(0, 50), results.items[i].snippet.resourceId.videoId, results.items[i].snippet.thumbnails.medium.url);
  //     }

  //   })
  // },

  // uniqueKey: function() {
  //   this.uniqueId = this.uniqueId || 0;
  //   return this.uniqueId++;
  // },

  // videoData: function(description, videoID, thumbnail) {
  //   var arr = this.state.videos;
  //   arr.push({
  //     id: this.uniqueKey(),
  //     videoID: videoID,
  //     thumbnail: thumbnail,
  //     description: description
  //   });

  //   // console.log(this.state.videos)
  //   this.setState({videos:arr})
  // },


  // playVideo: function(videoID) {
  //   console.log("videoID: ", videoID)
  // },

  // render: function() {

  //   // Variables required by the youtube API.
  //   // var tag,
  //   //     firstScriptTag,
  //   //     YT;

  //   //   tag = document.createElement('script');
  //   //   tag.src = "https://www.youtube.com/iframe_api";

  //   //   firstScriptTag = document.getElementsByTagName('script')[0];
  //   //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  //   var playVideoFunction = this.playVideo();

  //   var videoDetails = this.state.videos.map(function(video) {
  //     return <div key={video.id} className="video-tile" onClick={playVideoFunction}>
  //               <div className="video-image"><img src={video.thumbnail} /></div>
  //               <div className="video-description">{video.description}</div>
  //           </div>
  //   });
  //   // console.log("videoDetails: ", videoDetails)
  //   return <div>{videoDetails}</div>

  // }

    render: function() {
       return (
        <div className="videoCard">
          <p>{this.props.description}</p>
          <p>{this.props.thumbnail}</p>
          <p>{this.props.videoID}</p>
        </div>
        );
      }


});

ReactDOM.render(<VideoCardList />, document.getElementById('video-list-container'));