console.log("responseController.js loaded");

exports.sendResponse = (req, res) => {
  res.json({ message: "Response from server" });
};
