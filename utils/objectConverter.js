// A function that take an array of user objects
// remove the senitive infos like password then return the rest of the object

exports.userResponse = (Users) => {
  const userResult = [];

  Users.forEach((user) => {
    userResult.push({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  });

  return userResult;
};
