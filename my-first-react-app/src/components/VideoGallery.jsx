import React, { Component, createRef } from "react";
import axios from "axios";

export default class VideoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      value: { url: "", title: "" },
      search: "",
      isLoading: false,
    };
    this.inputRef = createRef(null);
  }

  fetchData = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: this.state.search || "Kyoto snowy day",
            type: "video",
            maxResults: 5,
            key: "AIzaSyDXNRuT6KELJm-wpom4HuKkIsTXR7tFjG4",
          },
        }
      );
      this.setState({ result: response.data.items, isLoading: false }); // Reset loading state
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.fetchData();
    }
  }

  handleSearch = () => {
    const value = this.inputRef.current.value;
    this.setState({ search: value });
  };

  render() {
    const { result, value, isLoading } = this.state;

    console.log(result);

    return (
      <div>
        <div className="search-video">
          <input
            type="text"
            name="search"
            className="search"
            id="search"
            ref={this.inputRef}
            placeholder="Search..."
          />
          <button onClick={this.handleSearch}>
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div
          className="video-container"
          style={{ textAlign: "center", padding: "20px" }}
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            result.length > 0 && (
              <>
                <div className="main-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      value.url || result[0].id.videoId
                    }`}
                    title={result[0].snippet.title}
                    width="640"
                    height="360"
                    allowFullScreen
                    style={{ border: "none" }}
                  ></iframe>
                  <p>{value.title || result[0].snippet.title}</p>
                </div>

                <div className="video-thumbnail">
                  {result.map((video) => (
                    <div key={video.id.videoId} className="thumbnail">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        onClick={() =>
                          this.setState({
                            value: {
                              url: video.id.videoId,
                              title: video.snippet.title,
                            },
                          })
                        }
                      />
                      <p>{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    );
  }
}
