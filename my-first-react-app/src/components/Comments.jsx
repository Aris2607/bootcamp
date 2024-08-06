import { faker } from "@faker-js/faker";

const Comments = ({ person }) => {
  return (
    <div className="ui comments">
      {/* <h3 className="ui dividing header">Comments</h3> */}
      <div className="comment">
        <a className="avatar">
          <img src={person.imgURL} alt={person.name} />
        </a>
        <div className="content">
          <a className="author">{person.name}</a>
          <div class="metadata">
            <span class="date">{person.time}</span>
          </div>
          <div className="text">{person.content}</div>
          <div className="actions">
            <a className="reply">Reply</a>
          </div>
        </div>
      </div>
      {/* <form className="ui reply form">
        <div className="field">
          <textarea></textarea>
        </div>
        <div className="ui blue labeled submit icon button">
          <i className="icon edit"></i> Add Reply
        </div>
      </form> */}
    </div>
  );
};

const UserComments = () => {
  return (
    <div className="comment-section">
      <div className="ui comments">
        <h3 className="ui dividing header">Comments</h3>
      </div>
      <Comments
        person={{
          name: faker.person.fullName(),
          imgURL: faker.image.avatar(),
          content: faker.lorem.sentence(),
          time: faker.date.soon().toString(),
        }}
      />
      <Comments
        person={{
          name: faker.person.fullName(),
          imgURL: faker.image.avatar(),
          content: faker.lorem.sentence(),
          time: faker.date.soon().toString(),
        }}
      />
      <Comments
        person={{
          name: faker.person.fullName(),
          imgURL: faker.image.avatar(),
          content: faker.lorem.sentence(),
          time: faker.date.soon().toString(),
        }}
      />
      <Comments
        person={{
          name: faker.person.fullName(),
          imgURL: faker.image.avatar(),
          content: faker.lorem.sentence(),
          time: faker.date.soon().toString(),
        }}
      />
      <Comments
        person={{
          name: faker.person.fullName(),
          imgURL: faker.image.avatar(),
          content: faker.lorem.sentence(),
          time: faker.date.soon().toString(),
        }}
      />
    </div>
  );
};

export default UserComments;
