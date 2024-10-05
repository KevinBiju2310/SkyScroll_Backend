const {
  signInUseCase,
  toggleBlockUseCase,
} = require("../../application/useCases/adminAuth");

const signIn = async (req, res) => {
  try {
    const response = await signInUseCase(req.body);
    res.status(201).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggleBlock = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await toggleBlockUseCase(userId);
    res.status(201).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signIn,
  toggleBlock,
};
