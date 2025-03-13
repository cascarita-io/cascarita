"use strict";
const UserController = require("../controllers/user.controller");

var createPayerUser = async function (formattedAnswers, groupId) {
    const user = getUserDataFromAnswers(formattedAnswers, groupId);
    const updatedUserResponse = await UserController.createUserViaFromResponse(user);
    const updatedUser = updatedUserResponse.data;
    const paymentData = {
        payer_id: updatedUser.id,
    };

    return paymentData;
};

var getUserDataFromAnswers = function (formattedAnswers, groupId) {
    const user = {
      first_name: formattedAnswers.first_name?.short_text,
      last_name: formattedAnswers.last_name?.short_text,
      email: formattedAnswers.email?.email,
      phone_number: formattedAnswers.phone_number?.phone_number,
      address: formattedAnswers.address?.long_text,
      date: formattedAnswers.date?.date,
      photo: formattedAnswers.photo?.photo,
      signature: formattedAnswers.signature?.short_text,
      liability: formattedAnswers.liability?.liability,
      team_id: formattedAnswers.player?.player?.team_id,
      team_name: formattedAnswers.player?.player?.team_name,
      league_name: formattedAnswers.player?.player?.league_name,
      league_id: formattedAnswers.player?.player?.league_id,
      season_name: formattedAnswers.player?.player?.season_name,
      season_id: formattedAnswers.player?.player?.season_id,
      division_name: formattedAnswers.player?.player?.division_name,
      division_id: formattedAnswers.player?.player?.division_id,
      payment_intent_id: formattedAnswers.payment?.paymentIntentId,
      payment_amount: formattedAnswers.payment?.amount,
      group_id: groupId,
    };

    return user;
};

module.exports = createPayerUser;
