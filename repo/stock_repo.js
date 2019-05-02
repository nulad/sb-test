const models = require('../models/index.js');
const Stocks = models.Stocks;

exports.findOne = async (where) => {
    try {
        const result = await Stocks.findOne({
            where
        });

        return result;
    } catch (err) {
        throw err;
    }
};

exports.update = async (id, payload) => {
    try {
        const result = await Stocks.update(payload, {
            where: {
                sku: id
            }
        });

        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = exports;