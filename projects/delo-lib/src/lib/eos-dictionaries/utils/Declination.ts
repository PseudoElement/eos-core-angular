
export class RussianNameProcessor {
    static sexM = 'm';
    static sexF = 'f';
    static gcaseIm = 'nominative';      static gcaseNom = 'nominative';      // именительный
    static gcaseRod = 'genitive';        static gcaseGen = 'genitive';        // родительный
    static gcaseDat = 'dative';                                       // дательный
    static gcaseVin = 'accusative';      static gcaseAcc = 'accusative';      // винительный
    static gcaseTvor = 'instrumentative'; static gcaseIns = 'instrumentative'; // творительный
    static gcasePred = 'prepositional';   static gcasePos = 'prepositional';   // предложный
    static initialized = false;
    static rules = {
        lastName: {
            exceptions: [
                '	дюма,тома,дега,люка,ферма,гамарра,петипа,шандра . . . . .',
                '	гусь,ремень,камень,онук,богода,нечипас,долгопалец,маненок,рева,кива . . . . .',
                '	вий,сой,цой,хой -я -ю -я -ем -е'
            ],
            suffixes: [
                'f	б,в,г,д,ж,з,й,к,л,м,н,п,р,с,т,ф,х,ц,ч,ш,щ,ъ,ь . . . . .',
                'f	ска,цка  -ой -ой -ую -ой -ой',
                'f	ая       --ой --ой --ую --ой --ой',
                '	ская     --ой --ой --ую --ой --ой',
                'f	на       -ой -ой -у -ой -ой',

                '	иной -я -ю -я -ем -е',
                '	уй   -я -ю -я -ем -е',
                '	ца   -ы -е -у -ей -е',

                '	рих  а у а ом е',

                '	ия                      . . . . .',
                '	иа,аа,оа,уа,ыа,еа,юа,эа . . . . .',
                '	их,ых                   . . . . .',
                '	о,е,э,и,ы,у,ю           . . . . .',

                '	ова,ева            -ой -ой -у -ой -ой',
                '	га,ка,ха,ча,ща,жа  -и -е -у -ой -е',
                '	ца  -и -е -у -ей -е',
                '	а   -ы -е -у -ой -е',

                '	ь   -я -ю -я -ем -е',

                '	ия  -и -и -ю -ей -и',
                '	я   -и -е -ю -ей -е',
                '	ей  -я -ю -я -ем -е',

                '	ян,ан,йн   а у а ом е',

                '	ынец,обец  --ца --цу --ца --цем --це',
                '	онец,овец  --ца --цу --ца --цом --це',

                '	ц,ч,ш,щ   а у а ем е',

                '	ай  -я -ю -я -ем -е',
                '	гой,кой  -го -му -го --им -м',
                '	ой  -го -му -го --ым -м',
                '	ах,ив   а у а ом е',

                '	ший,щий,жий,ний  --его --ему --его -м --ем',
                '	кий,ый   --ого --ому --ого -м --ом',
                '	ий       -я -ю -я -ем -и',

                '	ок  --ка --ку --ка --ком --ке',
                '	ец  --ца --цу --ца --цом --це',

                '	в,н   а у а ым е',
                '	б,г,д,ж,з,к,л,м,п,р,с,т,ф,х   а у а ом е'
            ]
        },
        firstName: {
            exceptions: [
                '	лев    --ьва --ьву --ьва --ьвом --ьве',
                '	павел  --ла  --лу  --ла  --лом  --ле',
                'm	шота   . . . . .',
                'm	пётр   ---етра ---етру ---етра ---етром ---етре',
                'f	рашель,нинель,николь,габриэль,даниэль   . . . . .'
            ],
            suffixes: [
                '	е,ё,и,о,у,ы,э,ю   . . . . .',
                'f	б,в,г,д,ж,з,й,к,л,м,н,п,р,с,т,ф,х,ц,ч,ш,щ,ъ   . . . . .',

                'f	ь   -и -и . ю -и',
                'm	ь   -я -ю -я -ем -е',

                '	га,ка,ха,ча,ща,жа  -и -е -у -ой -е',
                '	а   -ы -е -у -ой -е',
                '	ия  -и -и -ю -ей -и',
                '	я   -и -е -ю -ей -е',
                '	ей  -я -ю -я -ем -е',
                '	ий  -я -ю -я -ем -и',
                '	й   -я -ю -я -ем -е',
                '	б,в,г,д,ж,з,к,л,м,н,п,р,с,т,ф,х,ц,ч	 а у а ом е'
            ]
        },
        middleName: {
            suffixes: [
                '	ич   а  у  а  ем  е',
                '	на  -ы -е -у -ой -е'
            ]
        }
    };



