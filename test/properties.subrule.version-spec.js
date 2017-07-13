const test = require('ava');
const sinon = require('sinon');

const propertiesVersion = require('../rules/subrules/properties-version');

test('It should fail with invalid semvers', t => {
    t.plan(3);

    const context = {
        package: {
            version: 'latest'
        },
        errors: {
            insert: () => {}
        }
    };
    const spy = sinon.spy(context.errors, 'insert');

    propertiesVersion.processor(context);
    t.true(spy.calledWith({ message: `package.json "version" property is not a valid semver` }));

    context.package.version = 'https://github.com/tanepiper/npm-lint';
    propertiesVersion.processor(context);
    t.true(spy.calledWith({ message: `package.json "version" property is not a valid semver` }));

    context.package.version = '1,2.3';
    propertiesVersion.processor(context);
    t.true(spy.calledWith({ message: `package.json "version" property is not a valid semver` }));

});

test('It should pass with valid semvers', t => {
    t.plan(3);

    const context = {
        package: {
            version: '1.2.3'
        },
        errors: {
            insert: () => {}
        }
    };
    const spy = sinon.spy(context.errors, 'insert');

    propertiesVersion.processor(context);
    t.false(spy.called);

    context.package.version = 'v1.0.1';
    propertiesVersion.processor(context);
    t.false(spy.called);

    context.package.version = '1.2.3-alpha.10.beta.0+build.unicorn.rainbow';
    propertiesVersion.processor(context);
    t.false(spy.called);
});
