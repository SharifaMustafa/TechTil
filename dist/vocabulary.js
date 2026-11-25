'use strict';

// Each group combines concrete technical subjects with vocabulary used
// across that group's workflow. English and Uyghur follow their own word order.
const vocabularyGroups = [
  {
    topic: 'AI',
    subjects: [
      ['AI assistant','سۈنئىي ئەقىل ياردەمچىسى'], ['voice assistant','ئاۋازلىق ياردەمچى'], ['coding assistant','كود يېزىش ياردەمچىسى'],
      ['writing assistant','يېزىقچىلىق ياردەمچىسى'], ['search assistant','ئىزدەش ياردەمچىسى'], ['customer service bot','خېرىدارلار مۇلازىمەت بوتى'],
      ['question answering system','سوئالغا جاۋاب بېرىش سىستېمىسى'], ['translation engine','تەرجىمە ماتورى'], ['summarization system','خۇلاسە چىقىرىش سىستېمىسى'],
      ['document parser','ھۆججەت تەھلىللىگۈچى'], ['speech synthesizer','سۆزلەش ئاۋازى ھاسىللىغۇچ'], ['speech recognizer','سۆزلەش ئاۋازىنى تونۇغۇچ'],
      ['image captioner','رەسىم چۈشەندۈرگۈچ'], ['image generator','رەسىم ھاسىللىغۇچ'], ['video generator','سىن ھاسىللىغۇچ'],
      ['music generator','مۇزىكا ھاسىللىغۇچ'], ['text generator','تېكىست ھاسىللىغۇچ'], ['code generator','كود ھاسىللىغۇچ'],
      ['content filter','مەزمۇن سۈزگۈچ'], ['recommendation engine','تەۋسىيە ماتورى'], ['semantic search engine','مەنىگە ئاساسەن ئىزدەش ماتورى'],
      ['document retriever','ھۆججەت تېپىپ بەرگۈچ'], ['ranking engine','دەرىجىلەش ماتورى'], ['object detector','جىسىم بايقىغۇچ'],
      ['optical character recognizer','رەسىمدىكى يېزىقنى تونۇغۇچ']
    ],
    terms: [
      ['interface','كۆرۈنمە يۈزى'], ['feature','ئىقتىدارى'], ['configuration','سەپلىمىسى'], ['settings','تەڭشەكلىرى'],
      ['input','كىرگۈزۈلمىسى'], ['output','چىقىرىلمىسى'], ['output format','چىقىرىلما فورماتى'], ['output quality','چىقىرىلما سۈپىتى'],
      ['input validation','كىرگۈزۈلمىنى تەكشۈرۈش'], ['response time','ئىنكاس ۋاقتى'], ['processing time','بىر تەرەپ قىلىش ۋاقتى'], ['error message','خاتالىق ئۇچۇرى'],
      ['usage limit','ئىشلىتىش چېكى'], ['usage report','ئىشلىتىش دوكلاتى'], ['API','پروگرامما كۆرۈنمە يۈزى'], ['API request','API تەلىپى'],
      ['request body','تەلەپ مەزمۇنى'], ['response body','ئىنكاس مەزمۇنى'], ['request timeout','تەلەپ ۋاقتىنىڭ توشۇشى'], ['rate limit','تەلەپ چاستوتىسى چېكى'],
      ['integration','بىرلەشتۈرۈش'], ['deployment','ئورۇنلاشتۇرۇش'], ['version','نەشرى'], ['release notes','نەشر ئىزاھاتى'],
      ['documentation','قوللانمىسى'], ['user guide','ئىشلەتكۈچى قوللانمىسى'], ['example input','مىسال كىرگۈزۈلمە'], ['sample output','مىسال چىقىرىلما'],
      ['evaluation','باھالاش'], ['benchmark','سېلىشتۇرما سىناق'], ['test case','سىناق مىسالى'], ['regression test','قايتا تەكشۈرۈش سىنىقى'],
      ['failure mode','كاشىلا كۆرۈنۈشى'], ['latency','كېچىكىش ۋاقتى'], ['throughput','بىرلىك ۋاقىتتىكى بىر تەرەپ قىلىش مىقدارى'], ['monitoring','نازارەت قىلىش'],
      ['error rate','خاتالىق نىسبىتى'], ['feedback','قايتما ئىنكاس'], ['access control','زىيارەت ھوقۇقىنى كونترول قىلىش'], ['audit log','تەكشۈرۈش خاتىرىسى']
    ]
  },
  {
    topic: 'Machine Learning',
    subjects: [
      ['linear regression model','سىزىقلىق رېگرېسسىيە مودېلى'], ['logistic regression model','لوگىستىكىلىق رېگرېسسىيە مودېلى'],
      ['decision tree model','قارار دەرىخى مودېلى'], ['random forest model','تاسادىپىي ئورمان مودېلى'], ['gradient boosting model','گرادىئېنتلىق كۈچەيتىش مودېلى'],
      ['naive Bayes model','ئاددىي بايېس مودېلى'], ['support vector machine','تايانچ ۋېكتور ماشىنىسى'], ['nearest neighbor classifier','ئەڭ يېقىن قوشنا تۈرگە ئايرىغۇچ'],
      ['neural network','نېرۋا تورى'], ['convolutional neural network','كونۋولۇتسىيەلىك نېرۋا تورى'], ['recurrent neural network','قايتىلانما نېرۋا تورى'],
      ['transformer model','ئۆزگەرتكۈچ مودېلى'], ['language model','تىل مودېلى'], ['vision transformer','كۆرۈش ئۆزگەرتكۈچى'],
      ['speech recognition model','سۆزلەش ئاۋازىنى تونۇش مودېلى'], ['diffusion model','تارقىلىش مودېلى'], ['autoencoder','ئاپتوماتىك كودلىغۇچ'],
      ['variational autoencoder','ۋارىئاتسىيەلىك ئاپتوماتىك كودلىغۇچ'], ['generative adversarial network','رىقابەتلىك ھاسىللىغۇچى تور'],
      ['matrix factorization model','ماترىتسانى پارچىلاش مودېلى'], ['time series forecasting model','ۋاقىت قاتارى مۆلچەر مودېلى'],
      ['anomaly detection model','نورمالسىزلىقنى بايقاش مودېلى'], ['sentiment classifier','ھېسسىياتنى تۈرگە ئايرىغۇچ'],
      ['image classifier','رەسىمنى تۈرگە ئايرىغۇچ'], ['embedding model','سىڭدۈرمە ۋېكتور مودېلى']
    ],
    terms: [
      ['training','مەشىقلەندۈرۈش'], ['training data','مەشىقلەندۈرۈش سانلىق مەلۇماتى'], ['training pipeline','مەشىقلەندۈرۈش خىزمەت زەنجىرى'], ['training run','مەشىقلەندۈرۈش قېتىمى'],
      ['training script','مەشىقلەندۈرۈش قوليازمىسى'], ['training time','مەشىقلەندۈرۈش ۋاقتى'], ['training cost','مەشىقلەندۈرۈش تەننەرخى'], ['training configuration','مەشىقلەندۈرۈش سەپلىمىسى'],
      ['parameters','پارامېتىرلىرى'], ['hyperparameters','يۇقىرى دەرىجىلىك پارامېتىرلىرى'], ['hyperparameter tuning','يۇقىرى دەرىجىلىك پارامېتىر تەڭشەش'], ['parameter count','پارامېتىر سانى'],
      ['input features','كىرگۈزۈلمە خاسلىقلىرى'], ['input schema','كىرگۈزۈلمە قۇرۇلمىسى'], ['output schema','چىقىرىلما قۇرۇلمىسى'], ['prediction','مۆلچەرى'],
      ['prediction error','مۆلچەر خاتالىقى'], ['inference','مودېلدىن نەتىجە چىقىرىش'], ['inference pipeline','نەتىجە چىقىرىش خىزمەت زەنجىرى'], ['inference time','نەتىجە چىقىرىش ۋاقتى'],
      ['inference latency','نەتىجە چىقىرىش كېچىكىشى'], ['inference cost','نەتىجە چىقىرىش تەننەرخى'], ['batch inference','تۈركۈملەپ نەتىجە چىقىرىش'], ['online inference','توردا نەتىجە چىقىرىش'],
      ['validation','دەلىللەش'], ['test set','سىناق توپلىمى'], ['evaluation metric','باھالاش ئۆلچىمى'], ['evaluation report','باھالاش دوكلاتى'],
      ['baseline','سېلىشتۇرۇش ئاساسى'], ['benchmark','سېلىشتۇرما سىنىقى'], ['version','نەشرى'], ['artifact','ساقلانغان مەشىق مەھسۇلى'],
      ['deployment','ئورۇنلاشتۇرۇش'], ['serving endpoint','مۇلازىمەت ئاخىرقى نۇقتىسى'], ['deployment rollback','ئورۇنلاشتۇرۇشنى ئالدىنقى نەشرگە قايتۇرۇش'], ['monitoring','نازارەت قىلىش'],
      ['memory usage','ئىچكى ساقلىغۇچ ئىشلىتىش مىقدارى'], ['error analysis','خاتالىق تەھلىلى'], ['robustness','مۇستەھكەملىكى'], ['generalization','يېڭى مەلۇماتقا ماسلىشىش ئىقتىدارى']
    ]
  },
  {
    topic: 'Machine Learning',
    subjects: [
      ['image dataset','رەسىم توپلىمى'], ['video dataset','سىن توپلىمى'], ['audio dataset','ئاۋاز توپلىمى'], ['text dataset','تېكىست توپلىمى'],
      ['tabular dataset','جەدۋەل سانلىق مەلۇمات توپلىمى'], ['sensor dataset','سېنزور سانلىق مەلۇمات توپلىمى'], ['traffic dataset','قاتناش سانلىق مەلۇمات توپلىمى'],
      ['weather dataset','ھاۋارايى سانلىق مەلۇمات توپلىمى'], ['satellite imagery dataset','سۈنئىي ھەمراھ رەسىم توپلىمى'],
      ['handwriting dataset','قوليازما توپلىمى'], ['speech dataset','سۆزلەش ئاۋازى توپلىمى'], ['multilingual dataset','كۆپ تىللىق توپلام'],
      ['parallel text dataset','پاراللېل تېكىست توپلىمى'], ['question answering dataset','سوئال-جاۋاب توپلىمى'], ['document dataset','ھۆججەت توپلىمى'],
      ['code dataset','كود توپلىمى'], ['graph dataset','گراف سانلىق مەلۇمات توپلىمى'], ['time series dataset','ۋاقىت قاتارى توپلىمى'],
      ['transaction dataset','سودا خاتىرىلىرى توپلىمى'], ['clickstream dataset','چېكىش ئېقىمى توپلىمى'], ['product catalog dataset','مەھسۇلات مۇندەرىجىسى توپلىمى'],
      ['review dataset','باھا-پىكىر توپلىمى'], ['log dataset','خاتىرە توپلىمى'], ['synthetic dataset','سۈنئىي ھاسىل قىلىنغان توپلام'], ['benchmark dataset','سېلىشتۇرما سىناق توپلىمى']
    ],
    terms: [
      ['collection','توپلاش'], ['source','مەنبەسى'], ['provenance','كېلىش مەنبە تارىخى'], ['license','ئىجازەتنامىسى'], ['documentation','قوللانمىسى'],
      ['version','نەشرى'], ['metadata','مېتا مەلۇماتى'], ['schema','قۇرۇلمىسى'], ['format','فورماتى'], ['storage','ساقلاش'],
      ['access','زىيارەت قىلىش'], ['download','چۈشۈرۈش'], ['upload','يۈكلەش'], ['import','ئەكىرىش'], ['export','چىقىرىش'],
      ['size','چوڭلۇقى'], ['sample count','ئەۋرىشكە سانى'], ['sampling','ئەۋرىشكە ئېلىش'], ['sample selection','ئەۋرىشكە تاللاش'], ['partitioning','بۆلەككە ئايرىش'],
      ['training split','مەشىق بۆلىكى'], ['validation split','دەلىللەش بۆلىكى'], ['test split','سىناق بۆلىكى'], ['preprocessing','ئالدىن بىر تەرەپ قىلىش'], ['cleaning','تازىلاش'],
      ['deduplication','تەكرار مەلۇماتنى چىقىرىۋېتىش'], ['annotation','بەلگە قويۇش'], ['annotation quality','بەلگە سۈپىتى'], ['annotation guidelines','بەلگە قويۇش كۆرسەتمىسى'], ['label distribution','بەلگە تەقسىماتى'],
      ['coverage','قاپلاش دائىرىسى'], ['bias','بىر تەرەپلىمىلىكى'], ['quality check','سۈپەت تەكشۈرۈشى'], ['validation rules','دەلىللەش قائىدىلىرى'], ['integrity check','پۈتۈنلۈك تەكشۈرۈشى'],
      ['compression','پىرىسلاش'], ['backup','زاپاس نۇسخىسى'], ['archive','ئارخىپى'], ['release','ئېلان قىلىش'], ['update','يېڭىلاش']
    ]
  },
  {
    topic: 'IT',
    subjects: [
      ['web server','تور بەت مۇلازىمېتىرى'], ['application server','ئەپ مۇلازىمېتىرى'], ['mail server','ئېلخەت مۇلازىمېتىرى'],
      ['file server','ھۆججەت مۇلازىمېتىرى'], ['DNS server','تور نامى سىستېمىسى مۇلازىمېتىرى'], ['proxy server','ۋاكالەتچى مۇلازىمېتىر'],
      ['print server','بېسىش مۇلازىمېتىرى'], ['build server','ياساش مۇلازىمېتىرى'], ['media server','مېدىيا مۇلازىمېتىرى'],
      ['cache server','غەملەك مۇلازىمېتىرى'], ['virtual machine','مەۋھۇم ماشىنا'], ['cloud instance','بۇلۇتتىكى ھېسابلاش مۇھىتى'],
      ['load balancer','يۈك تەڭپۇڭلىغۇچ'], ['API gateway','API دەرۋازىسى'], ['reverse proxy','تەتۈر ۋاكالەتچى'],
      ['message broker','ئۇچۇر ۋاسىتىچىسى'], ['network switch','تور ئالماشتۇرغۇچىسى'], ['network router','تور يېتەكلىگۈچىسى'],
      ['wireless access point','سىمسىز ئۇلاش نۇقتىسى'], ['VPN gateway','مەۋھۇم شەخسىي تور دەرۋازىسى'],
      ['storage server','ساقلاش مۇلازىمېتىرى'], ['monitoring server','نازارەت مۇلازىمېتىرى'], ['logging server','خاتىرە مۇلازىمېتىرى'],
      ['authentication server','كىملىك دەلىللەش مۇلازىمېتىرى'], ['container host','قاچا ئىجرا قىلغۇچى ئاساسىي مۇھىت']
    ],
    terms: [
      ['setup','تەڭشەش'], ['configuration file','سەپلىمە ھۆججىتى'], ['configuration backup','سەپلىمە زاپاس نۇسخىسى'], ['default settings','سۈكۈتتىكى تەڭشەكلىرى'],
      ['deployment','ئورۇنلاشتۇرۇش'], ['upgrade','نەشر ئۆستۈرۈش'], ['maintenance','ئاسراش'], ['maintenance window','ئاسراش ۋاقتى'],
      ['restart','قايتا قوزغىتىش'], ['shutdown','ئۆچۈرۈش'], ['availability','ئىشلىتىشچانلىقى'], ['uptime','ئىشلەش ۋاقتى'],
      ['downtime','توختاپ قالغان ۋاقتى'], ['health check','ئىش ھالىتىنى تەكشۈرۈش'], ['status report','ھالەت دوكلاتى'], ['monitoring','نازارەت قىلىش'],
      ['alert','ئاگاھلاندۇرۇش'], ['event log','ھادىسە خاتىرىسى'], ['error log','خاتالىق خاتىرىسى'], ['log rotation','خاتىرە ھۆججەتلىرىنى نۆۋەتلەش'],
      ['IP address','IP ئادرېسى'], ['hostname','ئاساسىي ئاپپارات نامى'], ['network interface','تور كۆرۈنمە يۈزى'], ['network latency','تور كېچىكىشى'],
      ['network traffic','تور ئېقىمى'], ['bandwidth','تور كەڭ بەلۋېغى'], ['packet loss','بوغچا يوقىتىش'], ['connection limit','ئۇلىنىش چېكى'],
      ['connection timeout','ئۇلىنىش ۋاقتىنىڭ توشۇشى'], ['access policy','زىيارەت سىياسىتى'], ['access log','زىيارەت خاتىرىسى'], ['security update','بىخەتەرلىك يېڭىلىمىسى'],
      ['resource usage','بايلىق ئىشلىتىش مىقدارى'], ['CPU utilization','بىر تەرەپ قىلغۇچ ئىشلىتىش نىسبىتى'], ['memory usage','ئىچكى ساقلىغۇچ ئىشلىتىش مىقدارى'], ['capacity planning','سىغىم پىلانلاش'],
      ['load test','يۈك سىنىقى'], ['troubleshooting guide','كاشىلا ھەل قىلىش قوللانمىسى'], ['recovery plan','ئەسلىگە كەلتۈرۈش پىلانى'], ['failover','كاشىلىدا زاپاسقا ئالمىشىش']
    ]
  },
  {
    topic: 'IT',
    subjects: [
      ['relational database','مۇناسىۋەتلىك ساندان'], ['document database','ھۆججەت ساندانى'], ['graph database','گراف ساندانى'],
      ['vector database','ۋېكتور ساندانى'], ['time series database','ۋاقىت قاتارى ساندانى'], ['key-value database','ئاچقۇچ-قىممەت ساندانى'],
      ['wide-column database','كەڭ ئىستونلۇق ساندان'], ['columnar database','ئىستون بويىچە ساقلايدىغان ساندان'], ['embedded database','سىڭدۈرۈلگەن ساندان'],
      ['in-memory database','ئىچكى ساقلىغۇچ ساندانى'], ['distributed database','تارقىتىلغان ساندان'], ['cloud database','بۇلۇت ساندانى'],
      ['managed database','باشقۇرۇلىدىغان ساندان'], ['analytical database','تەھلىل ساندانى'], ['transactional database','سودا مەشغۇلات ساندانى'],
      ['application database','ئەپ ساندانى'], ['inventory database','ئامبار تىزىملىكى ساندانى'], ['customer database','خېرىدار ساندانى'],
      ['product database','مەھسۇلات ساندانى'], ['reporting database','دوكلات ساندانى'], ['development database','ئىجاد قىلىش ساندانى'],
      ['test database','سىناق ساندانى'], ['production database','ئەمەلىي مۇھىت ساندانى'], ['staging database','ئېلان قىلىش ئالدىدىكى سىناق ساندانى'],
      ['replica database','تەكرار نۇسخا ساندانى']
    ],
    terms: [
      ['connection','ئۇلىنىشى'], ['connection string','ئۇلىنىش تېكىستى'], ['connection settings','ئۇلىنىش تەڭشەكلىرى'], ['connection timeout','ئۇلىنىش ۋاقتىنىڭ توشۇشى'],
      ['client','خېرىدار پروگراممىسى'], ['driver','قوزغاتقۇچىسى'], ['query','سۈرۈشتۈرۈشى'], ['query result','سۈرۈشتۈرۈش نەتىجىسى'], ['query latency','سۈرۈشتۈرۈش كېچىكىشى'],
      ['schema','قۇرۇلمىسى'], ['index','ئىندېكسى'], ['index size','ئىندېكس چوڭلۇقى'], ['data model','مەلۇمات مودېلى'], ['record count','خاتىرە سانى'],
      ['read operation','ئوقۇش مەشغۇلاتى'], ['write operation','يېزىش مەشغۇلاتى'], ['write latency','يېزىش كېچىكىشى'], ['read throughput','بىرلىك ۋاقىتتىكى ئوقۇش مىقدارى'],
      ['data import','مەلۇمات ئەكىرىش'], ['data export','مەلۇمات چىقىرىش'], ['data migration','مەلۇمات كۆچۈرۈش'], ['replication','تەكرار نۇسخىلاش'],
      ['backup','زاپاس نۇسخىسى'], ['backup schedule','زاپاسلاش ۋاقىت جەدۋىلى'], ['restore','ئەسلىگە كەلتۈرۈش'], ['retention policy','ساقلاش مۇددىتى سىياسىتى'],
      ['storage capacity','ساقلاش سىغىمى'], ['disk usage','دىسكا ئىشلىتىش مىقدارى'], ['memory usage','ئىچكى ساقلىغۇچ ئىشلىتىش مىقدارى'], ['access control','زىيارەت ھوقۇقىنى كونترول قىلىش'],
      ['user role','ئىشلەتكۈچى رولى'], ['access credentials','زىيارەت دەلىل ئۇچۇرى'], ['encryption','شىفىرلاش'], ['audit log','تەكشۈرۈش خاتىرىسى'],
      ['monitoring','نازارەت قىلىش'], ['performance test','ئىقتىدار سىنىقى'], ['availability','ئىشلىتىشچانلىقى'], ['deployment','ئورۇنلاشتۇرۇش'], ['upgrade','نەشر ئۆستۈرۈش'],
      ['recovery plan','ئەسلىگە كەلتۈرۈش پىلانى']
    ]
  }
];

