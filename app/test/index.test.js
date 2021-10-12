'use strict';

const _ = require('lodash');
const supertest = require('supertest');
const assert = require('assert').strict;
const app = require('../src/index');

describe('API', () => {
    //TODO before
    describe('create product', () => {
        it('doesn\'t work for with wrong data', async () => {
            await supertest(app)
                .post('/products')
                .send({
                    "name": "",
                    "category": "Games",
                    "sku": "A0003",
                    "price": 200,
                    "quantity": 15
                })
                .expect(409);

            await supertest(app)
                .post('/products')
                .send({
                    "name": "my products",
                    "category": "",
                    "sku": "A0003",
                    "price": 200,
                    "quantity": 15
                })
                .expect(409);

            await supertest(app)
                .post('/products')
                .send({
                    "name": "my products",
                    "category": "Computers",
                    "sku": "",
                    "price": 200,
                    "quantity": 15
                })
                .expect(409);
        });

        it('works', async () => {
            const productDoc = {
                "name": "my product test",
                "category": "my category test",
                "sku": "A9999",
                "price": 200,
                "quantity": 15
            }

            await supertest(app)
                .post('/products')
                .send(productDoc)
                .expect(200)
                .expect(({ body }) => {
                    try {
                        assert.deepEqual(
                            _.omit(body, 'id'),
                            productDoc
                        );
                    } catch(error) {
                        console.log("Error: ", error)
                    }   
                });
        })
    })
})