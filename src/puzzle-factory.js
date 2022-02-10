import { randomInt, sample } from './helpers.js'

import TRANSLATIONS from './language.js'

const selectedLang = TRANSLATIONS.SELECTED_LANGUAGE

if(!TRANSLATIONS.LANGUAGES.includes(selectedLang)) console.log(`LANGUAGE NOT SUPPORTED\nSELECTED: ${TRANSLATIONS.SELECTED_LANGUAGE}\nAVAILABLE: ${TRANSLATIONS.LANGUAGES}`)
const LANG = TRANSLATIONS[selectedLang]

const SHAPES = ["firkant", "trekant", "rektangel", "sirkel"]
const COLORABLE = ['bakgrunn', 'fargetext', 'formtext', 'nummer', 'form']

const COLOR_CODES = ['black', 'white','#1991F9','#8C0C00','#FFE335','#FF9900','#46A04F','#A43AB5']

const LANG_COLORS = LANG.COLORS.reduce((obj, key, i) => {obj[key] = COLOR_CODES[i]; return obj}, {})


// console.log('colors var', COLORS)
// COLORS becomes this:
const COLORS = {
    'black' : 'black',
    'white' : 'white',
    'blue' : '#1991F9',
    'red' : '#8C0C00',
    'yellow' : '#FFE335',
    'orange' : '#FF9900',
    'green' : '#46A04F',
    'purple' : '#A43AB5',
}

// functions that return answers from PuzzleData class
const QUESTIONS = {
    'bakgrunn farge' : (d) => d.colors['bakgrunn'],
    'farge text bakgrunn farge' : (d) => d.colors['fargetext'],
    'form text bakgrunn farge' : (d) => d.colors['formtext'],
    'nummer farge' : (d) => d.colors['nummer'],
    'form farge' : (d) => d.colors['form'],
    'farge text' : (d) => d.text[0],
    'form text' : (d) => d.text[1],
    'form' : (d) => d.shape
}

class PuzzleData {
    constructor(shape, number, text, colors) {
      this.shape = shape
      this.number = number
      this.text = text
      this.colors = colors
    }
}

// generates a random puzzle
export function generateRandomPuzzle(){

    const shape = sample(SHAPES)
    const number = randomInt(9) + 1

    const topText = sample(Object.keys(LANG_COLORS))
    const bottomText = sample(SHAPES)

    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {})

    // ensure color and shape text don't blend with background
    while(['fargetext', 'formtext'].map(i => colors[i]).includes(colors['bakgrunn']))
        colors['bakgrunn'] = sample(Object.keys(COLORS))

    // ensure nothing blends with shape
    while(['bakgrunn', 'fargetext', 'formtext', 'nummer'].map(i => colors[i]).includes(colors['form']))
        colors['form'] = sample(Object.keys(COLORS))

    return new PuzzleData(shape, number, [topText, bottomText], colors)
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

    const andWord = 'OG'

    puzzles = puzzles.map(convertPuzzleDataLang)

    const question =  firstQuestion+' ('+nums[positionOne]+') '+andWord+' '+secondQuestion+' ('+nums[positionTwo]+')'
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}


// LANGUAGE TRANSLATION FUNCTIONS
// Should implement a more robust method for all text, but this is a start

// takes in a puzzleData class and converts language of colors
function convertPuzzleDataLang(puzzle){
    const result = puzzle
    puzzle.colors.background = convertColor(puzzle.colors.background)
    puzzle.colors.number = convertColor(puzzle.colors.number)
    puzzle.colors.shape = convertColor(puzzle.colors.shape)
    puzzle.colors.colortext = convertColor(puzzle.colors.colortext)
    puzzle.colors.shapetext = convertColor(puzzle.colors.shapetext)
    puzzle.text = puzzle.text.map(i => isColor(i) ? convertColor(i) : i)
    return result
}

const isColor = (string) => TRANSLATIONS.EN.COLORS.includes(string)

function convertColor(originalColor){
    const englishColors = TRANSLATIONS.EN.COLORS
    const position = englishColors.indexOf(originalColor)
    return LANG.COLORS[position]
}
