class Message {
    constructor(id, content, userName , email) {
        this.id = id;  // Unique identifier for each message
        this.content = content;  // The content of the message
        this.userName = userName;  // The user who sent the message
        this.timestamp = new Date();  // Timestamp of when the message was created
        this.email = email;
    }
}

module.exports = Message;