    // constructor () {
    //     RussianNameProcessor.init();
    // }

    // склоняем слово по указанному набору правил и исключений
    static word (word, sex, wordType, gcase) {
        // исходное слово находится в именительном падеже
        if (gcase === this.gcaseNom) {
            return word;
        }

        // составные слова
        if (word.match(/[-]/)) {
            const list = word.split('-');
            for (let i = 0, n = list.length; i < n; i++) {
                list[i] = this.word(list[i], sex, wordType, gcase);
            }
            return list.join('-');
        }

        // Иванов И. И.
        if (word.match(/^[А-ЯЁ]\.?$/i)) {
            return word;
        }

        this.init();
        const rules = this.rules[wordType];

        if (rules.exceptions) {
            const pick = this.pick(word, sex, gcase, rules.exceptions, true);
            if (pick) {
                return pick;
            }
        }
        const pick1 = this.pick(word, sex, gcase, rules.suffixes, false);
        return pick1 || word;
    }

    static init () {
        if (this.initialized) {
            return;
        }
        this.prepareRules();
        this.initialized = true;
    }

    static prepareRules () {
        for (const type in this.rules) {
            if (type) {
                for (const key in this.rules[type]) {
                    if (key) {
                        for (let i = 0, n = this.rules[type][key].length; i < n; i++) {
                            this.rules[type][key][i] = this.rule(this.rules[type][key][i]);
                        }
                    }
                }
            }
        }
    }

