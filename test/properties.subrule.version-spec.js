const test = require('ava');

const propertiesVersion = require('../rules/subrules/properties-version');

test('It should pass with valid semvers', t => {

    t.plan(3);

    t.is(propertiesVersion.processor('1.2.3'), undefined);
    t.is(propertiesVersion.processor('v1.0.0'), undefined);
    t.is(propertiesVersion.processor('1.2.3-alpha.10.beta.0+build.unicorn.rainbow'), undefined);
});