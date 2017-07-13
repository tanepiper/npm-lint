const test = require('ava');
const sinon = require('sinon');

const propertiesName = require('../bin/rules/subrules/properties-name');

test('Check that name is less than 214 characters', t => {
    t.plan(2);

    const context = {
        package: {
            name:
                'R062f9B5fgN7GYk83qpZt4qVO4CwZKPgsNQE973fQIHjvYp9rbn8BzfTPKB8PyVmv7Vt4lP8YDlJY2XbVC442QG7mC1tnCB9VQEiJBXP30UbBy16jWeQkANE209g8W9rBBkGz4A5JI89aTzDLla2cF5xyXSkiBA0wcVV5HAucstPfNLuCZJSA1xKUXBJvtHF8uD8sl8igeYSVPBLVs6hU2n'
        },
        errors: {
            insert: () => {}
        }
    };

    const spy = sinon.spy(context.errors, 'insert');
    propertiesName.processor(context)

    t.true(spy.called);
    t.true(spy.calledWith({message: `${'package.json'.yellow} "${'name'.blue}" property cannot be longer than 214 characters`}));
});

test('Check that name does not begin with .', t => {
    t.plan(2);

    const context = {
        package: {
            name:
                '.my-package'
        },
        errors: {
            insert: () => {}
        }
    };
    const spy = sinon.spy(context.errors, 'insert');

    propertiesName.processor(context)
    t.true(spy.calledWith({message: `${'package.json'.yellow} "${'name'.blue}" property cannot start with a . (dot) or _ (underscore)`}));

    context.package.name = '_my-package';
    propertiesName.processor(context)
    t.true(spy.calledWith({message: `${'package.json'.yellow} "${'name'.blue}" property cannot start with a . (dot) or _ (underscore)`}));
});

test('Check that name does not being with a capital letter', t => {
    t.plan(1);

    const context = {
        package: {
            name:
                'My-package'
        },
        errors: {
            insert: () => {}
        }
    };
    const spy = sinon.spy(context.errors, 'insert');
    propertiesName.processor(context);
    t.true(spy.calledWith({message: 'package.json "name" property cannot start with a capital letter'}));
});

test('Check that name does not contain non-URL-safe characters', t => {
    t.plan(3);

    const context = {
        package: {
            name:
                '/my-package'
        },
        errors: {
            insert: () => {}
        }
    };
    const spy = sinon.spy(context.errors, 'insert');
    propertiesName.processor(context);
    t.true(spy.calledWith({message: 'package.json "name" property cannot contain non-URL-safe characters'}));

    context.package.name = 'my_p?ckage';
    propertiesName.processor(context);
    t.true(spy.calledWith({message: 'package.json "name" property cannot contain non-URL-safe characters'}));

    context.package.name = 'my_package^';
    propertiesName.processor(context);
    t.true(spy.calledWith({message: 'package.json "name" property cannot contain non-URL-safe characters'}));
});

test('Check that name is passing when valid', t => {
    t.plan(1);

    const context = {
        package: {
            name:
                'my-package'
        },
        errors: {
            insert: () => {}
        }
    };
    const spy = sinon.spy(context.errors, 'insert');

    propertiesName.processor(context);
    t.false(spy.called);
});