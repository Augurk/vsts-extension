import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Augurk CLI Task', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succesfully publish', function(done: MochaDone) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'publish.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('it should succesfully delete', function(done: MochaDone) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'delete.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    
        done();
    });

    it('it should succesfully prune', function(done: MochaDone) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'prune.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    
        done();
    });
});