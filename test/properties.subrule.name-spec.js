const test = require('ava');

const propertiesName = require('../rules/subrules/properties-name');

test('Check that name is less than 214 characters', t => {
    t.plan(1);

    const package1 = {
        name:
            'R062f9B5fgN7GYk83qpZt4qVO4CwZKPgsNQE973fQIHjvYp9rbn8BzfTPKB8PyVmv7Vt4lP8YDlJY2XbVC442QG7mC1tnCB9VQEiJBXP30UbBy16jWeQkANE209g8W9rBBkGz4A5JI89aTzDLla2cF5xyXSkiBA0wcVV5HAucstPfNLuCZJSA1xKUXBJvtHF8uD8sl8igeYSVPBLVs6hU2n'
    };

    t.is(propertiesName.processor(package1.name).message, 'package.json "name" property cannot be longer than 214 characters');
});

test('Check that name does not begin with . or _', t => {
    t.plan(2);

    const package1 = {
        name: '.my-package'
    };

    t.is(propertiesName.processor(package1.name).message, 'package.json "name" property cannot start with a . (dot) or _ (underscore)');

    const package2 = {
        name: '_my-package'
    };

    t.is(propertiesName.processor(package2.name).message, 'package.json "name" property cannot start with a . (dot) or _ (underscore)');
});

test('Check that name does not being with a capital letter', t => {
    t.plan(1);

    const package1 = {
        name: 'My-package'
    };

    t.is(propertiesName.processor(package1.name).message, 'package.json "name" property cannot start with a capital letter');
});

test('Check that name does not contain non-URL-safe characters', t => {
    t.plan(3);

    const package1 = {
        name: '/My_Package'
    };
    t.is(propertiesName.processor(package1.name).message, 'package.json "name" property cannot contain non-URL-safe characters');

    const package2 = {
        name: 'my_p?ckage'
    };
    t.is(propertiesName.processor(package2.name).message, 'package.json "name" property cannot contain non-URL-safe characters');

    const package3 = {
        name: 'my_package^'
    };
    t.is(propertiesName.processor(package3.name).message, 'package.json "name" property cannot contain non-URL-safe characters');
});

test('Check that name is passing when valid', t => {
    t.plan(1);

    const package1 = {
        name:
            'valid-module_name'
    };

    t.is(propertiesName.processor(package1.name), undefined);
});