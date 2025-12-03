"use client"

import React, { useState, useEffect } from 'react';
import { Timer, Users, Trophy, Sparkles, Zap, Clock, Star, Play, Pause, RotateCcw, Settings, TrendingUp, Award, Target, Flame, Shield, Gift, Music, Mic, Volume2, Eye, EyeOff, ChevronRight, Plus, Minus, Check, X, Crown, Rocket, Heart, Brain, Coffee, BookOpen, Lightbulb, Siren, PartyPopper, Snowflake } from 'lucide-react';

const NewYearCharades = () => {
    const [gameState, setGameState] = useState('menu');
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(0);
    const [currentCard, setCurrentCard] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [difficulty, setDifficulty] = useState('medium');
    const [specialCards, setSpecialCards] = useState({});
    const [round, setRound] = useState(1);
    const [maxRounds, setMaxRounds] = useState(5);
    const [stats, setStats] = useState({
        fastestGuess: null,
        bestPlayer: null,
        slowestGuess: null,
        totalWords: 0,
        skippedWords: 0,
        history: []
    });
    const [showConfetti, setShowConfetti] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showWord, setShowWord] = useState(true);
    const [gameMode, setGameMode] = useState('classic');
    const [streak, setStreak] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [cardBack, setCardBack] = useState('gradient1');
    const [teamSize, setTeamSize] = useState(4);
    const [pointsToWin, setPointsToWin] = useState(30);
    const [animateCard, setAnimateCard] = useState(false);

    const categories = {
        movies: {
            name: 'Ֆիլմեր',
            emoji: '🎬',
            color: 'from-red-500 to-pink-600',
            icon: <Music className="w-5 h-5" />
        },
        professions: {
            name: 'Մասնագիտություններ',
            emoji: '👔',
            color: 'from-blue-500 to-cyan-600',
            icon: <Coffee className="w-5 h-5" />
        },
        emotions: {
            name: 'Զգացմունքներ',
            emoji: '😊',
            color: 'from-yellow-400 to-orange-500',
            icon: <Heart className="w-5 h-5" />
        },
        actions: {
            name: 'Գործողություններ',
            emoji: '🏃',
            color: 'from-green-500 to-emerald-600',
            icon: <Rocket className="w-5 h-5" />
        },
        celebrities: {
            name: 'Հանրահայտ անձինք',
            emoji: '⭐',
            color: 'from-purple-500 to-violet-600',
            icon: <Crown className="w-5 h-5" />
        },
        traditions: {
            name: 'Ամանորյա',
            emoji: '🎄',
            color: 'from-pink-500 to-rose-600',
            icon: <Gift className="w-5 h-5" />
        },
        animals: {
            name: 'Կենդանիներ',
            emoji: '🦁',
            color: 'from-amber-500 to-yellow-600',
            icon: <Target className="w-5 h-5" />
        },
        food: {
            name: 'Ուտելիք և ըմպելիքներ',
            emoji: '🍕',
            color: 'from-orange-500 to-red-600',
            icon: <Flame className="w-5 h-5" />
        },
        places: {
            name: 'Վայրեր',
            emoji: '🏰',
            color: 'from-indigo-500 to-blue-600',
            icon: <BookOpen className="w-5 h-5" />
        },
        objects: {
            name: 'Առարկաներ',
            emoji: '📱',
            color: 'from-teal-500 to-cyan-600',
            icon: <Lightbulb className="w-5 h-5" />
        }
    };

    const words = {
        movies: ['Բախտի հեգնանք', 'Մենակ տանը', 'Հարի Փոթեր', 'Տիտանիկ', 'Մատրիցա', 'Կոշտ ընկույզ', 'Աստղային պատերազմներ', 'Ֆորսաժ', 'Ավատար', 'Ինտերստելլար', 'Ջոկեր', 'Սկիզբ', 'Գլադիատոր', 'Տերմինատոր', 'Առյուծ արքան'],
        professions: ['Դեդ Մորոզ', 'Սնեգուրոչկա', 'Կախարդ', 'Հրշեջ', 'Ծրագրավորող', 'Բժիշկ', 'Ուսուցիչ', 'Խոհարար', 'Աստրոնավտ', 'Նկարիչ', 'Երաժիշտ', 'Ճարտարապետ', 'Օդաչու', 'Դետեկտիվ', 'Վետերինար'],
        emotions: ['Հրճվանք', 'Զարմանք', 'Անհամբերություն', 'Ուրախություն', 'Հուզմունք', 'Դժկամություն', 'Հպարտություն', 'Հետաքրքրասիրություն', 'Կարոտ', 'Ներշնչանք', 'Բավարարվածություն', 'Էնտուզիազմ', 'Թեթևություն', 'Հիացմունք', 'Քնքշություն'],
        actions: ['Ձյան մարդուկ շինել', 'Եղևնին զարդարել', 'Հրավառություն արձակել', 'Նվերներ տալ', 'Կարկանդակ թխել', 'Սահել չմուշկներով', 'Ձնագնդեր խաղալ', 'Լուսանկարել', 'Պարել', 'Կարաոկե երգել', 'Ընթրիք պատրաստել', 'Նվեր փաթեթավորել', 'Ցանկություն անել'],
        celebrities: ['Սանտա Կլաուս', 'Էլֆ', 'Ձյան թագուհի', 'Ընկույզով կռիվ', 'Օլաֆ', 'Գրինչ', 'Բուրատինո', 'Մոխրոտ', 'Շռեկ', 'Մարդ-սարդ', 'Բեթմեն', 'Պիկաչու', 'Միկի Մաուս', 'Էլզա', 'Չեբուրաշկա'],
        traditions: ['Կոչունակների զարկ', 'Ցանկություն անել', 'Եղևնու շուրջ պար', 'Մանդարիններ', 'Օլիվիե', 'Շամպայն', 'Ամանորյա բացիկ', 'Նվերներ եղևնու տակ', 'Հրավառություն', 'Երիզումներ', 'Կալյադկի', 'Ադվենտ օրացույց', 'Ձմեռային թխվածք'],
        animals: ['Սպիտակ արջ', 'Պինգվին', 'Հյուսիսային եղջերու', 'Նապաստակ', 'Աղվես', 'Գայլ', 'Բու', 'Դելֆին', 'Ընձուղտ', 'Փիղ', 'Կենգուրու', 'Պանդա', 'Կոալա', 'Առյուծ', 'Վագր'],
        food: ['Տորթ', 'Պաղպաղակ', 'Պիցցա', 'Սուշի', 'Բուրգեր', 'Պաստա', 'Սուրճ', 'Թեյ', 'Շոկոլադ', 'Կրուասան', 'Կրեպ', 'Վաֆլի', 'Պոնչիկ', 'Պոպկոռն', 'Լիմոնադ'],
        places: ['Կարմիր հրապարակ', 'Էյֆելյան աշտարակ', 'Բուրգեր', 'Կոլիզեում', 'Ազատության արձան', 'Բիգ Բեն', 'Տաջ Մահալ', 'Դիսնեյլենդ', 'Ակվապարկ', 'Թանգարան', 'Ծովափ', 'Լեռներ', 'Անտառ', 'Վայր', 'Տիեզերք'],
        objects: ['Խելացի հեռախոս', 'Եղևնու խաղալիք', 'Նվերի տուփ', 'Ձյունանուշ', 'Երիզում', 'Մոմ', 'Ֆոտոապարատ', 'Ժամացույց', 'Հովանոց', 'Աչոցներ', 'Համետ', 'Գիրք', 'Կիթառ', 'Շարֆ', 'Սահնակ']
    };

    const difficultySettings = {
        easy: { time: 90, points: 1, label: 'Հեշտ', color: 'from-green-400 to-emerald-500', icon: '😊' },
        medium: { time: 60, points: 2, label: 'Միջին', color: 'from-yellow-400 to-orange-500', icon: '😎' },
        hard: { time: 45, points: 3, label: 'Բարդ', color: 'from-orange-500 to-red-600', icon: '🔥' },
        expert: { time: 30, points: 5, label: 'Փորձառու', color: 'from-red-600 to-purple-700', icon: '💀' },
        insane: { time: 15, points: 8, label: 'Խելագար', color: 'from-purple-700 to-pink-700', icon: '👿' }
    };

    const gameModes = {
        classic: {
            name: 'Դասական',
            description: 'Ստանդարտ խաղ տուրերով',
            icon: <Play className="w-6 h-6" />,
            color: 'from-blue-500 to-cyan-500'
        },
        tournament: {
            name: 'Մրցաշար',
            description: 'Խաղ մինչև որոշակի միավորներ',
            icon: <Trophy className="w-6 h-6" />,
            color: 'from-yellow-500 to-orange-500'
        },
        survival: {
            name: 'Գոյատևում',
            description: 'Մեկ սխալ - դուրս ես մնում',
            icon: <Shield className="w-6 h-6" />,
            color: 'from-red-500 to-pink-500'
        },
        blitz: {
            name: 'Բլից',
            description: 'Առավելագույն բառեր 3 րոպեում',
            icon: <Zap className="w-6 h-6" />,
            color: 'from-purple-500 to-violet-500'
        }
    };

    const specialCardTypes = [
        { type: 'joker', name: 'Ջոքեր', emoji: '🃏', description: 'Մեկ հուշում', color: 'from-purple-500 to-pink-500' },
        { type: 'freeze', name: 'Սառեցում', emoji: '❄️', description: '+15 վրկ', color: 'from-cyan-400 to-blue-500' },
        { type: 'double', name: 'Կրկնակի', emoji: '✨', description: 'Կրկնակի միավորներ', color: 'from-yellow-400 to-orange-500' },
        { type: 'swap', name: 'Փոխանակում', emoji: '🔄', description: 'Փոխել բառը', color: 'from-green-400 to-emerald-500' },
        { type: 'shield', name: 'Վահան', emoji: '🛡️', description: 'Պաշտպանություն տուգանքից', color: 'from-blue-500 to-indigo-600' },
        { type: 'bomb', name: 'Ռումբ', emoji: '💣', description: '-10 վրկ հակառակորդին', color: 'from-red-500 to-orange-600' },
        { type: 'vision', name: 'Տեսլական', emoji: '👁️', description: 'Ցույց տալ կատեգորիան', color: 'from-indigo-500 to-purple-600' },
        { type: 'bonus', name: 'Բոնուս', emoji: '💰', description: '+3 միավոր', color: 'from-amber-400 to-yellow-500' }
    ];

    useEffect(() => {
        let interval;
        if (gameState === 'playing' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleSkip();
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const selectAllCategories = () => {
        setSelectedCategories(Object.keys(categories));
    };

    const startSetup = () => {
        if (selectedCategories.length === 0) {
            alert('Ընտրեք գոնե մեկ կատեգորիա!');
            return;
        }
        setGameState('teamSetup');
    };

    const createTeams = () => {
        if (teamSize < 2) {
            alert('Անհրաժեշտ է առնվազն 2 թիմ!');
            return;
        }

        const newTeams = [];
        for (let i = 0; i < teamSize; i++) {
            newTeams.push({
                name: `Թիմ ${i + 1}`,
                score: 0,
                specialCards: {
                    joker: 2,
                    freeze: 2,
                    double: 1,
                    swap: 2,
                    shield: 1,
                    bomb: 1,
                    vision: 1,
                    bonus: 1
                },
                correctGuesses: 0,
                skippedWords: 0,
                fastestTime: null,
                streak: 0,
                maxStreak: 0,
                lives: gameMode === 'survival' ? 3 : 0
            });
        }

        setTeams(newTeams);
        setGameState('ready');
    };

    const startGame = () => {
        drawCard();
        setGameState('playing');
        setStartTime(Date.now());
        setAnimateCard(true);
        setTimeout(() => setAnimateCard(false), 500);
    };

    const drawCard = () => {
        const availableCategories = selectedCategories.length > 0
            ? selectedCategories
            : Object.keys(categories);

        const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const categoryWords = words[randomCategory];
        const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];

        setCurrentCard({
            word: randomWord,
            category: randomCategory,
            categoryInfo: categories[randomCategory]
        });
        setTimeLeft(difficultySettings[difficulty].time);
        setStats(prev => ({ ...prev, totalWords: prev.totalWords + 1 }));
    };

    const handleCorrect = () => {
        const timeTaken = difficultySettings[difficulty].time - timeLeft;
        const basePoints = difficultySettings[difficulty].points;
        let multiplier = 1;

        if (specialCards.double) multiplier = 2;
        if (streak >= 3) multiplier += 0.5;
        if (timeTaken < 10) multiplier += 0.5;

        const points = Math.floor(basePoints * multiplier);

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        setStreak(prev => prev + 1);

        const newHistory = {
            team: teams[currentTeam].name,
            word: currentCard.word,
            time: timeTaken,
            points: points,
            round: round
        };

        setTeams(prev => prev.map((team, idx) => {
            if (idx === currentTeam) {
                const newCorrectGuesses = team.correctGuesses + 1;
                const newFastestTime = team.fastestTime ? Math.min(team.fastestTime, timeTaken) : timeTaken;
                const newStreak = team.streak + 1;
                const newMaxStreak = Math.max(team.maxStreak, newStreak);

                return {
                    ...team,
                    score: team.score + points,
                    correctGuesses: newCorrectGuesses,
                    fastestTime: newFastestTime,
                    streak: newStreak,
                    maxStreak: newMaxStreak
                };
            }
            return team;
        }));

        setStats(prev => {
            const newStats = { ...prev, history: [...prev.history, newHistory] };

            if (!newStats.fastestGuess || timeTaken < newStats.fastestGuess.time) {
                newStats.fastestGuess = { team: teams[currentTeam].name, time: timeTaken, word: currentCard.word };
            }

            if (!newStats.slowestGuess || timeTaken > newStats.slowestGuess.time) {
                newStats.slowestGuess = { team: teams[currentTeam].name, time: timeTaken, word: currentCard.word };
            }

            return newStats;
        });

        checkAchievements(timeTaken);
        nextTurn();
    };

    const handleSkip = () => {
        setStreak(0);
        setTeams(prev => prev.map((team, idx) => {
            if (idx === currentTeam) {
                return { ...team, skippedWords: team.skippedWords + 1, streak: 0 };
            }
            return team;
        }));

        setStats(prev => ({ ...prev, skippedWords: prev.skippedWords + 1 }));
        nextTurn();
    };

    const checkAchievements = (timeTaken) => {
        const newAchievements = [];

        if (timeTaken < 5) {
            newAchievements.push({ name: 'Կայծակ', emoji: '⚡', description: 'Գուշակվել է 5 վայրկյանում!' });
        }

        if (streak >= 5) {
            newAchievements.push({ name: 'Հաղթանակների շարք', emoji: '🔥', description: '5 ճիշտ պատասխան անընդմեջ!' });
        }

        if (teams[currentTeam].score >= pointsToWin && gameMode === 'tournament') {
            newAchievements.push({ name: 'Չեմպիոն', emoji: '🏆', description: 'Հասել եք նպատակային միավորներին!' });
        }

        if (newAchievements.length > 0) {
            setAchievements(prev => [...prev, ...newAchievements]);
        }
    };

    const nextTurn = () => {
        setSpecialCards({});
        const nextTeam = (currentTeam + 1) % teams.length;

        if (nextTeam === 0) {
            setRound(prev => prev + 1);

            if (gameMode === 'classic' && round >= maxRounds) {
                endGame();
                return;
            }
        }

        if (gameMode === 'tournament') {
            const winner = teams.find(team => team.score >= pointsToWin);
            if (winner) {
                endGame();
                return;
            }
        }

        setCurrentTeam(nextTeam);
        setGameState('ready');
        setCurrentCard(null);
    };

    const useSpecialCard = (type) => {
        if (!teams[currentTeam].specialCards[type] || teams[currentTeam].specialCards[type] <= 0) return;

        setTeams(prev => prev.map((team, idx) => {
            if (idx === currentTeam) {
                return {
                    ...team,
                    specialCards: {
                        ...team.specialCards,
                        [type]: team.specialCards[type] - 1
                    }
                };
            }
            return team;
        }));

        switch (type) {
            case 'freeze':
                setTimeLeft(prev => prev + 15);
                break;
            case 'double':
                setSpecialCards(prev => ({ ...prev, double: true }));
                break;
            case 'joker':
                alert(`Հուշում. առաջին տառը - "${currentCard.word[0]}"`);
                break;
            case 'swap':
                drawCard();
                break;
            case 'bomb':
                const nextTeamIdx = (currentTeam + 1) % teams.length;
                alert(`Ռումբ ուղարկվել է ${teams[nextTeamIdx].name} թիմին!`);
                break;
            case 'vision':
                alert(`Կատեգորիա՝ ${currentCard.categoryInfo.name}`);
                break;
            case 'bonus':
                setTeams(prev => prev.map((team, idx) =>
                    idx === currentTeam ? { ...team, score: team.score + 3 } : team
                ));
                break;
        }
    };

    const endGame = () => {
        const winner = [...teams].sort((a, b) => b.score - a.score)[0];
        const bestPlayer = [...teams].sort((a, b) => b.correctGuesses - a.correctGuesses)[0];
        setStats(prev => ({ ...prev, bestPlayer: bestPlayer.name }));
        setGameState('results');
    };

    const resetGame = () => {
        setGameState('menu');
        setTeams([]);
        setRound(1);
        setStreak(0);
        setStats({
            fastestGuess: null,
            bestPlayer: null,
            slowestGuess: null,
            totalWords: 0,
            skippedWords: 0,
            history: []
        });
        setAchievements([]);
        setCurrentTeam(0);
        setCurrentCard(null);
    };

    // ԳԼԽԱՎՈՐ ՄԵՆՅՈՒ
    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 text-6xl animate-bounce">❄️</div>
                    <div className="absolute top-40 right-20 text-5xl animate-bounce delay-300">🎄</div>
                    <div className="absolute bottom-32 left-1/4 text-7xl animate-bounce delay-500">⭐</div>
                    <div className="absolute bottom-20 right-1/3 text-6xl animate-bounce delay-700">🎁</div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-6xl w-full border-2 border-white/20 shadow-2xl relative z-10">
                    <div className="text-center mb-8">
                        <div className="text-8xl mb-4 animate-pulse">🎭</div>
                        <h1 className="text-6xl font-black text-white mb-3 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Ամանորյա Կոկորդիլոս PRO
                        </h1>
                        <p className="text-2xl text-blue-200">Ամենախելացի "ցույց տուր և գուշակիր" խաղը!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {Object.entries(gameModes).map(([key, mode]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setGameMode(key);
                                    setGameState('setup');
                                }}
                                className={`p-6 rounded-2xl transition-all transform hover:scale-105 border-2 ${gameMode === key
                                    ? 'border-white bg-gradient-to-r ' + mode.color + ' shadow-2xl'
                                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${mode.color}`}>
                                        {mode.icon}
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-1">{mode.name}</h3>
                                        <p className="text-white/80">{mode.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-3xl mb-2">🎯</div>
                            <div className="text-white font-semibold">10 կատեգորիա</div>
                            <div className="text-white/60 text-sm">150+ բառ</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-3xl mb-2">⚡</div>
                            <div className="text-white font-semibold">5 բարդություն</div>
                            <div className="text-white/60 text-sm">Հեշտից մինչև խելագար</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-3xl mb-2">✨</div>
                            <div className="text-white font-semibold">8 հատուկ քարտ</div>
                            <div className="text-white/60 text-sm">Եզակի ունակություններ</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ԿԱՏԱՐՈՂԱԿԱՆ ԷԿՐԱՆ
    if (gameState === 'setup') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-y-auto">
                <div className="max-w-6xl mx-auto py-8">
                    <button
                        onClick={() => setGameState('menu')}
                        className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        ← Ետ մենյու
                    </button>

                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
                        <h2 className="text-4xl font-bold text-white mb-8 text-center">
                            ⚙️ Խաղի կարգավորում
                        </h2>

                        {/* Բարդության ընտրություն */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Flame className="text-orange-400" />
                                Ընտրեք բարդությունը
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {Object.entries(difficultySettings).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => setDifficulty(key)}
                                        className={`p-4 rounded-xl transition-all transform hover:scale-105 ${difficulty === key
                                            ? `bg-gradient-to-r ${value.color} text-white shadow-xl scale-105`
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <div className="text-3xl mb-1">{value.icon}</div>
                                        <div className="font-bold">{value.label}</div>
                                        <div className="text-sm opacity-90">{value.time}վ</div>
                                        <div className="text-xs opacity-75">{value.points} միավոր</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Կատեգորիաների ընտրություն */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Target className="text-blue-400" />
                                    Ընտրեք կատեգորիաները ({selectedCategories.length}/10)
                                </h3>
                                <button
                                    onClick={selectAllCategories}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Ընտրել բոլորը
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {Object.entries(categories).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        onClick={() => toggleCategory(key)}
                                        className={`p-4 rounded-xl transition-all transform hover:scale-105 ${selectedCategories.includes(key)
                                            ? `bg-gradient-to-r ${cat.color} text-white shadow-xl`
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <div className="text-3xl mb-1">{cat.emoji}</div>
                                        <div className="font-semibold text-sm">{cat.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Խաղի ռեժիմի կարգավորումներ */}
                        {gameMode === 'tournament' && (
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="text-yellow-400" />
                                    Հաղթելու համար անհրաժեշտ միավորներ
                                </h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPointsToWin(Math.max(10, pointsToWin - 5))}
                                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 bg-white/10 rounded-lg p-4 text-center">
                                        <div className="text-4xl font-bold text-white">{pointsToWin}</div>
                                    </div>
                                    <button
                                        onClick={() => setPointsToWin(pointsToWin + 5)}
                                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {gameMode === 'classic' && (
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Clock className="text-cyan-400" />
                                    Տուրերի քանակ
                                </h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setMaxRounds(Math.max(1, maxRounds - 1))}
                                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 bg-white/10 rounded-lg p-4 text-center">
                                        <div className="text-4xl font-bold text-white">{maxRounds}</div>
                                    </div>
                                    <button
                                        onClick={() => setMaxRounds(maxRounds + 1)}
                                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={startSetup}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-bold py-6 rounded-2xl shadow-xl transition-all transform hover:scale-105"
                        >
                            Շարունակել →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ԹԻՄԵՐԻ ԿԱՐԳԱՎՈՐՈՒՄ
    if (gameState === 'teamSetup') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
                <div className="max-w-4xl mx-auto py-8">
                    <button
                        onClick={() => setGameState('setup')}
                        className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        ← Ետ
                    </button>

                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
                        <h2 className="text-4xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                            <Users className="text-blue-400" />
                            Թիմեր
                        </h2>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                                Քանի՞ թիմ կխաղա?
                            </h3>
                            <div className="flex items-center gap-4 justify-center">
                                <button
                                    onClick={() => setTeamSize(Math.max(2, teamSize - 1))}
                                    className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors"
                                >
                                    <Minus className="w-6 h-6" />
                                </button>
                                <div className="bg-white/10 rounded-2xl p-6 min-w-[120px] text-center">
                                    <div className="text-5xl font-bold text-white">{teamSize}</div>
                                    <div className="text-white/60 text-sm mt-1">թիմ{teamSize === 1 ? '' : 'եր'}</div>
                                </div>
                                <button
                                    onClick={() => setTeamSize(Math.min(10, teamSize + 1))}
                                    className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={createTeams}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-2xl font-bold py-6 rounded-2xl shadow-xl transition-all transform hover:scale-105"
                        >
                            Ստեղծել թիմեր 🎯
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ՊԱՐՏԱԴՐԱԿԱՆ ԷԿՐԱՆ
    if (gameState === 'ready') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-2xl w-full border-2 border-white/20 shadow-2xl text-center">
                    <div className="text-7xl mb-6 animate-bounce">{categories[Object.keys(categories)[currentTeam % Object.keys(categories).length]]?.emoji || '🎭'}</div>

                    <h2 className="text-5xl font-black text-white mb-4">
                        Թիմի հերթը
                    </h2>
                    <div className="text-6xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text mb-8">
                        {teams[currentTeam].name}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                            <div className="text-yellow-400 text-3xl mb-1">🏆</div>
                            <div className="text-white/60 text-sm">Միավոր</div>
                            <div className="text-white text-3xl font-bold">{teams[currentTeam].score}</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                            <div className="text-blue-400 text-3xl mb-1">⚡</div>
                            <div className="text-white/60 text-sm">Տուր</div>
                            <div className="text-white text-3xl font-bold">{round}{gameMode === 'classic' ? `/${maxRounds}` : ''}</div>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-3xl font-bold py-8 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                        <Play className="w-10 h-10" />
                        Սկսել ցուցադրումը
                    </button>
                </div>
            </div>
        );
    }

    // ԽԱՂԱԼՈՒ ԷԿՐԱՆ
    if (gameState === 'playing') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-4xl animate-ping"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                    animationDuration: '2s'
                                }}
                            >
                                🎉
                            </div>
                        ))}
                    </div>
                )}

                <div className="max-w-6xl mx-auto py-8">
                    {/* Վերնագիր */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-white/60 text-sm mb-1">Թիմ</div>
                                <div className="text-white font-bold text-xl">{teams[currentTeam].name}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-white/60 text-sm mb-1">Ժամանակ</div>
                                <div className={`text-4xl font-black ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                    {timeLeft}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-white/60 text-sm mb-1">Միավոր</div>
                                <div className="text-white font-bold text-xl">{teams[currentTeam].score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Հիմնական քարտ */}
                    <div className={`bg-white/10 backdrop-blur-xl rounded-3xl p-12 mb-6 border-2 border-white/20 text-center transition-all ${animateCard ? 'scale-110' : 'scale-100'}`}>
                        <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${currentCard.categoryInfo.color} mb-6`}>
                            <div className="flex items-center gap-2 text-white font-semibold">
                                {currentCard.categoryInfo.icon}
                                <span>{currentCard.categoryInfo.name}</span>
                            </div>
                        </div>

                        {showWord ? (
                            <div>
                                <div className="text-7xl font-black text-white mb-4">
                                    {currentCard.word}
                                </div>
                                <div className="text-2xl text-white/60">
                                    Ցույց տուր այս բառը!
                                </div>
                            </div>
                        ) : (
                            <div className="text-7xl font-black text-white/20">
                                • • • • •
                            </div>
                        )}
                    </div>

                    {/* Հատուկ քարտեր */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Հատուկ քարտեր
                        </h3>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {specialCardTypes.map(card => (
                                <button
                                    key={card.type}
                                    onClick={() => useSpecialCard(card.type)}
                                    disabled={!teams[currentTeam].specialCards[card.type] || teams[currentTeam].specialCards[card.type] <= 0}
                                    className={`p-3 rounded-xl transition-all ${teams[currentTeam].specialCards[card.type] > 0
                                        ? `bg-gradient-to-r ${card.color} hover:scale-110 cursor-pointer`
                                        : 'bg-white/5 opacity-30 cursor-not-allowed'
                                        }`}
                                    title={card.description}
                                >
                                    <div className="text-2xl mb-1">{card.emoji}</div>
                                    <div className="text-white text-xs font-bold">
                                        {teams[currentTeam].specialCards[card.type] || 0}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Գործողությունների կոճակներ */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleCorrect}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-bold py-8 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <Check className="w-8 h-8" />
                            Գուշակեցինք!
                        </button>
                        <button
                            onClick={handleSkip}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-2xl font-bold py-8 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <X className="w-8 h-8" />
                            Բաց թողնել
                        </button>
                    </div>

                    {/* Հաջողականության ցուցիչ */}
                    {streak > 0 && (
                        <div className="mt-6 text-center">
                            <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-full">
                                <span className="text-white font-bold text-xl">
                                    🔇 Հաջողություն՝ {streak}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Արդյունքների էկրան
    if (gameState === 'results') {
        const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-y-auto">
                <div className="max-w-6xl mx-auto py-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-4 animate-bounce">🏆</div>
                            <h2 className="text-6xl font-black text-white mb-2">
                                Խաղն ավարտվեց!
                            </h2>
                            <p className="text-2xl text-blue-200">Շնորհավորում ենք հաղթողներին!</p>
                        </div>

                        {/* Հաղթողների պատվանդան */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {sortedTeams.slice(0, 3).map((team, idx) => (
                                <div
                                    key={team.name}
                                    className={`p-6 rounded-2xl border-2 ${idx === 0
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 transform scale-105'
                                        : idx === 1
                                            ? 'bg-gradient-to-r from-gray-300 to-gray-400 border-gray-200'
                                            : 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-5xl mb-2">
                                            {idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-2">{team.name}</div>
                                        <div className="text-4xl font-black text-white mb-3">{team.score} միավոր</div>
                                        <div className="space-y-1 text-sm text-white/80">
                                            <div>✅ Գուշակված՝ {team.correctGuesses}</div>
                                            <div>⏭️ Բաց թողնված՝ {team.skippedWords}</div>
                                            {team.fastestTime && <div>⚡ Լավագույն ժամանակ՝ {team.fastestTime}վ</div>}
                                            <div>🔥 Առավելագույն շարք՝ {team.maxStreak}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Վիճակագրություն */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-green-400" />
                                    Խաղի վիճակագրություն
                                </h3>
                                <div className="space-y-3 text-white">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Ընդհանուր բառեր՝</span>
                                        <span className="font-bold">{stats.totalWords}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Գուշակված՝</span>
                                        <span className="font-bold">{stats.totalWords - stats.skippedWords}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Բաց թողնված՝</span>
                                        <span className="font-bold">{stats.skippedWords}</span>
                                    </div>
                                    {stats.fastestGuess && (
                                        <div className="flex justify-between">
                                            <span className="text-white/60">Ամենաարագ գուշակում՝</span>
                                            <span className="font-bold">{stats.fastestGuess.time}վ</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ձեռքբերումներ */}
                            {achievements.length > 0 && (
                                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                                    <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                        <Award className="text-yellow-400" />
                                        Ձեռքբերումներ
                                    </h3>
                                    <div className="space-y-3">
                                        {achievements.map((ach, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                                <div className="text-3xl">{ach.emoji}</div>
                                                <div>
                                                    <div className="text-white font-bold">{ach.name}</div>
                                                    <div className="text-white/60 text-sm">{ach.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Բոլոր թիմերի աղյուսակ */}
                        {sortedTeams.length > 3 && (
                            <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
                                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                    <Trophy className="text-yellow-400" />
                                    Ամբողջական արդյունքների աղյուսակ
                                </h3>
                                <div className="space-y-2">
                                    {sortedTeams.slice(3).map((team, idx) => (
                                        <div key={team.name} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl font-bold text-white/60">#{idx + 4}</div>
                                                <div>
                                                    <div className="text-white font-bold">{team.name}</div>
                                                    <div className="text-white/60 text-sm">
                                                        ✅ {team.correctGuesses} • ⏭️ {team.skippedWords}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-black text-white">{team.score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Խաղի պատմություն */}
                        {stats.history.length > 0 && (
                            <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
                                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                    <Clock className="text-blue-400" />
                                    Խաղի պատմություն
                                </h3>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {stats.history.slice().reverse().map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="text-white/60">Տուր {item.round}</div>
                                                <div className="text-white font-semibold">{item.team}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-white/80">{item.word}</div>
                                                <div className="text-white/60">{item.time}վ</div>
                                                <div className="text-green-400 font-bold">+{item.points}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Գործողությունների կոճակներ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xl font-bold py-6 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <RotateCcw className="w-6 h-6" />
                                Նոր խաղ
                            </button>
                            <button
                                onClick={() => setGameState('ready')}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold py-6 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <Play className="w-6 h-6" />
                                Վերախաղարկում
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default NewYearCharades;