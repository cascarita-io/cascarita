/*
###  License
Copyright (c) 2025 Cascarita.io

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use the Software for personal or academic purposes only, subject to the following conditions:

1. **Non-Commercial Use Only**:
   The Software may not be used, copied, modified, merged, published, distributed, sublicensed, or sold for commercial purposes or financial gain.

2. **No Redistribution for Sale**:
   The Software and its derivatives may not be sold, sublicensed, or otherwise distributed in exchange for any monetary or non-monetary compensation.

3. **Ownership**:
   The copyright holders retain all ownership and intellectual property rights of the Software. Any unauthorized use, duplication, or modification of the Software that violates this license will constitute a breach of copyright.

4. **Attribution**:
   The above copyright notice and this license must be included in all copies or substantial portions of the Software.

5. **Warranty Disclaimer**:
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

By using this Software, you agree to the terms and conditions stated herein. If you do not agree, you may not use, modify, or distribute this Software.
*/
"use strict";

const { User } = require("../models");
const {
  UserSchema,
  UserNotFoundSchema,
  UsersSchema,
  UpdateUserSchema,
  RegisterUserSchema,
} = require("../schemas/user.schema");
const { errorMessageSchema } = require("../schemas/utils.schema");
// const GroupController = require("./group.controller");
const getUserInfoFromAuth0 = require("../utilityFunctions/auth0");

const UserController = function () {
  var isEmailUniqueWithinGroup = async function (groupId, email) {
    let userFound = await User.findOne({
      where: {
        group_id: groupId,
        email: email,
      },
    });

    return userFound == null;
  };

  /*
    GET /api/users/groups/:group_id
  */
  var getUsersByGroupId = async function (req, res, next) {
    try {
      let { group_id } = req.params;
      group_id = parseInt(group_id, 10);

      if (isNaN(group_id)) {
        throw new Error("Group id must be an integer");
      }

      const users = await User.findAll({
        where: {
          group_id: group_id,
        },
      });

      if (!users) {
        const message = errorMessageSchema.parse({
          message: `No users were found within group with id: ${group_id}`,
        });
        return res.status(404).json(message);
      }

      const usersInGroup = UsersSchema.parse(
        users.map((user) => UserSchema.parse(user.dataValues)),
      );
      return res.status(200).json(usersInGroup);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    POST /api/users/groups/:group_id
  */
  var registerUserFromAuth0 = async function (req, res, next) {
    let { group_id } = req.params;
    group_id = parseInt(group_id, 10);

    if (isNaN(group_id)) {
      throw new Error("Group id must be an integer");
    }

    const userBasicInfo = await getUserInfoFromAuth0(req.headers.authorization);

    const first_name =
      userBasicInfo.given_name ||
      (userBasicInfo.name ? userBasicInfo.name.split(" ")[0] : "");

    const last_name =
      userBasicInfo.family_name ||
      (userBasicInfo.name
        ? userBasicInfo.name.split(" ").slice(1).join(" ")
        : "");

    const newUser = {
      first_name: first_name,
      last_name: last_name,
      email: userBasicInfo.email,
      picture: userBasicInfo.picture,
      language_id: 1,
      group_id: group_id,
    };

    try {
      const userFound = await isEmailUniqueWithinGroup(
        newUser.group_id,
        newUser.email,
      );

      if (!userFound) {
        const errorMessage = `Email already exists within the group ${newUser.group_id}: ${newUser.email}`;
        const message = errorMessageSchema.parse({ message: errorMessage });
        return res.status(400).json(message);
      }

      await User.build(newUser).validate();
      const result = await User.create(newUser);
      const registeredUser = UserSchema.parse(result.dataValues);
      return res.status(201).json(registeredUser);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    GET /api/users/:id
  */
  var getUser = async function (req, res, next) {
    try {
      let { user_id } = req.params;
      user_id = parseInt(user_id, 10);

      if (isNaN(user_id)) {
        throw new Error("user id must be an integer");
      }

      const user = await User.findByPk(user_id);
      if (!user) {
        const message = errorMessageSchema.parse({
          message: `No user was found with id: ${user_id}`,
        });
        return res.status(404).json(message);
      }
      const foundUser = UserSchema.parse(user.dataValues);
      return res.status(200).json(foundUser);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    POST /api/users/:id
  */
  var updateUser = async function (req, res, next) {
    try {
      let { user_id } = req.params;
      user_id = parseInt(user_id, 10);

      if (isNaN(user_id)) {
        throw new Error("user id must be an integer");
      }

      let user = await User.findByPk(user_id);

      if (!user) {
        const message = errorMessageSchema.parse({
          message: `No user was found with id: ${user_id}`,
        });
        return res.status(404).json(message);
      }

      const parsedBody = UpdateUserSchema.parse(req.body);

      Object.keys(parsedBody).forEach((key) => {
        user[key] = parsedBody[key] !== undefined ? parsedBody[key] : user[key];
      });

      await user.validate();
      user = await user.save();
      const updatedUser = UserSchema.parse(user.dataValues);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    DELETE /api/users/:id
  */
  var deleteUser = async function (req, res, next) {
    try {
      let { user_id } = req.params;
      user_id = parseInt(user_id, 10);

      if (isNaN(user_id)) {
        throw new Error("user id must be an integer");
      }

      let user = await User.findByPk(user_id);

      if (!user) {
        const message = errorMessageSchema.parse({
          message: `No user was found with id: ${user_id}`,
        });
        return res.status(404).json(message);
      }

      await User.destroy({
        where: {
          id: user_id,
        },
      });
      let deletedUser = await User.findByPk(user_id);
      if (!deletedUser) {
        return res.status(204).json();
      } else {
        const message = errorMessageSchema.parse({
          message: `Failure to delete user with id: ${user_id}`,
        });
        return res.status(500).json(message);
      }
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    GET /api/users
   */
  var getUserByEmail = async function (req, res, next) {
    try {
      // Access the email from the query parameters
      const email = req.query.email;

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        const validatedUser = UserSchema.parse(user);
        return res.status(200).json(validatedUser);
      } else {
        const notFoundResponse = UserNotFoundSchema.parse({
          message: `User with email: '${email}' not found.`,
          isSigningUp: true,
        });
        return res.status(404).json(notFoundResponse);
      }
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    POST /api/users
  */
  var addUser = async function (req, res, next) {
    try {
      const parsedBody = RegisterUserSchema.parse(req.body);
      const { first_name, last_name, email, group_id, language_id, picture } =
        parsedBody;

      // Check if email is unique within the group, so email can appear once per group but can appear across multiple groups
      const existingUser = await User.findOne({ where: { email, group_id } });
      if (existingUser) {
        const message = errorMessageSchema.parse({
          message: `Email already exists within the group ${group_id}: ${email}`,
        });
        return res.status(400).json(message);
      }

      const newUser = {
        first_name,
        last_name,
        email,
        language_id,
        group_id,
        picture,
      };

      await User.build(newUser).validate();
      const result = await User.create(newUser);
      const newUserCreated = UserSchema.parse(result.dataValues);
      return res.status(201).json(newUserCreated);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  return {
    registerUserFromAuth0,
    getUser,
    updateUser,
    getUsersByGroupId,
    deleteUser,
    addUser,
    getUserByEmail,
  };
};

module.exports = UserController();
