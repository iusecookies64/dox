const { Document, User } = require("./models/index");

function socketHandler(socket) {
  // giving the initial state of the document
  socket.on("get-document-data", async (documentId, username) => {
    // joining socket in this room
    socket.join(documentId);
    try {
      const documentObj = await Document.findById(documentId);
      if (!documentObj) throw Error();
      socket.emit("document-data", documentObj);

      if (username) {
        // getting the user details
        const userDocument = await User.findOne({ username });
        if (!userDocument) return;

        // checking if room is present or not in userDocument
        const indx = userDocument.documents.findIndex((document) => {
          return document == documentId;
        });
        if (indx === -1) {
          userDocument.documents.push(documentId);
          userDocument.save();
        }
      }
    } catch (err) {
      console.log(err);
      console.log("Error in getting room data");
    }
  });

  socket.on("text-change", async (documentId, delta) => {
    // when socket is making changes we emit them to everyone in the room
    socket.to(documentId).emit("receive-change", delta);
  });

  socket.on("update-db", async (documentId, data) => {
    try {
      const documentObj = await Document.findById(documentId);
      documentObj.data = data;
      documentObj.save();
    } catch (err) {
      console.log("error in updating the document");
    }
  });

  socket.on("request-access", (documentId, username) => {
    socket.to(documentId).emit("request-access", username);
  });

  socket.on("give-access", async (documentId, username) => {
    socket.to(documentId).emit("new-editor", username);
    socket.emit("new-editor", username);
    // saving username as an editor
    const documentObj = await Document.findById(documentId);
    documentObj.editors.push(username);
    documentObj.save();
  });
}

module.exports = socketHandler;
