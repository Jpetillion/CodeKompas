'use strict';
// Conservative, local lexical checks. No student code or external runtime is executed.
function mask(text,python){
 const out=text.split(''),strings=[],unclosed=[];
 const blank=(a,b)=>{for(let n=a;n<b;n++)if(out[n]!=='\n'&&out[n]!=='\r')out[n]=' ';};
 let i=0;
 while(i<text.length){
  if((python&&text[i]==='#')||(!python&&text.startsWith('//',i))){let end=text.indexOf('\n',i);if(end<0)end=text.length;blank(i,end);i=end;continue;}
  if(!python&&text.startsWith('/*',i)){let end=text.indexOf('*/',i+2);if(end<0){unclosed.push(i);end=text.length;}else end+=2;blank(i,end);i=end;continue;}
  if(text[i]==='"'||text[i]==="'"){
   const start=i,q=text[i],run=text.slice(i).match(/^"+/)?.[0].length||0;
   const triple=python&&text.startsWith(q.repeat(3),i),raw=!python&&run>=3;
   const delim=raw?'"'.repeat(run):triple?q.repeat(3):q;
   const verbatim=!python&&/\$?@$|@\$$/.test(text.slice(Math.max(0,i-2),i));
   i+=delim.length;let closed=false;
   while(i<text.length){
    if(verbatim&&text.startsWith('""',i)){i+=2;continue;}
    if(text.startsWith(delim,i)){i+=delim.length;closed=true;break;}
    if(text[i]==='\\'&&!verbatim&&!raw){i+=2;continue;}
    if(text[i]==='\n'&&!triple&&!raw&&!verbatim)break;
    i++;
   }
   if(!closed)unclosed.push(start);
   strings.push({start,end:i});blank(start,i);continue;
  }i++;
 }
 return {code:out.join(''),strings,unclosed};
}
const cards={
 pyNames:['Python · snake_case','Een naamafspraak maakt woorden in variabelen en functies herkenbaar.','Zijn de namen duidelijk en consequent?','Python gebruikt meestal kleine letters met underscores voor functies en variabelen. Klassen gebruiken vaak PascalCase. Dat zijn afspraken; de schrijfwijze bij definitie en gebruik moet exact overeenkomen.'],
 csNames:['C# · camelCase en PascalCase','Naamafspraken maken de rol van een naam herkenbaar.','Welke naamafspraak hoort bij deze naam?','Lokale variabelen en parameters gebruiken vaak camelCase; typen, methoden en properties vaak PascalCase. Bestaande .NET-namen staan vast. C# maakt onderscheid tussen hoofdletters en kleine letters.'],
 blocks:['Python · inspringing en blokken','Inspringing bepaalt welke instructies samen een blok vormen.','Welke regels horen bij deze voorwaarde, lus of functie?','Een blokkop kondigt een groep instructies aan. Binnen het blok staan regels op hetzelfde inspringniveau. Een vervolgregel binnen haakjes is geen nieuw blok. Vier spaties is een gebruikelijke afspraak, geen verplichte breedte.'],
 types:['C# · typen en waarden','Een type bepaalt welke waarden en bewerkingen bij een variabele passen.','Past het type bij de gegevens die je nodig hebt?','Bij var leidt de compiler het type af uit de beginwaarde; de variabele wordt daarmee niet typeloos. Tekst, gehele getallen en booleans hebben verschillende mogelijkheden.'],
 functions:['Functies en methoden','Een functie of methode groepeert een taak en kan een resultaat teruggeven.','Kun je de taak in één zin beschrijven?','Parameters ontvangen invoer; argumenten zijn de waarden bij een aanroep. Een resultaat teruggeven is iets anders dan tekst op het scherm tonen.'],
 conditions:['Voorwaarden en vergelijken','Een voorwaarde bepaalt welke code wordt uitgevoerd.','Welke vergelijking drukt jouw bedoeling uit?','Onderscheid een waarde toekennen van waarden vergelijken. Controleer ook wat er gebeurt wanneer de voorwaarde niet waar is.'],
 loops:['Lussen · herhalen','Een lus voert een taak meerdere keren uit.','Wat verandert per herhaling, en wanneer stopt de lus?','Bekijk begin, grens en voortgang. Bij een verzameling kun je de items doorlopen. Denk ook aan een lege verzameling en het laatste item.'],
 objects:['Klassen en objecten','Een klasse beschrijft gegevens en gedrag; een object is een concrete instantie.','Welke gegevens en taken horen bij dit object?','Een methode hoort bij gedrag; een veld of property bij gegevens. Houd verantwoordelijkheden overzichtelijk. Meerdere objecten kunnen verschillende toestanden hebben.'],
 exceptions:['Exceptions · fouten opvangen','Een exception onderbreekt de gewone uitvoering wanneer iets misloopt.','Welke verwachte fout kun je hier zinvol afhandelen?','Vang fouten gericht op. Alleen een fout verbergen kan later onduidelijk gedrag veroorzaken. Bedenk welke informatie of vervolgstap nodig is.'],
 imports:['Modules en namespaces','Code kan gebruikmaken van onderdelen uit andere bestanden of bibliotheken.','Waar komt deze gebruikte naam vandaan?','Een import of using helpt namen beschikbaar of korter bereikbaar te maken. Een zelfgekozen alias kan geldig zijn. CodeKompas volgt deze koppelingen niet door het volledige project.'],
 async:['Asynchroon werken','Een taak kan wachten op invoer of een bewerking buiten je programma.','Waar wacht je op, en waar heb je het resultaat nodig?','Async en await maken wachten expliciet. Asynchroon betekent niet automatisch dat rekenwerk parallel gebeurt. Denk ook aan fouten en annuleren.']
};
function analyzeLearning(text,language,{addIssue,principle,check,classify,options}){
 const py=language==='python',label=py?'Python':'C#',lex=mask(text,py),code=lex.code;
 function issue(start,end,message,detail,steps,kind='syntax'){
  addIssue({start,end,kind,context:label,ignorable:false,message,detail,steps});
 }
 function concept(id,start,reason){const c=cards[id];principle(id==='pyNames'||id==='csNames'?'naming':id==='blocks'?'scope':id,start,start+1,reason,{title:c[0],definition:c[1],question:c[2],explanation:c[3]});}
 for(const start of lex.unclosed)issue(start,start+1,'Controleer waar deze tekst of commentaar eindigt.','Een tekstfragment of commentaar lijkt niet afgesloten. De rest kan daardoor anders worden gelezen.',['Zoek het begin van dit fragment.','Controleer welk afsluitteken bij deze vorm hoort.']);
 const stack=[],scopes=[{parent:null,names:new Set()}],scopeAt=new Map();let current=0;
 const lines=[];let offset=0,depth=0,continued=false,previous=null;const indents=[{width:0,scope:0}];
 for(const line of code.split('\n')){
  const trim=line.trim(),prefix=line.match(/^[ \t]*/)[0],width=[...prefix].reduce((n,c)=>c==='\t'?n+8-n%8:n+1,0);
  const continuation=depth>0||continued;
  if(py&&trim&&!continuation){
   while(indents.length>1&&width<indents.at(-1).width)indents.pop();
   if(width>indents.at(-1).width){const scope=scopes.length;scopes.push({parent:indents.at(-1).scope,names:new Set()});indents.push({width,scope});}
   current=indents.at(-1).scope;
   if(options.indentationHints!==false&&prefix.includes('\t')&&prefix.includes(' '))issue(offset,offset+prefix.length,'Controleer de combinatie van tabs en spaties.','Python gebruikt inspringing om blokken te bepalen. Een mengeling kan een andere blokindeling opleveren of een inspringfout veroorzaken.',['Maak witruimte zichtbaar.','Vergelijk het niveau met de andere regels van dit blok.']);
   if(previous?.block&&width<=previous.width)issue(offset+prefix.length,offset+prefix.length+Math.max(1,trim.split(/\s/)[0].length),'Welke regels horen bij het aangekondigde blok?','Na deze blokkop wordt een ingesprongen instructie verwacht. Lege regels en commentaar vormen geen blokinhoud.',['Bekijk de vorige blokkop.','Bepaal welke instructies bij dat blok horen.','Controleer hun inspringniveau.']);
  }
  lines.push({line,offset,scope:current,continuation});
  for(let j=0;j<line.length;j++){
   const c=line[j],pos=offset+j;scopeAt.set(pos,current);
   if('([{'.includes(c)){stack.push({c,pos});depth++;if(!py&&c==='{'){const next=scopes.length;scopes.push({parent:current,names:new Set()});current=next;}}
   if(')]}'.includes(c)){
    const opener=stack.pop();depth=Math.max(0,depth-1);
    if(!opener||'([{'.indexOf(opener.c)!==')]}'.indexOf(c))issue(pos,pos+1,'Controleer het bijbehorende haakje.','Openings- en sluittekens vormen paren van hetzelfde soort.',['Zoek het openingsteken.','Werk van het binnenste paar naar buiten.']);
    if(!py&&c==='}')current=scopes[current].parent??0;
   }
  }
  if(py&&trim&&!continuation&&depth===0){
   const header=/^(?:(?:async\s+)?(?:def|for|with)\b|(?:if|elif|else|while|try|except|finally|class|match|case)\b)/.test(trim);
   if(header&&!trim.includes(':')&&!trim.endsWith('\\'))issue(offset+prefix.length,offset+line.length,'Controleer de overgang naar het blok.','Deze regel lijkt een Python-blok te starten. Controleer het scheidingsteken tussen de blokkop en de instructies.',['Lees de blokkop.','Controleer hoe een blokkop in Python wordt afgesloten.']);
   if(/^(if|elif|while)\b/.test(trim)&&/(?<![=!<>:])=(?!=)/.test(trim))issue(offset+prefix.length,offset+line.length,'Wil je hier toekennen of vergelijken?','Een voorwaarde moet een waarheidswaarde opleveren. Controleer of jouw operator een vergelijking uitdrukt.',['Verwoord je voorwaarde.','Controleer de betekenis van de operator.']);
   previous={width,block:header&&trim.endsWith(':')};
  }
  continued=/\\\s*$/.test(line);offset+=line.length+1;
 }
 for(const item of stack.slice(-3))issue(item.pos,item.pos+1,'Waar wordt dit haakje afgesloten?','Er is geen bijpassend sluitteken gevonden buiten tekst en commentaar.',['Volg de code vanaf dit openingsteken.','Controleer waar deze groep eindigt.']);
 if(!py){for(let n=0;n<lines.length;n++){
  const {line,offset}=lines[n],trim=line.trim(),next=lines.slice(n+1).find(x=>x.line.trim())?.line.trim()||'';
  if(/^Console\.(?:WriteLine|Write|ReadLine|ReadKey|Clear)\s*\(.*\)$/.test(trim)&&! /^[.;)]/.test(next)){
   issue(offset+line.lastIndexOf(')'),offset+line.lastIndexOf(')')+1,'Is deze instructie volledig afgesloten?','Een gewone C#-instructie heeft een afsluiting nodig. Controleer of deze aanroep af is of op de volgende regel verdergaat.',['Bepaal waar deze instructie eindigt.','Controleer het afsluitteken voor een gewone C#-instructie.']);
  }
 }}
 // Declarations suppress guesses about deliberate custom names, imports and aliases.
 const declarations=new Set(),allDeclared=new Set();
 const decl=py?/\b(?:def|class|for|as)\s+([\p{L}_][\p{L}\p{N}_]*)|\b([\p{L}_][\p{L}\p{N}_]*)\s*(?::[^=\n]+)?=(?!=)/gu:/\b(?:var|int|double|float|decimal|string|bool|char|long|short|byte|object|class|struct|interface|enum|record|void)\s+(@?[\p{L}_][\p{L}\p{N}_]*)/gu;
 for(const m of code.matchAll(decl)){const name=m[1]||m[2],pos=m.index+m[0].indexOf(name);declarations.add(pos);allDeclared.add(name.replace(/^@/,''));scopes[scopeAt.get(pos)??0].names.add(name.replace(/^@/,''));}
 // Parameters and imports are excluded from spelling guesses throughout the file.
 if(py){for(const m of code.matchAll(/\b(?:import\s+([^\n]+)|def\s+\w+\s*\(([^)]*)\))/g))for(const t of (m[1]||m[2]).matchAll(/[\p{L}_][\p{L}\p{N}_]*/gu))allDeclared.add(t[0]);}
 const builtins=py?'print input len range int float str bool list dict set tuple enumerate zip sum min max sorted open isinstance abs round type True False None'.split(' '):['Console','Math','Convert','String','Int32','Double','Boolean'];
 const api=py?{}:{Console:['WriteLine','Write','ReadLine','ReadKey','Clear'],Math:['Abs','Round','Floor','Ceiling','Sqrt','Pow','Min','Max'],Convert:['ToInt32','ToDouble','ToString','ToBoolean'],String:['IsNullOrEmpty','IsNullOrWhiteSpace','Join','Format'],Int32:['Parse','TryParse'],Double:['Parse','TryParse'],Boolean:['Parse','TryParse']};
 const typos=py?{retrun:'return',improt:'import',imoprt:'import',whlie:'while',esle:'else',fro:'for'}:{retrun:'return',pubic:'public',publci:'public',privte:'private',statci:'static',voiid:'void',whlie:'while',forech:'foreach',usign:'using'};
 const reserved=new Set((py?'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case':'abstract as async await base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly record ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while var get set init required').split(' '));
 for(const m of code.matchAll(/@?[\p{L}_][\p{L}\p{N}_]*/gu)){
  const word=m[0],pos=m.index,prev=code.slice(0,pos).trimEnd(),after=code.slice(pos+word.length),scope=scopes[scopeAt.get(pos)??0];
  if(declarations.has(pos)||allDeclared.has(word)||word.startsWith('@')||reserved.has(word)||builtins.includes(word))continue;
  if(prev.endsWith('.')){
   const receiver=prev.match(/([\w]+)\.$/)?.[1];
   if(!py&&api[receiver]&&!allDeclared.has(receiver))check(word,pos,api[receiver],'C# · .NET-methode');
   continue;
  }
  if(typos[word]&&!/^\s*(?:=|\()/.test(after))check(word,pos,[typos[word]],label+' · sleutelwoord');
  else if(/^\s*\(/.test(after)||(!py&&/^\s*\./.test(after))||['true','false','none'].includes(word.toLowerCase()))check(word,pos,builtins,label+' · standaardnaam');
  let names=[];for(let s=scope;s;s=s.parent===null?null:scopes[s.parent])names.push(...s.names);
  if(names.length&&classify(word,names))check(word,pos,names,label+' · eigen naam',true,true);
  else if([...new Set(names)].filter(name=>Math.min(name.length,word.length)>=5&&Math.min(name.length,word.length)/Math.max(name.length,word.length)>=0.5&&(name.startsWith(word)||word.startsWith(name))).length===1){
   addIssue({start:pos,end:pos+word.length,kind:'reference',context:label+' · eigen naam',ignorable:true,message:'Heb je deze variabele hernoemd?',detail:'Een zichtbare naam heeft hetzelfde begin maar een andere lengte. Als je de declaratie wijzigt, moeten verwijzingen naar die variabele dezelfde naam blijven gebruiken. De tool kent geen namen uit andere bestanden; controleer of dit bewust zo geschreven is.',steps:['Zoek waar je de bedoelde variabele aanmaakt.','Vergelijk de volledige naam bij de declaratie en het gebruik.','Controleer ook de andere verwijzingen.']});
  }
 }
 // Explicit keyword casing only in clear control/declaration positions.
 for(const {line,offset,continuation} of lines){
  if(py&&continuation)continue;
  const m=line.match(/^\s*([A-Za-z]+)\b/);if(!m)continue;
  const word=m[1],pos=offset+line.indexOf(word),lower=word.toLowerCase();
  if(!allDeclared.has(word)&&word!==lower&&['if','else','while','for','foreach','return','class','def','public','private','static','using','import'].includes(lower)&&!/^\s*(?:=|\()/.test(line.slice(m[0].length)))check(word,pos,[lower],label+' · sleutelwoord');
 }
 const triggers=[['functions',py?/\bdef\s/:/\b(?:void|int|string|bool|double|Task)\s+\w+\s*\(/],['conditions',/\b(?:if|elif|switch|match)\b/],['loops',/\b(?:for|foreach|while)\b/],['objects',/\b(?:class|struct|record)\b/],['exceptions',/\b(?:try|except|catch|finally|throw|raise)\b/],['imports',py?/\b(?:import|from)\b/:/\busing\b/],['async',/\b(?:async|await)\b/]];
 if(py)triggers.push(['blocks',/\b(?:def|if|for|while|class)\b/],['pyNames',/\bdef\b|\b\w+\s*=/]);else triggers.push(['csNames',/\b(?:class|var|int|string|void)\b/],['types',/\b(?:var|int|string|bool|double|decimal)\b/]);
 for(const [id,re] of triggers){const m=code.match(re);if(m)concept(id,m.index,'Dit begrip komt voor in je '+label+'-code.');}
}
module.exports={analyzeLearning,mask};
