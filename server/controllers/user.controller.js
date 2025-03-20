/*
###  License
Copyright (c) 2024 Cascarita.io

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

const {
  User,
  UserRoles,
  Role,
  Session,
  UserSessions,
  TeamsSession,
  Season,
  Team,
  Group,
} = require("../models");
const Db = require("../models");
const GroupController = require("./group.controller");
const getUserInfoFromAuth0 = require("../utilityFunctions/auth0");
const SessionController = require("./session.controller");

const UserController = function () {

  var createUser = async function (req, res, next) {
    try {
      const user = req.body;
      user.date = user.date_of_birth;

      const isNewUser = await isEmailUniqueWithinGroup(user.group_id, user.email);
      if (!isNewUser) {
        return res
          .status(400)
          .json({ error: "Email already exists within the group" });
      }

      let linkTeam = user.link_to_team === "yes" ? true : false;
      var createdUser;

      if (linkTeam) {
        createdUser = await createUserAndSession(user);
      } else {
        // If the user is not linked to a team, create the user without a session
        try {
          createdUser = await createNewUser(user.first_name, user.last_name, user.email, user.group_id, 1, user.photo, user.address, user.date, user.phone_number, false, null);
          return res.status(201).json(createdUser);
        } catch (error) {
          return res.status(500).json({
            error: `failed to create user: ${error.message}`,
          });
        }
      }

      if (createdUser.success) {
        return res.status(createdUser.status).json(createdUser.data);
      } else {
        return res.status(createdUser.status).json({ error: createdUser.error });
      }
    } catch (error) {
      next(error);
    }
  };

  var isEmailUniqueWithinGroup = async function (groupId, email) {
    let userFound = await User.findOne({
      where: {
        group_id: groupId,
        email: email,
      },
    });

    return userFound == null;
  };

  var registerUser = async function (req, res, next) {
    const {
      group_id,
      first_name,
      last_name,
      language_id,
      name,
      streetAddress,
      city,
      state,
      zipCode,
      logoUrl,
      group_code,
    } = req.body;

    const userBasicInfo = await getUserInfoFromAuth0(req.headers.authorization);

    let groupId = group_id;
    // const groups = await GroupController.getGroupByName(name);
    // groupId = groups[0].id;

    if (!groupId) {
      try {
        const newGroup = {
          name: name,
          street_address: streetAddress,
          city,
          state,
          zip_code: zipCode,
          logo_url: logoUrl,
        };

        groupId = await GroupController.createGroup(newGroup);
      } catch (error) {
        next(error);
      }
    } else {
      //check if group exists and if they have corresponding group code
      try {
        const existingGroup = await GroupController.findGroupById(groupId);
        if (!existingGroup) {
          res
            .status(404)
            .json({ error: `no group was found with id ${groupId}` });
          return;
        }

        if (existingGroup.group_code !== group_code) {
          res
            .status(401)
            .json({ error: "you are not authorized to join this group" });
          return;
        }
      } catch (error) {
        next(error);
      }
    }
    const auth0_first_name =
      userBasicInfo.given_name ||
      (userBasicInfo.name ? userBasicInfo.name.split(" ")[0] : "");

    const auth0_last_name =
      userBasicInfo.family_name ||
      (userBasicInfo.name
        ? userBasicInfo.name.split(" ").slice(1).join(" ")
        : "");

    let language = 1;
    if (language_id === "spanish") {
      language = 2;
    }

    first_name = first_name || auth0_first_name;
    last_name = last_name || auth0_last_name;
    language_id = language;
    group_id = groupId;
    let email = userBasicInfo.email;
    let picture = userBasicInfo.picture;
    let internally_created = false;

    try {
      const isNewUser = await isEmailUniqueWithinGroup(group_id, email);

      if (!isNewUser) {
        res.status(400);
        throw new Error("email is not unique");
      }

      var createdUser;
      try {
        createdUser = await createNewUser(first_name, last_name, email, group_id, language_id, picture, null, null, null, internally_created, null);
      } catch (error) {
        return res.status(500).json({
          error: `failed to create user: ${error.message}`,
        });
      }

      try {
        await assignRole(createdUser.id, "Admin", null);
      } catch (error) {
        return res.status(500).json({
          error: `failed to assign role to user with id ${createdUser.id}: ${error.message}`,
        });
      }

      return res.status(201).json(createdUser);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  var logInUser = function (req, res) {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    res.status(200).json({ user: req.user });
  };

  var getUserByUserId = async function (req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        res.status(400);
        throw new Error("user id must be an integer");
      }

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404);
        throw new Error(`no user was found with id ${id}`);
      }

      return res.json(user);
    } catch (error) {
      next(error);
    }
  };

  var updateUserById = async function (req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        res.status(400);
        throw new Error("user id must be an integer");
      }

      let currentUser = await User.findByPk(id);

      if (!currentUser) {
        res.status(404);
        throw new Error(`no user was found with id ${id}`);
      }

      Object.keys(req.body).forEach((key) => {
        currentUser[key] = req.body[key] ? req.body[key] : currentUser[key];
      });

      await currentUser.validate();
      await currentUser.save();

      res.json(currentUser);
    } catch (error) {
      next(error);
    }
  };

  var fetchUser = async function (req, res, next) {
    try {
      // Access the email from the query parameters
      const email = req.query.email;

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        return res.status(200).json(user);
      } else {
        // TODO Not the best practice below. Was previously .status(404)
        return res.json({
          message: `User with email: '${email}' not found.`,
          authorization: req.headers.authorization,
          isSigningUp: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch existing user:", error);
      next(error);
    }
  };

  var getPlayersByGroupId = async function (req, res, next) {
    try {
      const { group_id } = req.params;

      let users = await User.findAll({
        where: {
          group_id: group_id,
        },
        attributes: {
          exclude: ["created_at", "updated_at", "group_id", "language_id"],
        },
      });

      if (!users) {
        res.status(404);
        throw new Error(`no users were found with group id ${group_id}`);
      }

      const playerRole = await Role.findOne({
        where: {
          name: "player",
        },
      });
      if (playerRole === null) {
        res.status(404);
        throw new Error(`no role found with name 'player'`);
      }
      const userRoles = await UserRoles.findAll({
        where: {
          role_id: playerRole.id,
        },
      });

      if (!userRoles) {
        res.status(404);
        throw new Error(`no users were found with role 'player'`);
      }

      const usersWithPlayerRole = users.filter((user) =>
        userRoles.some((userRole) => userRole.user_id === user.id),
      );

      users = usersWithPlayerRole;

      let playersWithTeams = users;
      await Promise.all(
        users.map(async (user, index) => {
          const userSessions = await UserSessions.findAll({
            where: {
              user_id: user.id,
            },
          });
          let season_id;
          let division_id;
          let league_id;
          const teams = await Promise.all(
            userSessions.map(async (userSession) => {
              const team = await Team.findByPk(userSession.team_id);
              if (team) {
                const teamSession = await TeamsSession.findOne({
                  where: {
                    team_id: team.id,
                  },
                });
                const session = await Session.findByPk(teamSession.session_id);
                division_id = session.division_id;
                season_id = session.season_id;
                const season = await Season.findByPk(season_id);
                league_id = season.league_id;
                return {
                  id: team.id,
                  name: team.name,
                  session_id: teamSession.session_id,
                };
              }
            }),
          );
          const filteredTeams = teams.filter(
            (team) => team !== null && team !== undefined,
          );
          playersWithTeams[index].dataValues.teams = filteredTeams;
          playersWithTeams[index].dataValues.division_id = division_id;
          playersWithTeams[index].dataValues.season_id = season_id;
          playersWithTeams[index].dataValues.league_id = league_id;
        }),
      );

      users = playersWithTeams;
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  var updatePlayerTeams = async function (req, res, next) {
    try {
      const { user_id } = req.params;
      const { session_id, team_id } = req.body;

      let team_ref = team_id;
      if (team_id === -1) {
        team_ref = null;
      }

      const userSession = await UserSessions.findOne({
        where: {
          user_id: user_id,
          session_id: session_id,
        },
      });

      // making a new player team association
      if (!userSession) {
        await UserSessions.create({
          user_id,
          team_ref,
          session_id,
        });
      } else {
        // updating an existing player team association
        const teamUpdate = {
          team_id: team_ref,
        };
        userSession.team_id = team_ref;
        await userSession.update(teamUpdate);
      }

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };

  var getSession = async function (req, res, next) {
    try {
      const { division_id, season_id } = req.body;
      const session = await Session.findOne({
        where: {
          division_id,
          season_id,
        },
      });
      if (!session) {
        res.status(404);
        throw new Error(
          `no session found with division id ${division_id} and season id ${season_id}`,
        );
      }
      return res.status(200).json(session);
    } catch (error) {
      next(error);
    }
  };

  var getUsersByGroupId = async function (req, res, next) {
    try {
      const { group_id } = req.params;

      if (isNaN(group_id)) {
        res.status(400);
        throw new Error("group id must be an integer");
      }

      let users = await User.findAll({
        where: {
          group_id: group_id,
        },
        attributes: {
          exclude: ["created_at", "updated_at", "group_id", "language_id"],
        },
        include: [
          {
            model: UserRoles,
            required: false, // Use left join to include users without roles
            include: [
              {
                model: Role,
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      if (!users || users.length === 0) {
        res.status(404);
        throw new Error(`no users were found with group id ${group_id}`);
      }

      const usersWithRoles = users.map((user) => {
        const roles = user.UserRoles.map((userRole) => userRole.Role.name);
        return {
          ...user.toJSON(),
          user_roles: roles,
        };
      });

      return res.json(usersWithRoles);
    } catch (error) {
      next(error);
    }
  };

  var deleteUserById = async function (req, res, next) {
    try {
      let deleteUser = await User.destroy({
        where: {
          id: req.params["id"],
        },
      });

      if (deleteUser === 0) {
        throw new Error("no user found with the given id");
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  var updateUserById = async function (req, res, next) {
    try {
      let currentUser = await User.findOne({
        where: {
          id: req.params["id"],
        },
        // Cannot exlude password, created_at, updated_at because of "SequelizeValidationError: notNull Violation: password field is required" comming from "/server/models/user.js"
        // attributes: { exclude: ["password", "created_at", "updated_at"] },
      });

      if (!currentUser) {
        res.status(400);
        throw new Error("user with given id was not found");
      }

      if (req.body?.email) {
        const { group_id, email } = req.body;
        const existingUser = await User.findOne({ where: { group_id, email } });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "Email already exists within the group" });
        }
      }

      Object.keys(req.body).forEach((key) => {
        currentUser[key] = req.body[key] ? req.body[key] : currentUser[key];
      });

      await currentUser.validate();
      await currentUser.save();

      return res.status(200).json(currentUser);
    } catch (error) {
      next(error);
    }
  };

  var createUserAndSession = async function (user) {
    const transaction = await Db.sequelize.transaction();
    try {
      const existingUser = await User.findOne({
        where: {
          group_id: user.group_id,
          email: user.email,
        },
      });

      let currentUser;

      if (existingUser) {
        const updateData = {
          first_name: user.first_name,
          last_name: user.last_name,
          language_id: 1,
          picture: user.photo,
          date_of_birth: user.date,
          phone_number: user.phone_number,
          address: user.address,
          internally_created: true,
        };

        await existingUser.update(updateData, { transaction });
        currentUser = existingUser;
      } else {
        const language_id = 1;
        const internally_created = true;
        currentUser = await createNewUser(user.first_name, user.last_name, user.email, user.group_id, language_id, user.photo, user.address, user.date, user.phone_number, internally_created, transaction);
      }

      const session = await SessionController.getOrCreateSession(
        user,
        transaction,
      );

      await assignUserToSession(
        currentUser.id,
        session.id,
        user.team_id,
        transaction,
      );

      await assignRole(currentUser.id, "Player", transaction);

      await transaction.commit();

      return {
        success: true,
        data: currentUser,
        status: 201,
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: "Failed to create or update user",
        status: 500,
      };
    }
  };

  var assignUserToSession = async function (
    userId,
    sessionId,
    teamId,
    transaction,
  ) {
    const foundTeam = !isNaN(Number(teamId))
      ? await Team.findByPk(teamId, { transaction })
      : null;

    const [userSession] = await UserSessions.findOrCreate({
      where: { user_id: userId, session_id: sessionId },
      defaults: {
        user_id: userId,
        session_id: sessionId,
        team_id: foundTeam ? teamId : null,
      },
      transaction,
    });

    if (foundTeam && !userSession.team_id) {
      await userSession.update({ team_id: teamId }, { transaction });
    }
  };

  var assignRole = async function (userId, roleName, transaction) {
    const playerRole = await Role.findOne({
      where: {
        name: roleName,
      },
    });

    await UserRoles.findOrCreate({
      where: {
        user_id: userId,
        role_id: playerRole.id,
      },
      defaults: {
        user_id: userId,
        role_id: playerRole.id,
      },
      transaction,
    });
  };

  var getUserSettingsById = async function (req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        res.status(400).json({ error: "user id must be an integer" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: `no user was found with id ${id}` });
      }

      const group = await Group.findByPk(user.group_id);
      if (!group) {
        res
          .status(404)
          .json({ error: `no group was found with id ${user.group_id}` });
      }

      const UserRole = await UserRoles.findOne({
        where: {
          user_id: user.id,
        },
      });

      if (!UserRole) {
        res.status(404).json({
          error: `no user role was found with user id ${user.id}`,
        });
      }

      let groupCode = group.group_code;

      var userRole = await Role.findByPk(UserRole.role_id);
      if (!Role) {
        res.status(404).json({
          error: `no role was found with id ${UserRole.role_id}`,
        });
      }

      // Only admins and Staff are allowed to see the group code
      if (userRole.name !== "Admin" && userRole.name !== "Staff") {
        groupCode = "";
      }

      const userSettings = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_picture: user.picture,
        group_name: group.name,
        group_code: groupCode,
        group_logo: group.logo_url,
        role: userRole.name,
      };

      return res.json({ userSettings });
    } catch (error) {
      next(error);
    }
  };

  var createNewUser = async function (first_name, last_name, email, group_id, language_id, picture, address, date_of_birth, phone_number, internally_created, transaction) {
    try {
      const newUser = {
        first_name,
        last_name,
        email,
        group_id,
        language_id: language_id || 1,
        picture,
        address,
        date_of_birth,
        phone_number,
        internally_created,
      };

      await User.build(newUser).validate();
      const options = transaction ? { transaction } : {};
      let currentUser = await User.create(newUser, options);

      return currentUser;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        console.error('Create User Validation Error:', error.errors);
        throw new Error('Validation failed. Please check the data and try again.');
      }
      console.error('Database Error:', error);
      throw new Error('An error occurred while creating the user. Please try again later.');
    }
  }

  return {
    registerUser,
    logInUser,
    getUserByUserId,
    updateUserById,
    getUsersByGroupId,
    deleteUserById,
    updateUserById,
    fetchUser,
    getPlayersByGroupId,
    updatePlayerTeams,
    getSession,
    createUserAndSession,
    getUserSettingsById,
    createUser,
  };
};

module.exports = UserController();
