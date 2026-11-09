'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {analyze}=require('../src/analyzer');
const {harness}=require('./host-mock');
const scan=(code,language,options={})=>analyze(code,language,{maxHints:100,maxPrinciples:30,...options});
const cases=[
 ['python','pritn("hoi")','order'],['python','Print("hoi")','case'],['python','for i in rnage(3):\n    print(i)','order'],
 ['python','if True\n    print("hoi")','syntax'],['python','if True:\nprint("hoi")','syntax'],['python','if x = 3:\n    pass','syntax'],
 ['python','if True:\n \tprint("hoi")','syntax'],['python','print((1 + 2)','syntax'],['python','print("hoi)','syntax'],
 ['python','aantal_boeken = 3\nprint(aantal_boeekn)','reference'],
 ['python','def test():\n    retrun 1','order'],
 ['csharp','Console.Writeline("hoi");','case'],['csharp','Consle.WriteLine("hoi");','missing'],
 ['csharp','Math.Ruond(2.4);','order'],['csharp','int aantalBoeken = 3; Console.WriteLine(aantalBoeekn);','reference'],
 ['csharp','class A { void F() { Console.WriteLine(1); }','syntax'],['csharp','Console.WriteLine("hoi);','syntax'],
 ['csharp','class A { statci int x = 1; }','order']
];
for(const [lang,code,kind] of cases)test(lang+' detects '+JSON.stringify(code),()=>{const r=scan(code,lang);assert.ok(r.issues.some(x=>x.kind===kind),JSON.stringify(r.issues));for(const x of r.issues){assert.ok(x.start>=0&&x.end<=code.length);assert.equal(x.word,code.slice(x.start,x.end));assert.ok(x.detail&&x.steps.length);}});
const valid=[
 ['python','aantal = 3\nprint(aantal)'],['python','def bereken(aantal):\n    return aantal * 2\nprint(bereken(2))'],
 ['python','if True:\n    print("if x = 3: pritn")\n# pritn(1)'],['python','items = [\n    1,\n  2,\n]\nprint(items)'],
 ['python','if (\n    True\n):\n    print("ja")'],['python','if True: print("ja")'],
 ['python','tekst = """\npritn( x {\nif y\n"""\nprint(tekst)'],['python','Print = print\nPrint(1)'],
 ['python','from custom import Print\nPrint(1)'],['python','if (a := 2):\n    print(a)'],
 ['python','def f():\n  return 2'],['python','if True:\n    # comment\n    print(1)'],
 ['csharp','using System;\nclass Program { static void Main() { int aantal = 3; Console.WriteLine(aantal); } }'],
 ['csharp','// Console.Writeline(\n/* Math.Ruond( */\nConsole.WriteLine("Console.Writeline(");'],
 ['csharp','var tekst = @"een ""quote""\n{ haakje";'],['csharp','var tekst = """\n{ Console.Writeline(\n""";'],
 ['csharp','var tekst = $"Hallo {naam}";'],['csharp','int @class = 3; Console.WriteLine(@class);'],
 ['csharp','class Console { public static void Writeline(string text) {} } Console.Writeline("ok");']
];
for(const [lang,code] of valid)test(lang+' accepts '+JSON.stringify(code),()=>assert.deepEqual(scan(code,lang).issues,[]));
for(const language of ['python','csharp']){
 test(language+' principles follow language and settings',()=>{const code=language==='python'?'def f():\n    return 3':'class A { int F() { return 3; } }';const r=scan(code,language);assert.ok(r.principles.some(p=>p.id==='functions'));assert.ok(r.principles.some(p=>p.id==='naming'));assert.ok(!r.principles.some(p=>['es6','dom','gestalt'].includes(p.id)));assert.equal(scan(code,language,{principles:false}).principles.length,0);assert.ok(!scan(code,language,{disabledPrinciples:['functions']}).principles.some(p=>p.id==='functions'));});
 test(language+' lifecycle and delivered bundle',()=>{const h=harness('../dist/extension');try{h.doc.languageId=language;h.doc.text=language==='python'?'pritn(1)':'Console.Writeline(1);';h.doc.version++;h.handlers.save(h.doc);assert.ok(h.messages.at(-1).data.issues.length);h.doc.text=language==='python'?'print(1)':'Console.WriteLine(1);';h.doc.version++;h.handlers.save(h.doc);assert.equal(h.messages.at(-1).data.issues.length,0);h.doc.text=language==='python'?'pritn(1)':'Console.Writeline(1);';h.doc.version++;h.handlers.save(h.doc);assert.ok(h.view.badge.value>0);}finally{h.dispose();}});
}
test('new language hints respect ignore words and limits',()=>{assert.equal(scan('pritn(1)','python',{ignoreWords:['pritn']}).issues.length,0);const r=scan('pritn(1)\nPrint(2)','python',{maxHints:1});assert.equal(r.issues.length,1);assert.equal(r.total,2);});
test('C# simple Console instruction missing terminator gets a structural hint',()=>{assert.ok(scan('Console.WriteLine("hoi")','csharp').issues.some(x=>x.message.includes('afgesloten')));assert.deepEqual(scan('Console.WriteLine("hoi")\n;','csharp').issues,[]);});
test('shortened declarations leave a hint at old references in both languages',()=>{for(const [lang,code] of [['python','aantal_b = 3\nprint(aantal_boeken)'],['csharp','int aantalB = 3; Console.WriteLine(aantalBoeken);']])assert.ok(scan(code,lang).issues.some(x=>x.message.includes('hernoemd')));});
test('Python indentation switch does not disable missing-block checks',()=>{assert.ok(scan('if True:\nprint(1)','python',{indentationHints:false}).issues.some(x=>x.kind==='syntax'));assert.deepEqual(scan('if True:\n \tprint(1)','python',{indentationHints:false}).issues,[]);});
