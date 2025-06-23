const express = require('express');
const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire').noCallThru();
chai.use(sinonChai);
const expect = chai.expect;

describe('userRouter.js testing', () => {
    let app,
        getUserStub,
        delUserStub;
    beforeEach(() => {
        
        getUserStub = sinon.stub();
        delUserStub = sinon.stub();
        userRouterStub = proxyquire('../../lib/routers/userRouter', {'../repository/userRepo' : {
            getUser : getUserStub,
            delUser : delUserStub,
        }});
       

        app = express();
        app.use(userRouterStub);
   
    });
    describe('basic call testing', () => {
        it('should call getUser', () => {
        return request(app)
            .get('/test@email')
            .send()
            .expect((res) => {
                expect(getUserStub).to.have.been.calledWith({email: 'test@email'});
            });
        });
    }); 
});
