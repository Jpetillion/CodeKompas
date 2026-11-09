'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {analyze}=require('../src/analyzer');
test('undeclared abbreviation of one visible name receives cautious actionable hint',()=>{const r=analyze('const aantalBoeken = 3; console.log(aantalB);','javascript');const hint=r.issues.find(x=>x.kind==='reference');assert.ok(hint);assert.match(hint.message,/hernoemd/);assert.match(hint.steps[0],/aanmaakt/);assert.ok(!JSON.stringify(hint).includes('aantalBoeken'));});
test('consistently renamed variables are accepted',()=>{assert.equal(analyze('const aantalB = 3; console.log(aantalB);','javascript').issues.length,0);});
test('two valid similar variable names do not produce a spelling warning',()=>{assert.equal(analyze('const aantalBoeken=3, aantalB=2; console.log(aantalB,aantalBoeken);','javascript').issues.length,0);});
test('abbreviation hints do not guess between multiple candidates or inaccessible scopes',()=>{for(const source of ['const aantalBoeken=3,aantalBorden=2; console.log(aantalB);','function f(){const aantalBoeken=3;} console.log(aantalB);'])assert.ok(!analyze(source,'javascript').issues.some(x=>x.message.includes('hernoemd')));});

test('renaming declaration to shorter name flags remaining old references',()=>{const r=analyze('const aantalB=3; console.log(aantalBoeken);','javascript');const hint=r.issues.find(x=>x.kind==='reference');assert.ok(hint);assert.match(hint.message,/hernoemd/);assert.match(hint.detail,/verwijzingen/);assert.equal(hint.word,'aantalBoeken');assert.ok(!hint.detail.includes('aantalB'));});
