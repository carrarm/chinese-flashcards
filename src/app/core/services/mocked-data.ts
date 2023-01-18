import { CardCollection } from '../model/card-collection.model';

export const collections: CardCollection[] = [
  {
    id: 1,
    label: 'Numbers',
    cards: [
      { meanings: ['One', 'First'], pinyin: 'yī', characters: '一' },
      { meanings: ['Two'], pinyin: 'èr', characters: '二' },
      { meanings: ['Three'], pinyin: 'sān', characters: '三' },
      { meanings: ['Four'], pinyin: 'sì', characters: '四' },
      { meanings: ['Five'], pinyin: 'wǔ', characters: '五' },
    ],
  },
  {
    id: 2,
    label: 'House',
    cards: [],
  },
  {
    id: 3,
    label: 'Small talk',
    cards: [{ meanings: ['Hello'], pinyin: 'nǐ hǎo', characters: '你好' }],
  },
  {
    id: 4,
    label: 'Animals',
    cards: [
      { meanings: ['Horse'], pinyin: 'mǎ', characters: '马' },
      { meanings: ['Goat'], pinyin: 'yáng', characters: '羊' },
      { meanings: ['Rooster'], pinyin: 'gōng jī', characters: '公鸡' },
      { meanings: ['Dog'], pinyin: 'gǒu', characters: '狗' },
    ],
  },
  {
    id: 5,
    label: 'Work',
    cards: [],
  },
];
