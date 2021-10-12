'use strict';

const _ = require('lodash');
const supertest = require('supertest');
const assert = require('assert').strict;
const app = require('../src/index');
const db = require('../src/models');

describe('API', async () => {
    before(async () => {
        await db.deleteAll();
    });

    //TODO before
    describe('get list', async () => {
        let products;

        beforeEach(async () => {
            products = await db._initDb();
        });

        it('get all products', async () => {

            await supertest(app)
                .get('/products')
                .expect(200)
                .expect(async ({ body }) => {

                    const objTrim = body.map(async (product) => {
                        await _.omit(product, ['id', 'createdAt', 'updatedAt']);
                    });
                    assert.deepEqual(await objTrim, products);
                });
        })
    });

    describe('create product', async () => {
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

            // add productDoc to db
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
                    } catch (error) {
                        console.log("Error: ", error)
                    }
                });
        })
    });

    describe('find a product by name', async () => {

        it('doesn\'t work if product is not found', async () => {
            await supertest(app)
                .delete('/products/name/my product not exist')
                .expect(404);
        });

        it('works', async () => {
            // get product  by name from db 
            await supertest(app)
                .get('/products/name/my product test')
                .expect(200)
                .expect(async ({ body }) => {
                    assert.deepEqual(_.omit(body, ['id', 'createdAt', 'updatedAt']), productDoc);
                });
        })
    });

    describe('update', async () => {
        let data = {
            "name": "my product test",
            "category": "my category test",
            "sku": "A9999",
            "price": 200,
            "quantity": 15
        }
        let element;
        let id;

        beforeEach(async () => {
            element = await db.findProducts({ 'name': 'my product test' });
            id = element[0].id;
        });

        it('doesn\'t work if product is not found', async () => {
            await supertest(app)
                .put('/products/id/606e19f3bbb0134d20dda99b')
                .expect(409);
        });

        it('works', async () => {
            await supertest(app)
                .put(`/products/id/${id}`)
                .send({
                    name: 'my product test updated',
                    category: "my category test",
                    sku: "A9999",
                    price: 200,
                    quantity: 15
                })
                .expect(200)
                .expect(({ body }) => {
                    assert.deepEqual(
                        _.omit(body, ['id', 'createdAt', 'updatedAt']),
                        {...data, name: 'my product test updated'}
                    );
                });

            const newDoc = await db.findProductById(id);

            assert(newDoc.name === 'my product test updated');
        });

    });

    describe('delete', async () => {
        let element;
        let id;

        beforeEach(async () => {
            element = await db.findProducts({ 'name': 'my init product 3' });
            id = element[0].id;
        });

        it('doesn\'t work if product is not found', async () => {
            await supertest(app)
                .delete('/products/id/606e19f3bbb0134d20dda99b')
                .expect(404);
        });

        it('works', async () => {
            await supertest(app)
                .delete(`/products/id/${id}`)
                .expect(204);

            assert(!await db.findProductById(id));
        });
    });


})