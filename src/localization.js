'use strict';
const catalogs={nl:require('./locales/nl.json'),en:require('./locales/en.json'),tr:require('./locales/tr.json'),ar:require('./locales/ar.json'),ru:require('./locales/ru.json')};
const languages=Object.keys(catalogs),normalize=l=>languages.includes(l)?l:'nl';
function lessonKey(x){
 const map={'html-attribute-separator':'htmlAttribute','html-attribute-assignment':'htmlAttribute','unexpected-equals-sign-before-attribute-name':'htmlAttribute','unexpected-character-in-attribute-name':'htmlAttribute','html-tag-close':'htmlTag','end-tag-with-trailing-solidus':'htmlTag','end-tag-with-attributes':'htmlTag','html-nesting':'nesting','html-duplicate-id':'duplicate','html-duplicate-attribute':'duplicate','html-attribute-quote':'quote','eof-in-comment':'quote','css-quote-comment':'quote','missing-attribute-value':'value','missing-whitespace-between-attributes':'separators','unexpected-character-in-unquoted-attribute-value':'quote','css-colonexpected':'cssConnection','css-semicolonexpected':'endStatement','css-propertyvalueexpected':'value','css-propertyexpected':'cssConnection','css-stringliteralexpected':'quote','hexColorLength':'color','argumentsInColorFunction':'color','css-numberexpected':'unit','css-unit':'unit','css-casing':'cssCase','indentation-mixed':'indent','css-varnameexpected':'reference','css-commaexpected':'separators','css-mediaqueryexpected':'comparison','css-conditionexpected':'comparison','js-assignment-value':'value','js-condition-assignment':'comparison','js-member-separator':'member','js-handler-call':'callback','js-collection-member':'collection','html-image-alt':'accessibility','js-delimiters':'brackets','js-split-name':'separators','js-parse':'syntax'};
 if(map[x.rule])return map[x.rule];
 if(/^css-[lr](?:curly|parent|bracket)expected$/.test(x.rule||''))return 'brackets';
 const m=x.message||'';
 for(const [re,key] of [[/tekst of commentaar/,'quote'],[/haakje/,'brackets'],[/tabs en spaties/,'indent'],[/blok/,'block'],[/toekennen of vergelijken/,'comparison'],[/instructie volledig afgesloten/,'endStatement']])if(re.test(m))return key;
 return x.kind||'syntax';
}
const examples={names:{javascript:'const aantalStoelen = 4;\nconsole.log(aantalStoelen);',python:'aantal_stoelen = 4\nprint(aantal_stoelen)',csharp:'int aantalStoelen = 4;\nConsole.WriteLine(aantalStoelen);',css:'.kaart { border-color: teal; }',html:'<section title="Welkom">Tekst</section>'},brackets:{javascript:'const groepen = [[1, 2], [3, 4]];',python:'groepen = [[1, 2], [3, 4]]',csharp:'int[][] groepen = { new[] { 1, 2 }, new[] { 3, 4 } };',css:'.kaart { transform: translate(2px, 3px); }',html:'<section><em>Tekst</em></section>'},blocks:{python:'for kleur in kleuren:\n    print(kleur)\nprint("Klaar")',csharp:'foreach (var kleur in kleuren)\n{\n    Console.WriteLine(kleur);\n}',javascript:'for (const kleur of kleuren) {\n  console.log(kleur);\n}',css:'.kaart {\n  padding: 1rem;\n}',html:'<section>\n  <p>Tekst</p>\n</section>'},quotes:{python:'bericht = "Welkom"\nprint(bericht)',csharp:'string bericht = "Welkom";\nConsole.WriteLine(bericht);',javascript:'const bericht = "Welkom";\nconsole.log(bericht);',css:'.kaart::before { content: "Welkom"; }',html:'<p title="Welkom">Tekst</p>'}};
function near(a,b){a=a.toLowerCase();b=b.toLowerCase();if(a===b)return true;if(Math.abs(a.length-b.length)>2)return false;let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const n=[i];for(let j=1;j<=b.length;j++)n[j]=Math.min(n[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=n;}return row[b.length]<=2;}
function exampleFor(key,language,word=''){
 const group=key==='quote'?'quotes':['block','indent','convention'].includes(key)?'blocks':['brackets','nesting','htmlTag'].includes(key)?'brackets':'names',sample=examples[group][language];
 return sample&&!(word.length>=3&&[...sample.matchAll(/[\p{L}_][\p{L}\p{N}_]*/gu)].some(m=>near(word,m[0])))?sample:null;
}
function localizeIssue(item,language,codeLanguage){
 const lang=normalize(language),c=catalogs[lang],key=lessonKey(item),lesson=c.lessons[key]||c.lessons.syntax,example=exampleFor(key,codeLanguage,item.word||'');
 if(lang==='nl')return {...item,example};
 const end=lesson.search(/[.?]/),title=end<0?lesson:lesson.slice(0,end+1);
 return {...item,example,original:{message:item.message,detail:item.detail,why:item.why,steps:item.steps},message:title,detail:lesson,why:'',family:'',context:{javascript:'JavaScript',python:'Python',csharp:'C#',html:'HTML',css:'CSS'}[codeLanguage]||'',steps:[lesson,c.ui.checkBefore,c.ui.recheck]};
}
function localize(data,language){
 const lang=normalize(language),c=catalogs[lang],result={...data,language:lang,ui:c.ui,issues:data.issues.map(x=>localizeIssue(x,lang,data.codeLanguage))};
 if(lang==='nl')return result;
 result.patternGuide=['letters','shape','case','separators','brackets','reference','indent','syntax'].map(k=>({title:c.lessons[k].split(/[.?]/)[0],text:c.lessons[k]}));
 result.principles=data.principles.map(x=>{
  let id=x.id;if(id==='naming'&&data.codeLanguage==='python')id='pyNames';if(id==='naming'&&data.codeLanguage==='csharp')id='csNames';if(id==='scope'&&data.codeLanguage==='python'&&/inspring/.test(x.title))id='pyBlocks';
  const text=c.concepts[id]||c.concepts.scope,split=text.indexOf(':');
  return {...x,original:{title:x.title,detail:x.definition+' '+x.explanation,why:x.reason,steps:[x.question]},title:split<0?text:text.slice(0,split),definition:split<0?text:text.slice(split+1).trim(),explanation:text,reason:c.ui.conceptReason,question:c.ui.conceptQuestion};
 });
 const notice=data.notice||'';result.notice=!data.file?c.ui.open:data.paused?c.ui.paused:data.enabled===false?c.ui.disabled:/te groot/.test(notice)?c.ui.large:/lukte niet/.test(notice)?c.ui.failed:/wachten/.test(notice)?c.ui.waiting:'';result.principleNotice='';return result;
}
module.exports={catalogs,languages,normalize,localize,localizeIssue,lessonKey,exampleFor};
