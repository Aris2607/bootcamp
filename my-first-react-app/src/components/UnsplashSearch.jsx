import React, { Component } from "react";
import axios from "axios";

export default class UnsplashSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  searchImage() {
    const endpoint = `https://api.unsplash.com/search/collections?client_id=ZQsYLNMLCNtH8L9310aMCP0o9AgO19myW5KD-NBTqKo&query=${this.state.search}`;

    axios.get(endpoint).then((response) => console.log(response.data.results));
  }

  handleSearch(e) {
    this.setState({ search: e.target.value });
  }

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
          {this.searchImage()}
        </label>
      </div>
    );
  }
}