const contexts = [
  ['Check the ', ' before the test.', 'نى سىناقتىن بۇرۇن تەكشۈرۈڭ.'],
  ['The team reviewed the ', ' yesterday.', 'نى ئەترەت تۈنۈگۈن كۆرۈپ چىقتى.'],
  ['Read about the ', ' in the documentation.', ' ھەققىدە قوللانمىدىن ئوقۇڭ.'],
  ['We discussed the ', ' during the meeting.', ' ھەققىدە يىغىندا مۇزاكىرە قىلدۇق.'],
  ['The engineer explained the ', ' to the team.', 'نى ئىنژېنېر ئەترەتكە چۈشەندۈردى.'],
  ['The report describes the ', ' in detail.', ' دوكلاتتا تەپسىلىي چۈشەندۈرۈلگەن.']
];

const vocabulary = vocabularyGroups.flatMap(group => group.subjects.flatMap(([subject, subjectUg], subjectIndex) =>
  group.terms.map(([phrase, phraseUg], termIndex) => {
    const term = subject + ' ' + phrase;
    const translation = subjectUg + 'نىڭ ' + phraseUg;
    const [before, after, meaning] = contexts[(subjectIndex + termIndex) % contexts.length];
    return {
      topic: group.topic, term, translation, blank: term,
      definition: phrase[0].toUpperCase() + phrase.slice(1) + ' in the context of a ' + subject + '.',
      explanation: subjectUg + ' بىلەن مۇناسىۋەتلىك ' + phraseUg + '.',
      example: before + term + after,
      meaning: translation + meaning
    };
  })
));
