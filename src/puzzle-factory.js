import { randomInt, sample } from './helpers.js'

import TRANSLATIONS from './language.js'

const selectedLang = TRANSLATIONS.SELECTED_LANGUAGE

if(!TRANSLATIONS.LANGUAGES.includes(selectedLang)) console.log(`LANGUAGE NOT SUPPORTED\nSELECTED: ${TRANSLATIONS.SELECTED_LANGUAGE}\nAVAILABLE: ${TRANSLATIONS.LANGUAGES}`)
const LANG = TRANSLATIONS[selectedLang]

const SHAPES = ["firekant", "trekant", "rektangel", "sirkel"]
const COLORABLE = ['bakgrunn', 'fargetekst', 'formtekst', 'nummer', 'form']

const COLOR_CODES = ['svart', 'hvit','#1991F9','#8C0C00','#FFE335','#FF9900','#46A04F','#A43AB5']

const LANG_COLORS = LANG.COLORS.reduce((obj, key, i) => {obj[key] = COLOR_CODES[i]; return obj}, {})


// console.log('farge var', COLORS)
// COLORS becomes this:
const COLORS = {
    'svart' : 'svart',
    'hvit' : 'hvit',
    'blå' : '#1991F9',
    'rød' : '#8C0C00',
    'gul' : '#FFE335',
    'oransje' : '#FF9900',
    'grønn' : '#46A04F',
    'lilla' : '#A43AB5',
}

// functions that return answers from PuzzleData class
const QUESTIONS = {
    'bakgrunn color' : (d) => d.farge['bakgrunn'],
    'color text bakgrunn color' : (d) => d.farge['fargetekst'],
    'form text bakgrunn color' : (d) => d.farge['formtekst'],
    'nummer color' : (d) => d.farge['nummer'],
    'form color' : (d) => d.farge['form'],
    'color text' : (d) => d.text[0],
    'form text' : (d) => d.text[1],
    'form' : (d) => d.form
}

class PuzzleData {
    constructor(form, nummer, text, farge) {
      this.form = form
      this.nummer = nummer
      this.text = text
      this.farge = farge
    }
}

// generates a random puzzle
export function generateRandomPuzzle(){

    const form = sample(SHAPES)
    const nummer = randomInt(9) + 1

    const topText = sample(Object.keys(LANG_COLORS))
    const bottomText = sample(SHAPES)

    const farge = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {})

    // ensure color and form text don't blend with bakgrunn
    while(['fargetekst', 'formtekst'].map(i => farge[i]).includes(farge['bakgrunn']))
        farge['bakgrunn'] = sample(Object.keys(COLORS))

    // ensure nothing blends with form
    while(['bakgrunn', 'fargetekst', 'formtekst', 'nummer'].map(i => farge[i]).includes(farge['form']))
        farge['form'] = sample(Object.keys(COLORS))

    return new PuzzleData(form, nummer, [topText, bottomText], farge)
}


export function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(nums.length)
    let tempPosTwo
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo)
    const positionTwo = tempPosTwo

    const firstQuestion = sample(Object.keys(QUESTIONS))
    let tempSecondQuestion
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion)
    const secondQuestion = tempSecondQuestion

    const andWord = 'AND'

    puzzles = puzzles.map(convertPuzzleDataLang)

    const question =  firstQuestion+' ('+nums[positionOne]+') '+andWord+' '+secondQuestion+' ('+nums[positionTwo]+')'
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}


// LANGUAGE TRANSLATION FUNCTIONS
// Should implement a more robust method for all text, but this is a start

// takes in a puzzleData class and converts language of farge
function convertPuzzleDataLang(puzzle){
    const result = puzzle
    puzzle.farge.bakgrunn = convertColor(puzzle.farge.bakgrunn)
    puzzle.farge.nummer = convertColor(puzzle.farge.nummer)
    puzzle.farge.form = convertColor(puzzle.farge.form)
    puzzle.farge.fargetekst = convertColor(puzzle.farge.fargetekst)
    puzzle.farge.formtekst = convertColor(puzzle.farge.formtekst)
    puzzle.text = puzzle.text.map(i => isColor(i) ? convertColor(i) : i)
    return result
}

const isColor = (string) => TRANSLATIONS.EN.COLORS.includes(string)

function convertColor(originalColor){
    const englishColors = TRANSLATIONS.EN.COLORS
    const position = englishColors.indexOf(originalColor)
    return LANG.COLORS[position]
}
