import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Augurk CLI Task', function () {

    describe('Publish command', function() {
        it('should succesfully publish', function(done: MochaDone) {
            this.timeout(1000);
        
            let tp = path.join(__dirname, 'publish.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
            tr.run();
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
            done();
        });

        it ('should succesfully publish with a version', function(done: MochaDone) {
            this.timeout(2000);

            let tp = path.join(__dirname, 'publish-version.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

            tr.run();
            assert.equal(tr.succeeded, true, "should have succeeded");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
            done();
        });
    
        it('should succesfully publish an individual group', function(done: MochaDone) {
            this.timeout(2000);
        
            let tp = path.join(__dirname, 'publish-individual-group.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
            tr.run();
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
            done();
        });

        it('should succesfully publish with additional arguments', function() {
            this.timeout(1000);
        
            let tp = path.join(__dirname, 'publish-additional-arguments.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
            tr.run();
            assert.deepEqual(tr.errorIssues, []);
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
        });

        it('logs warning if multiple product descriptions found', function(done: MochaDone) {
            this.timeout(1000);
        
            let tp = path.join(__dirname, 'publish-multiple-product-descriptions.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
            tr.run();
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 1, "should have a warning");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
            done();
        });
    });

    describe('Delete command', function() {
        it('it should succesfully delete', function(done: MochaDone) {
            this.timeout(1000);
        
            let tp = path.join(__dirname, 'delete.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
            tr.run();
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
        
            done();
        });
    });

    describe('Prune command', function() {
        it('it should succesfully prune', function(done: MochaDone) {
            this.timeout(1000);
        
            let tp = path.join(__dirname, 'prune.js');
            let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
            tr.run();
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
        
            done();
        });
    });
});