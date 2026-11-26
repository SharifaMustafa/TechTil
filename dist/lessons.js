'use strict';

const starterLessons = [
  ['AI','Artificial intelligence','سۈنئىي ئەقىل','Technology that performs tasks such as recognizing speech or generating text.','ئاۋازنى تونۇش ياكى تېكىست يېزىش قاتارلىق ئىشلارنى قىلالايدىغان تېخنىكا.','Artificial intelligence can recognize speech.','سۈنئىي ئەقىل ئاۋازنى تونۇيالايدۇ.','Artificial intelligence'],
  ['AI','Prompt','كۆرسەتمە','An instruction or question you give an AI system.','AI سىستېمىسىغا بېرىدىغان كۆرسەتمە ياكى سوئال.','Write a clear prompt for the assistant.','ياردەمچىگە ئېنىق كۆرسەتمە يېزىڭ.','prompt'],
  ['AI','Chatbot','سۆھبەت بوتى','A program that talks with users through text or voice.','تېكىست ياكى ئاۋاز ئارقىلىق ئىشلەتكۈچىلەر بىلەن سۆھبەتلىشىدىغان پروگرامما.','The chatbot answers simple questions.','سۆھبەت بوتى ئاددىي سوئاللارغا جاۋاب بېرىدۇ.','chatbot'],
  ['AI','Large language model','چوڭ تىل مودېلى','A model trained on large amounts of text to process and generate language.','تىلنى بىر تەرەپ قىلىش ۋە تېكىست يېزىش ئۈچۈن كۆپ مىقداردا تېكىست بىلەن مەشىقلەندۈرۈلگەن مودېل.','A large language model can summarize text.','چوڭ تىل مودېلى تېكىستنى قىسقارتىپ خۇلاسىلىيەلەيدۇ.','large language model'],
  ['IT','Network','تور','A group of connected devices that can exchange data.','ئۆزئارا سانلىق مەلۇمات ئالماشتۇرالايدىغان، ئۇلانغان ئۈسكۈنىلەر توپى.','The network connects our computers.','تور كومپيۇتېرلىرىمىزنى بىر-بىرىگە ئۇلايدۇ.','network'],
  ['IT','Server','مۇلازىمېتىر','A computer or program that provides data or services to clients.','خېرىدار پروگراممىلارغا سانلىق مەلۇمات ياكى مۇلازىمەت بېرىدىغان كومپيۇتېر ياكى پروگرامما.','The server sends the page to my browser.','مۇلازىمېتىر بەتنى تور كۆرگۈچۈمگە ئەۋەتىدۇ.','server'],
  ['IT','Database','ساندان','An organized collection of data that can be searched and updated.','ئىزدەشكە ۋە يېڭىلاشقا بولىدىغان تەرتىپلىك سانلىق مەلۇماتلار توپى.','We store records in a database.','خاتىرىلەرنى سانداندا ساقلايمىز.','database'],
  ['IT','Backup','زاپاس نۇسخا','A copy of data kept so it can be restored if the original is lost.','ئەسلى سانلىق مەلۇمات يوقاپ كەتسە ئەسلىگە كەلتۈرۈش ئۈچۈن ساقلىنىدىغان نۇسخا.','Make a backup before the update.','يېڭىلاشتىن بۇرۇن زاپاس نۇسخا ئېلىڭ.','backup'],
  ['Machine Learning','Machine learning','ماشىنا ئۆگىنىشى','A field that builds systems that learn patterns from data.','سانلىق مەلۇماتتىن قېلىپلارنى ئۆگىنىدىغان سىستېمىلارنى قۇرۇش ساھەسى.','Machine learning can identify patterns in data.','ماشىنا ئۆگىنىشى سانلىق مەلۇماتتىكى قېلىپلارنى تونۇيالايدۇ.','Machine learning'],
  ['Machine Learning','Dataset','سانلىق مەلۇمات توپلىمى','A collection of examples, such as images, text, or numbers.','رەسىم، تېكىست ياكى سانغا ئوخشاش مىساللارنىڭ توپلىمى.','The dataset contains pictures of animals.','سانلىق مەلۇمات توپلىمىدا ھايۋانلارنىڭ رەسىملىرى بار.','dataset'],
  ['Machine Learning','Training','مەشىقلەندۈرۈش','The process of adjusting a model so it learns from examples.','مودېلنى مىساللاردىن ئۆگىنەلەيدىغان قىلىپ تەڭشەش جەريانى.','Training helps the model learn patterns.','مەشىقلەندۈرۈش مودېلنىڭ قېلىپلارنى ئۆگىنىشىگە ياردەم بېرىدۇ.','Training'],
  ['Machine Learning','Prediction','مۆلچەر','An output a model produces for a given input.','مودېلنىڭ كىرگۈزۈلگەن مەلۇماتقا قاراپ چىقارغان نەتىجىسى.','The model makes a prediction about tomorrow’s weather.','مودېل ئەتىكى ھاۋارايى ھەققىدە مۆلچەر چىقىرىدۇ.','prediction']
].map(([topic, term, translation, definition, explanation, example, meaning, blank], id) =>
  ({id, topic, term, translation, definition, explanation, example, meaning, blank}));

const interviewStart = starterLessons.length + vocabulary.length;
const lessons = starterLessons.concat(
  vocabulary.map((entry, offset) => ({...entry, id: starterLessons.length + offset})),
  interviewVocabulary.map((entry, offset) => ({...entry, id: interviewStart + offset}))
);
