const jwtObj = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {
    session: false
  }
};

export const expressSession = {
  secret: "do cool stuff with node"
};

export default jwtObj;
