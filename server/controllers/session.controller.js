"use strict";

const { Session } = require("../models");

const SessionController = function () {
  var getSessionBySessionId = async function (req, res, next) {
    const sessionId = req.body.id;

    try {
      const result = await Session.findByPk(sessionId);

      if (!result) {
        res.status(404);
        throw new Error("session with given id does not exist");
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  var getSessionByDivisionAndSeasonId = async function (
    division_id,
    season_id,
  ) {
    const divisionId = division_id;
    const seasonId = season_id;

    try {
      const result = await Session.findOne({
        where: {
          division_id: divisionId,
          season_id: seasonId,
        },
      });

      return result.id;
    } catch (error) {
      throw new Error(
        `session not found for division_id: ${divisionId}, season_id: ${seasonId}`,
      );
    }
  };

  var getSessionByDivisionId = async function (req, res, next) {
    const divisionId = req.body.division_id;

    try {
      const result = await Session.findOne({
        where: {
          division_id: divisionId,
        },
      });

      if (!result) {
        res.status(404);
        throw new Error("session with given division id does not exist");
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  var createSession = async function (division_id, season_id) {
    const newSession = { division_id, season_id };

    try {
      await Session.build(newSession).validate();
      const result = await Session.create(newSession);

      return result;
    } catch (error) {
      throw error;
    }
  };

  var updateSession = async function (req, res, next) {
    try {
      let currentSession = await Session.findOne({
        where: {
          id: req.body.session_id,
        },
      });

      if (!currentSession) {
        res.status(404);
        throw new Error("session with given id was not found");
      }

      Object.keys(req.body).forEach((key) => {
        currentSession[key] = req.body[key]
          ? req.body[key]
          : currentSession[key];
      });

      await currentSession.validate();
      await currentSession.save();

      return res.status(200).json(currentSession);
    } catch (error) {
      next(error);
    }
  };

  var deleteSession = async function (req, res, next) {
    try {
      let deletedSession = await Session.destroy({
        where: {
          id: req.body.id,
        },
      });

      if (deletedSession === 0) {
        res.status(404);
        throw new Error("no session found with the given id");
      }

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };

  var getOrCreateSession = async function (sessionData, transaction) {
    let session = await Session.findOne({
      where: {
        season_id: sessionData.season_id,
        division_id: sessionData.division_id,
      },
      transaction,
    });

    if (!session) {
      session = await Session.create(
        {
          season_id: sessionData.season_id,
          division_id: sessionData.division_id,
        },
        { transaction },
      );
    }

    return session;
  };

  return {
    getSessionBySessionId,
    getSessionByDivisionId,
    getSessionByDivisionAndSeasonId,
    createSession,
    updateSession,
    deleteSession,
    getOrCreateSession,
  };
};

module.exports = SessionController();
