const challenges: Challenge[] = [
    // ПРАВДА - Смешные
    { id: 1, type: 'truth', category: 'funny', text: 'Ո՞րն է ամենաշռայլ բանը, որ դու արել ես այս տարի:', points: 10 },
    { id: 2, type: 'truth', category: 'funny', text: 'Ե՞րբ ես վերջին անգամ քնել աշխատանքի ժամանակ:', points: 10 },
    { id: 3, type: 'truth', category: 'funny', text: 'Ո՞րն է քո ամենավատ նվերը, որ ստացել ես Ամանորին:', points: 10 },
    { id: 4, type: 'truth', category: 'funny', text: 'Ինչպիսի՞ն ես դու առավոտյան առանց սուրճի:', points: 10 },
    { id: 5, type: 'truth', category: 'funny', text: 'Ո՞րն է քո ամենաանհաջող սելֆին:', points: 10 },
    
    // ПРАВДА - Романтичные
    { id: 6, type: 'truth', category: 'romantic', text: 'Ո՞վ է այս սենյակում, ում հետ կցանկանայիր համբուրվել Ամանորին:', points: 15 },
    { id: 7, type: 'truth', category: 'romantic', text: 'Պատմի՛ր քո ամենաքաղցր սիրային պատմությունը:', points: 15 },
    { id: 8, type: 'truth', category: 'romantic', text: 'Ունե՞ս գաղտնի համակրանք մեկի նկատմամբ այստեղ:', points: 15 },
    { id: 9, type: 'truth', category: 'romantic', text: 'Ո՞րն է քո իդեալական ռոմանտիկ ժամադրությունը:', points: 15 },
    { id: 10, type: 'truth', category: 'romantic', text: 'Ե՞րբ էիր վերջին անգամ սիրահարված:', points: 15 },
    
    // ПРАВДА - Экстремальные
    { id: 11, type: 'truth', category: 'extreme', text: 'Ո՞րն է ամենամեծ ռիսկը, որ վերցրել ես կյանքումդ:', points: 20 },
    { id: 12, type: 'truth', category: 'extreme', text: 'Պատմի՛ր, ե՞րբ քեզ բռնել են ստելիս:', points: 20 },
    { id: 13, type: 'truth', category: 'extreme', text: 'Ո՞րն է քո ամենաղավաղ գաղտնիքը:', points: 20 },
    { id: 14, type: 'truth', category: 'extreme', text: 'Ինչո՞վ չես հպարտանում, բայց արել ես:', points: 20 },
    { id: 15, type: 'truth', category: 'extreme', text: 'Ո՞ւմ հետ չպիտի անցկացվեր միայնակ 24 ժամ:', points: 20 },
    
    // ПРАВДА - Неловкие
    { id: 16, type: 'truth', category: 'embarrassing', text: 'Ո՞րն է քո ամենաամոթալի պահը դպրոցում:', points: 15 },
    { id: 17, type: 'truth', category: 'embarrassing', text: 'Ե՞րբ ես վերջին անգամ լացել հանրային տեղում:', points: 15 },
    { id: 18, type: 'truth', category: 'embarrassing', text: 'Պատմի՛ր քո ամենաամոթալի սխալը աշխատանքում:', points: 15 },
    { id: 19, type: 'truth', category: 'embarrassing', text: 'Ո՞րն է քո ամենավատ սովորությունը:', points: 15 },
    { id: 20, type: 'truth', category: 'embarrassing', text: 'Ինչ արդարացում ես օգտագործել՝ չգալու համար միջոցառմանը:', points: 15 },
    
    // ДЕЙСТВИЕ - Смешные
    { id: 21, type: 'dare', category: 'funny', text: 'Պարիր 1 րոպե առանց երաժշտության:', points: 15 },
    { id: 22, type: 'dare', category: 'funny', text: 'Խոսիր 2 րոպե առանց «ես» բառի օգտագործելու:', points: 15 },
    { id: 23, type: 'dare', category: 'funny', text: 'Արա 20 ժիմ գետնին հենց հիմա:', points: 15 },
    { id: 24, type: 'dare', category: 'funny', text: 'Երգիր Ձմեռ Պապի ձայնով 30 վայրկյան:', points: 15 },
    { id: 25, type: 'dare', category: 'funny', text: 'Նմանակիր սենյակում ներկա 3 մարդկանց:', points: 15 },
    { id: 26, type: 'dare', category: 'funny', text: 'Պատմիր անեկդոտ, ոչ ոք չպետք է ծիծաղի:', points: 15 },
    { id: 27, type: 'dare', category: 'funny', text: 'Խոսիր հանրահայտ մարդու ոճով 1 րոպե:', points: 15 },
    { id: 28, type: 'dare', category: 'funny', text: 'Փորձիր ծիծաղել առանց ձայնի 30 վայրկյան:', points: 15 },
    
    // ДЕЙСТВИЕ - Романтичные
    { id: 29, type: 'dare', category: 'romantic', text: 'Ասա կոմպլիմենտ բոլորին այս սենյակում:', points: 20 },
    { id: 30, type: 'dare', category: 'romantic', text: 'Համբուրիր ձախ կողմից նստողին ճակատին:', points: 20 },
    { id: 31, type: 'dare', category: 'romantic', text: 'Գրիր սիրային պոեմ 4 տող:', points: 20 },
    { id: 32, type: 'dare', category: 'romantic', text: 'Պարիր դանդաղ պար մեկի հետ այստեղից:', points: 20 },
    { id: 33, type: 'dare', category: 'romantic', text: 'Ասա ում հետ կցանկանայիր դիտել հեղինակային ֆիլմ:', points: 20 },
    { id: 34, type: 'dare', category: 'romantic', text: 'Երգիր սիրային երգ մեկին նվիրաբերելով:', points: 20 },
    
    // ДЕЙСТВИЕ - Экстремальные
    { id: 35, type: 'dare', category: 'extreme', text: 'Խմիր 3 շոթ ջուր 10 վայրկյանում:', points: 25 },
    { id: 36, type: 'dare', category: 'extreme', text: 'Կանգնիր մեկ ոտքի վրա 2 րոպե:', points: 25 },
    { id: 37, type: 'dare', category: 'extreme', text: 'Փորձիր չծիծաղել, մինչ բոլորը քեզ ծիծաղեցնում են 1 րոպե:', points: 25 },
    { id: 38, type: 'dare', category: 'extreme', text: 'Ուտիր մի բան ակնոցը փակ աչքերով:', points: 25 },
    { id: 39, type: 'dare', category: 'extreme', text: 'Թող բոլորը գրեն քո դեմքին մարկերով:', points: 25 },
    { id: 40, type: 'dare', category: 'extreme', text: 'Պարիր կոտրված սրտի պարը 1 րոպե:', points: 25 },
    
    // ДЕЙСТВИЕ - Творческие
    { id: 41, type: 'dare', category: 'creative', text: 'Նկարիր Ամանորյա բան 30 վայրկյանում:', points: 20 },
    { id: 42, type: 'dare', category: 'creative', text: 'Ստեղծիր ռեպ հանրահայտ մարդու մասին:', points: 20 },
    { id: 43, type: 'dare', category: 'creative', text: 'Գտիր 10 բառ, որոնք սկսվում են «Ա»-ով:', points: 20 },
    { id: 44, type: 'dare', category: 'creative', text: 'Պատմիր հեքիաթ Ամանորի մասին:', points: 20 },
    { id: 45, type: 'dare', category: 'creative', text: 'Ստեղծիր նոր պարային շարժում և ցույց տուր:', points: 20 },
    
    // ДЕЙСТВИЕ - Стыдные
    { id: 46, type: 'dare', category: 'embarrassing', text: 'Ցույց տուր քո վերջին 5 ֆոտոները հեռախոսից:', points: 20 },
    { id: 47, type: 'dare', category: 'embarrassing', text: 'Կարդա քո վերջին SMS-ը բարձրաձայն:', points: 20 },
    { id: 48, type: 'dare', category: 'embarrassing', text: 'Պատմիր քո ամենաամոթալի պահը:', points: 20 },
    { id: 49, type: 'dare', category: 'embarrassing', text: 'Նմանակիր երեխային 2 րոպե:', points: 20 },
    { id: 50, type: 'dare', category: 'embarrassing', text: 'Թող բոլորը նայեն քո բրաուզերի պատմությանը:', points: 20 },
  ];