var VideoCardList = React.createClass({

  getInitialState() {
    console.log("getInitialState VideoCardList")
    return {
      videos: [],
      filterText: ''
    };
  },

  componentWillMount: function() {
    var self = this;

    // Inject YouTube API script
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $('#loading-gif').show();

    $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=UU29ju8bIPH5as8OGnQzwJyA&key=AIzaSyCjbqecI19O7sF6ASXXMEC2JaCz2t0LwAg", function(results) {

      $('#loading-gif').hide();

      $(".load-more-btn").val(results.nextPageToken);

      console.log(results)

      for (var i = 0; i < results.items.length; i++) {
        self.videoData(results.items[i].snippet.description.substring(0, 50), results.items[i].snippet.resourceId.videoId, results.items[i].snippet.thumbnails.medium.url);
      };

    })

  },

  uniqueKey: function() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  },

  videoData: function(description, videoID, thumbnail) {
    console.log("videoData function")
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

    if (video.description.indexOf(this.state.filterText) !== -1) {
      return (
          <VideoCard 
            key={video.id}
            index={i}
            description={video.description}
            thumbnail={video.thumbnail}
            videoID={video.videoID} />
        )
    }

  },
  handleUserInput: function(filterText) {
    // console.log("filterText")
    this.setState({
      filterText: filterText
    });
  },
  render: function() {
    // console.log("{this.state.filterText}:", this.state.filterText)
    return (<div className="video-list">
              <SearchBar
                filterText={this.state.filterText}
                onUserInput={this.handleUserInput}/>

              {this.state.videos.map(this.eachVideo)}
              <LoadMoreButton />
          </div>
    );
  }

});

var VideoCard = React.createClass({

  onYouTubePlayerAPIReady: function(videoID) {
    console.log(videoID)

    var player = document.getElementById('player');
    new YT.Player(player, {
        playerVars: {
            'autoplay': 1,
            'modestbranding': 1,
        },
        videoId: videoID
    });
  },

  render: function() {
     return (
      <div className="videoCard" onClick={this.onYouTubePlayerAPIReady.bind(null, this.props.videoID)}>
        <img src={this.props.thumbnail} />
        <p>{this.props.description}</p>
      </div>
      );
    }

});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search listed videos"
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}/>
      </form>
    );
  }
});

var LoadMoreButton = React.createClass({
  loadMoreVideos: function() {
    console.log("loadMoreVideos");

    var self = this;

    $.ajax({
      cache: false,
      data: $.extend({
          key: 'AIzaSyCjbqecI19O7sF6ASXXMEC2JaCz2t0LwAg',
          part: 'snippet',
          type:'video'
      }, {
        maxResults: 5,
        pageToken: $(".load-more-btn").val()
      }),
      dataType: 'json',
      type: 'GET',
      timeout: 5000,
      url: 'https://www.googleapis.com/youtube/v3/search'
    }).done(function(data) {
      console.log("data: ", data)
       if (typeof data.nextPageToken === "undefined") {
        $("#nextTokenPrev").hide();
      } else {
        $("#nextTokenPrev").show();
      }

      $("#pageTokenNext").val(data.nextPageToken);

      for (var i = 0; i < data.items.length; i++) {
        self.refs.videoData(data.items[i].snippet.description.substring(0, 50), data.items[i].snippet.resourceId.videoId, data.items[i].snippet.thumbnails.medium.url);
      };

    })


  },

  render: function() {
    return (
      <button className="load-more-btn" 
        id="pageTokenNext" 
        value="" 
        onClick={this.loadMoreVideos}
        refs="nextVideos">
      Load More
      </button>
    )
  }
})

ReactDOM.render(<VideoCardList />, document.getElementById('video-list-container'));
// ReactDOM.render(<SearchBar />, document.getElementById('search-container'));