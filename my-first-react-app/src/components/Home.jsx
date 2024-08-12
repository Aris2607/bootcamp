import { Component } from "react";
import { commentsData } from "../data/CommentsData";
import Comments, { CommentSection } from "./Comments";

const UserComments = commentsData.map((user) => (
  <Comments key={user.id} user={user} />
));

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(count) {
    this.setState({ count });
  }
  render() {
    return (
      <div className="content">
        <h1>
          Hi, nama saya {this.props.person.name}, Saya dari bootcamp batch{" "}
          {this.props.person.batch}
        </h1>
        <p>
          You Clicked {this.state.count} {this.state.count > 0 ? "times" : ""}
        </p>
        <button onClick={() => this.handleClick(this.state.count - 1)}>
          (-)
        </button>
        <button onClick={() => this.handleClick(this.state.count + 1)}>
          (+)
        </button>
        <CommentSection
          total={commentsData.length}
          UserComments={UserComments}
        />
      </div>
    );
  }
}

export default Home;
