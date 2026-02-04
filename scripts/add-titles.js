const fs = require('fs');
const path = require('path');

// Map of filename slug to title from posts.csv
const titles = {
  'the-digital-librarian': 'The digital librarian',
  'the-study-of-love': 'The study of love',
  'what-is-marriage-today': 'What is marriage today?',
  'on-elite-colleges': 'On elite colleges',
  'how-technology-makes-us-better-people': 'How technology makes us better people',
  'a-call-for-empathetic-product-engineers': 'A call for empathetic product engineers',
  'why-low-ego-high-trust-start-ups': 'Why low ego, high trust start ups win',
  'growth-mindset-iteration-and-ego': 'Growth mindset, iteration, and ego',
  'the-emotional-intellectual-frontier': 'The emotional intellectual frontier',
  'the-aftermath-of-discounting-traditionally': "The aftermath of discounting traditionally women's labor",
  'we-were-conditioned-to-only-care': 'We were conditioned to only care about intelligence',
  'we-were-conditioned-to-only-care-about-intelligence': 'We were conditioned to only care about intelligence',
  'what-white-americans-can-learn-from': 'What white Americans can learn from Malcom X',
  'lucky-day-for-me': 'Lucky day for me!',
  'we-are-all-infinitesimally-small': 'We are all infinitesimally small',
  'americans-forgot-how-to-love': 'Americans forgot how to love',
  'stop-living-in-denial-you-are-not': 'Stop living in denial: you are not in control',
  'we-need-a-new-world-view': 'We need a new world view',
  'the-gamification-of-love': 'The gamification of love',
  'how-to-live-the-good-life': 'How to live the Good Life',
  'can-we-salvage-christianity': 'Can we salvage Christianity?',
  'life-is-not-getting-worse': 'Life is not getting worse',
  'an-argument-for-expansiveness': 'An argument for expansiveness',
  'stop-comparing-the-us-to-your-tiny': 'Stop comparing the US to your tiny European state',
  'this-was-never-about-intelligence': 'This was never about intelligence',
  'lets-take-the-ego-out-of-entrepreneurship': "Let's take the ego out of entrepreneurship",
  'learnings-from-babel': 'Learnings from Babel',
  'empathy-as-the-ultimate-good': 'Empathy as the ultimate good',
  'why-are-we-hoarding-all-the-wealth': 'Why are we hoarding all the wealth?',
  'empathy-vignette': 'Empathy vignette',
  'an-elitists-call-for-reform': "An elitist's call for reform",
  'a-call-to-build-a-new-moral-system': 'A call to build a new moral system',
  'why-we-need-morals': 'Why we need morals',
  'forgetting-morality': 'Forgetting morality',
  'a-democrats-apology-to-the-white': "A Democrat's apology to the white working class",
  'there-doesnt-need-to-be-a-culture': "There doesn't need to be a culture war",
  'the-future-is-female': 'The Future is Female',
  // Short notes
  'on-love-and-imperfection': 'On love and imperfection',
  'a-note-on-myths': 'A note on myths',
  // Fiction
  'the-fire-in-the-desert': 'The fire in the desert',
};

function addTitles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(dir, file);
    const slug = file.replace('.md', '');
    const title = titles[slug];

    if (!title) {
      console.log(`No title found for: ${slug}`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if already has a title (starts with #)
    if (content.trimStart().startsWith('# ')) {
      console.log(`Already has title: ${slug}`);
      continue;
    }

    // Add title at the beginning
    const newContent = `# ${title}\n\n${content}`;
    fs.writeFileSync(filePath, newContent);
    console.log(`Added title to: ${slug}`);
  }
}

// Process all content directories
const contentDirs = [
  path.join(__dirname, '..', 'content', 'non-fiction-long'),
  path.join(__dirname, '..', 'content', 'non-fiction-short'),
  path.join(__dirname, '..', 'content', 'fiction-short'),
];

for (const dir of contentDirs) {
  if (fs.existsSync(dir)) {
    console.log(`\nProcessing ${dir}...`);
    addTitles(dir);
  }
}

console.log('\nDone!');
