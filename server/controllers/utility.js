/**
 * Retrieves an instance of a model by its primary key. Throws an error
 * and sets the response status to 404 if the id is not found.
 *
 * @param {Response} res The Express response object
 * @param {*} model A Sequelize model class
 * @param {number} id The primary key of the model
 * @returns The instance of the model associated with the primary key.
 */
const modelByPk = async (res, model, id) => {
  const instance = await model.findByPk(id);
  if (!instance) {
    res.status(404);
    throw new Error(`no such ${model.name} found for id ${id}`);
  }

  return instance;
};

module.exports = modelByPk;
