const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const cartRepo = require('../repo/cart_repo');
const stockRepo = require('../repo/stock_repo');
const lockRepo = require('../repo/lock_repo');
const poService = require('../repo/po_service_repo');
const paymentService = require('../repo/payment_service_repo');

router.post('/:user_id/checkout', async (req, res, next) => {
    const userId = req.params.user_id;
    const payload = req.body;
    
    const cart = new cartRepo();

    Promise.map(payload, (item) => {
        const stock = await stockRepo.findOne({
            sku: item.sku
        });

        if (!stock) {
            throw new Error('Not Found');
        } else if (stock.stock < item.stock ) {
            throw new Error('Bad Request');
        }
    });

    await cart.checkout(userId, JSON.stringify(payload));
    res.send('OK');
});

router.post('/:user_id/order', async (req, res, next) => {
    const userId = req.params.user_id;
    const payload = req.body;
    
    const cartR = new cartRepo();
    const cart = JSON.parse(await cartR.get(userId));

    const lock = new lockRepo();

    await lock.acquire();

    Promise.map(payload, (item) => {
        const stock = await stockRepo.findOne({
            sku: item.sku
        });

        if (!stock) {
            throw new Error('Not Found');
        } else if (stock.stock < item.stock ) {
            throw new Error('Bad Request');
        }
    });
    const poId = await poService.createPo(payload);
    await paymentService.processPayment(poId);

    Promise.map(payload, (item) => {
        const stock = await stockRepo.findOne({
            sku: item.sku
        });

        await stockRepo.update(sku, {
            stock: stock.stock - item.stock
        })
    });

    lock.release();
    res.send('OK');
});

module.exports = router;
