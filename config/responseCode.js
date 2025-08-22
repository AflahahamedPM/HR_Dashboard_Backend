module.exports = {
  returnCode: {
    validEmail: 101, //User email id is success, this account valid check
    emailNotFound: 103, //User email id not found / wrong email id
    passwordMismatch: 104, //Password is mismatch
    passwordMatched: 105, //Password matched
    userException: 106, //Exception in user account checking
    invalidSession: 108, //Session is not valid, relogin to generate new session and associate
    validSession: 109, //Valid session, user account is already login
    noDuplicate: 113, //no Duplicate content, can use it
    duplicate: 114, //Duplicate content, it can title or unique field in collection.
    moreSubscription: 117,
    invalidToken: 118,
    recordNotFound: 123,
    available: 124,
    notAvailable: 125,
    unAuthorized: 401, //	Unauthorized
    validationError: 128,
    success: 100, //	Success
    errror: 600, //	Exception / server errror,
  },
};
