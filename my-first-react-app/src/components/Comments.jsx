import { Component } from "react";

class Comments extends Component {
  render() {
    return (
      <div className="ui comments">
        <div className="comment">
          <a className="avatar">
            <img src={this.props.imgURL} alt={this.props.name} />
          </a>
          <div className="content">
            <a className="author">{this.props.name}</a>
            <div class="metadata">
              <span class="date">{this.props.time}</span>
            </div>
            <div className="text">{this.props.content}</div>
            <div className="actions">
              <a className="reply">Reply</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const CommentSection = ({ UserComments }) => {
  return (
    <div className="comment-section">
      <div className="ui comments">
        <h3 className="ui dividing header">Comments</h3>
        {UserComments}
      </div>
    </div>
  );
};

export default Comments;