    static rule (rule) {
        const m = rule.match(/^\s*([fm]?)\s*(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
        if (m) {
            return {
                sex: m[1],
                test: m[2].split(','),
                mods: [m[3], m[4], m[5], m[6], m[7]]
            };
        }
        return false;
    }



    // выбираем из списка правил первое подходящее и применяем
    static pick (word, sex, gcase, rules, matchWholeWord) {
        const wordLower = word.toLowerCase();
        for (let i = 0, n = rules.length; i < n; i++) {
            if (this.ruleMatch(wordLower, sex, rules[i], matchWholeWord)) {
                return this.applyMod(word, gcase, rules[i]);
            }
        }
        return false;
    }

    // проверяем, подходит ли правило к слову
    static ruleMatch (word, sex, rule, matchWholeWord) {
        if (rule.sex === this.sexM && sex === this.sexF) {
            return false; // male by default
        }
        if (rule.sex === this.sexF && sex !== this.sexF) {
            return false;
        }
        for (let i = 0, n = rule.test.length; i < n; i++) {
            const test = matchWholeWord ? word : word.substr(Math.max(word.length - rule.test[i].length, 0));
            if (test === rule.test[i]) {
                return true;
            }
        }
        return false;
    }

    // склоняем слово (правим окончание)
    static applyMod (word, gcase, rule) {
        let mod = null;
        switch (gcase) {
            case this.gcaseNom: mod = '.'; break;
            case this.gcaseGen: mod = rule.mods[0]; break;
            case this.gcaseDat: mod = rule.mods[1]; break;
            case this.gcaseAcc: mod = rule.mods[2]; break;
            case this.gcaseIns: mod = rule.mods[3]; break;
            case this.gcasePos: mod = rule.mods[4]; break;
            default: {
                // throw "Unknown grammatic case: "+gcase;
            }
        }

        for (let i = 0, n = mod.length; i < n; i++) {
            const c = mod.substr(i, 1);
            switch (c) {
                case '.': break;
                case '-': word = word.substr(0, word.length - 1); break;
                default: word += c;
            }
        }
        return word;
    }
}

// new RussianName('Козлов Евгений Павлович')      // годится обычная форма
// new RussianName('Евгений Павлович Козлов')      // в таком виде тоже
// new RussianName('Козлов', 'Евгений')        // можно явно указать составляющие
// new RussianName('Кунтидия', 'Убиреко', '', 'f') // можно явно указать пол ('m' или 'f')


export class RussianName {
    // constants
    sexM = RussianNameProcessor.sexM;
    sexF = RussianNameProcessor.sexF;
    gcaseIm =   RussianNameProcessor.gcaseIm;   gcaseNom = RussianNameProcessor.gcaseNom; // именительный
    gcaseRod =  RussianNameProcessor.gcaseRod;  gcaseGen = RussianNameProcessor.gcaseGen; // родительный
    gcaseDat =  RussianNameProcessor.gcaseDat;                                           // дательный
    gcaseVin = RussianNameProcessor.gcaseVin;  gcaseAcc = RussianNameProcessor.gcaseAcc; // винительный
    gcaseTvor = RussianNameProcessor.gcaseTvor; gcaseIns = RussianNameProcessor.gcaseIns; // творительный
    gcasePred = RussianNameProcessor.gcasePred; gcasePos = RussianNameProcessor.gcasePos; // предложный

    fullNameSurnameLast = false;

    ln = '';
    fn = '';
    mn = '';
    sex: '';
    // если пол явно не указан, его можно легко узнать по отчеству
    constructor (lastName, firstName = '', middleName = '', sex = null) {
        if (firstName === '') {
            const m = lastName.match(/^\s*(\S+)(\s+(\S+)(\s+(\S+))?)?\s*$/);
            if (!m) {
                // throw "Cannot parse supplied name";
                return null;
            }
            if (m[5] && m[3].match(/(ич|на)$/) && !m[5].match(/(ич|на)$/)) {
                // Иван Петрович Сидоров
                lastName = m[5];
                firstName = m[1];
                middleName = m[3];
                this.fullNameSurnameLast = true;
            } else {
                // Сидоров Иван Петрович
                lastName = m[1];
                firstName = m[3];
                middleName = m[5];
            }
        }
        this.ln = lastName || '';
        this.fn = firstName || '';
        this.mn = middleName || '';
        this.sex = sex || this.getSex();
    }

    getSex () {
        if (this.mn.length > 2) {
            switch (this.mn.substr(this.mn.length - 2)) {
                case 'лы': return this.sexM;
                case 'ич': return this.sexM;
                case 'на': return this.sexF;
                case 'зы': return this.sexF;
                case 'ва': return this.sexF;
            }
        }

        if (this.ln.length > 2) {
            switch (this.ln.substr(this.ln.length - 2)) {
                case 'ов': return this.sexM;
                case 'ёв': return this.sexM;
                case 'ев': return this.sexM;
                case 'ий': return this.sexM;
                case 'ин': return this.sexM;
                case 'ая': return this.sexF;
                case 'ва': return this.sexF;
                case 'на': return this.sexF;
            }
        }
        return '';
    }

    fullName (gcase) {
        return (
            (this.fullNameSurnameLast ? '' : this.lastName(gcase) + ' ')
            + this.firstName(gcase) + ' ' + this.middleName(gcase) +
            (this.fullNameSurnameLast ? ' ' + this.lastName(gcase) : '')
            ).replace(/^ +| +$/g, '');
        }

    lastName (gcase) {
        return RussianNameProcessor.word(this.ln, this.sex, 'lastName', gcase);
    }

    firstName (gcase) {
        return RussianNameProcessor.word(this.fn, this.sex, 'firstName', gcase);
    }

    middleName (gcase) {
        return RussianNameProcessor.word(this.mn, this.sex, 'middleName', gcase);
    }
}

