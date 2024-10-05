const UserModel = ({
  username,
  email,
  phone,
  password,
  role = "user",
  isBlocked = false,
}) => {
  return {
    username,
    email,
    phone,
    password,
    role,
    isBlocked,
  };
};

module.exports = UserModel;
