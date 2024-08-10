import React, { Component } from "react";
import axios from "axios";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      search: "",
    };
    this.refsCollection = {}; // untuk menyimpan semua refs
  }

  fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.unsplash.com/search/collections?client_id=ZQsYLNMLCNtH8L9310aMCP0o9AgO19myW5KD-NBTqKo&query=train"
      );
      this.setState({ result: response.data.results });
    } catch (err) {
      console.log("Error:", err);
    }
  };

  searchData = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/collections?client_id=ZQsYLNMLCNtH8L9310aMCP0o9AgO19myW5KD-NBTqKo&query=${this.state.search}`
      );
      this.setState({ result: response.data.results });
    } catch (err) {
      console.log("Error:", err);
    }
  };

  componentDidMount = async () => {
    await this.fetchData();
  };

  handleSearch = (e) => {
    this.setState({ search: e.target.value }, () => {
      if (this.state.search.length > 0) {
        this.searchData();
      } else {
        this.fetchData(); // Reset to default results if search is cleared
      }
    });
  };

  setRef = (id) => (element) => {
    this.refsCollection[id] = element;
  };

  render() {
    return (
      <div>
        <label>
          Search:
          <input
            type="text"
            name="search"
            id="search"
            value={this.state.search}
            onChange={this.handleSearch}
          />
        </label>
        <div className="gallery">
          {this.state.result.map((data) => (
            <div key={data.id} className="card" ref={this.setRef(data.id)}>
              <img src={data.cover_photo.urls.regular} alt={data.title} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
