import { Component } from "react";

class Comments extends Component {
  render() {
    return (
      <div className="ui comments">
        <div className="comment">
          <a className="avatar">
            <img src={this.props.user.imgURL} alt={this.props.user.name} />
          </a>
          <div className="content">
            <a className="author">{this.props.user.name}</a>
            <div class="metadata">
              <span class="date">{this.props.user.time}</span>
            </div>
            <div className="text">{this.props.user.content}</div>
            <div className="actions">
              <a className="reply">Reply</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class CommentSection extends Component {
  render() {
    return (
      <div className="comment-section">
        <div className="ui comments">
          <h3 className="ui dividing header">Comments</h3>
          {this.props.UserComments}
        </div>
      </div>
    );
  }
}

export default Comments;
