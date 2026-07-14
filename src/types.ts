export type UserRole = 'guest' | 'member' | 'librarian' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  memberSince: string;
  readingStreak: number;
  booksReadThisYear: number;
  interests: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
  publishedYear: number;
  pages: number;
  format: string;
  isbn: string;
  description: string;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  borrowCount: number;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  progress: number; // 0 to 100
  currentPage?: number;
  status: 'reading' | 'returned' | 'overdue';
}

export interface ActivityLog {
  id: string;
  date: string;
  user: string;
  action: string;
  details: string;
}

export interface SystemAlert {
  id: string;
  severity: 'high' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

// Initial robust mock data representing our library catalog
const BASE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
    category: 'Fiction',
    publishedYear: 2020,
    pages: 304,
    format: 'Hardcover',
    isbn: '9780525559474',
    description: 'Nora Seed finds herself in a library between life and death, where each book offers a chance to try another life she could have lived.',
    rating: 4.8,
    reviewsCount: 1240,
    isAvailable: true,
    borrowCount: 342,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300',
    category: 'Non-Fiction',
    publishedYear: 2018,
    pages: 320,
    format: 'Paperback',
    isbn: '9780735211292',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies to form good habits and break bad ones.',
    rating: 4.9,
    reviewsCount: 4890,
    isAvailable: true,
    borrowCount: 890,
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=300',
    category: 'Sci-Fi',
    publishedYear: 2021,
    pages: 476,
    format: 'Hardcover',
    isbn: '9780593135204',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission to save both humanity and the earth.',
    rating: 4.7,
    reviewsCount: 920,
    isAvailable: true,
    borrowCount: 215,
  },
  {
    id: '4',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=300',
    category: 'Sci-Fi',
    publishedYear: 1965,
    pages: 612,
    format: 'Hardcover',
    isbn: '9780441172719',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious man known as Muad\'Dib.',
    rating: 4.6,
    reviewsCount: 3410,
    isAvailable: true,
    borrowCount: 450,
  },
  {
    id: '6',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300',
    category: 'Non-Fiction',
    publishedYear: 2011,
    pages: 512,
    format: 'Paperback',
    isbn: '9780062316097',
    description: 'Spanning the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of our own time.',
    rating: 4.8,
    reviewsCount: 3120,
    isAvailable: true,
    borrowCount: 520,
  },
  {
    id: '7',
    title: 'Quiet',
    author: 'Susan Cain',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=300',
    category: 'Non-Fiction',
    publishedYear: 2012,
    pages: 368,
    format: 'Hardcover',
    isbn: '9780307352149',
    description: 'Quiet has the power to permanently change how we see introverts and, equally important, how introverts see themselves.',
    rating: 4.4,
    reviewsCount: 880,
    isAvailable: true,
    borrowCount: 180,
  },
  {
    id: '8',
    title: '1984',
    author: 'George Orwell',
    coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=300',
    category: 'Fiction',
    publishedYear: 1949,
    pages: 328,
    format: 'Paperback',
    isbn: '9780451524935',
    description: 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With each lie he writes, Winston grows to hate the Party.',
    rating: 4.7,
    reviewsCount: 5400,
    isAvailable: true,
    borrowCount: 780,
  },
  {
    id: '9',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300',
    category: 'Fiction',
    publishedYear: 1960,
    pages: 324,
    format: 'Paperback',
    isbn: '9780446310789',
    description: 'The memorable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    rating: 4.9,
    reviewsCount: 4200,
    isAvailable: true,
    borrowCount: 650,
  },
  {
    id: '10',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300',
    category: 'Sci-Fi',
    publishedYear: 1932,
    pages: 268,
    format: 'Paperback',
    isbn: '9780060850524',
    description: 'Huxley\'s vision of a utopian future where humans are genetically bred and socially engineered.',
    rating: 4.5,
    reviewsCount: 1450,
    isAvailable: true,
    borrowCount: 310,
  },
];

const EXTRA_BOOKS_DATA = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", publishedYear: 1925, pages: 180, description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan." },
  { title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", publishedYear: 1937, pages: 310, description: "Bilbo Baggins is whisked away from his comfortable hobbit-hole by Gandalf the wizard and a band of dwarves." },
  { title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", publishedYear: 1813, pages: 432, description: "The romantic clash between the opinionated Elizabeth Bennet and her proud suitor, Mr. Darcy." },
  { title: "Fahrenheit 451", author: "Ray Bradbury", category: "Sci-Fi", publishedYear: 1953, pages: 158, description: "Guy Montag is a fireman. His job is to destroy the most illegal of commodities, the printed book." },
  { title: "Animal Farm", author: "George Orwell", category: "Fiction", publishedYear: 1945, pages: 112, description: "A satirical allegorical novella about a group of barnyard animals who overthrow their human master." },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", category: "Fiction", publishedYear: 1951, pages: 234, description: "The experiences of young Holden Caulfield in New York City after his expulsion from Pencey Prep." },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", category: "Fantasy", publishedYear: 1954, pages: 1178, description: "An epic high-fantasy novel that follows the quest to destroy the One Ring." },
  { title: "The Odyssey", author: "Homer", category: "History", publishedYear: 1996, pages: 541, description: "The epic poem tells the story of Odysseus' ten-year journey home after the Trojan War." },
  { title: "The Chronicles of Narnia", author: "C.S. Lewis", category: "Fantasy", publishedYear: 1950, pages: 767, description: "Four adventurous siblings step through a wardrobe door and into the magical land of Narnia." },
  { title: "The Grapes of Wrath", author: "John Steinbeck", category: "Fiction", publishedYear: 1939, pages: 464, description: "Set during the Great Depression, the novel follows the Joad family as they travel west to California." },
  { title: "Of Mice and Men", author: "John Steinbeck", category: "Fiction", publishedYear: 1937, pages: 107, description: "The tragic story of George Milton and Lennie Small, two displaced migrant ranch workers." },
  { title: "Catch-22", author: "Joseph Heller", category: "Fiction", publishedYear: 1961, pages: 453, description: "Set in Italy during World War II, this is the story of the malingering bombardier, Yossarian." },
  { title: "Slaughterhouse-Five", author: "Kurt Vonnegut", category: "Sci-Fi", publishedYear: 1969, pages: 275, description: "The life and experiences of Billy Pilgrim, from his early years to his time as an optometrist." },
  { title: "The Picture of Dorian Gray", author: "Oscar Wilde", category: "Fiction", publishedYear: 1890, pages: 250, description: "Dorian Gray sells his soul to maintain his youthful appearance while his portrait ages and reflects his sins." },
  { title: "Frankenstein", author: "Mary Shelley", category: "Sci-Fi", publishedYear: 1818, pages: 280, description: "Victor Frankenstein creates a sapient creature in an unorthodox scientific experiment." },
  { title: "Dracula", author: "Bram Stoker", category: "Thriller", publishedYear: 1897, pages: 418, description: "The story of Count Dracula's attempt to move from Transylvania to England to find new blood." },
  { title: "The Metamorphosis", author: "Franz Kafka", category: "Fiction", publishedYear: 1915, pages: 100, description: "Gregor Samsa wakes up one morning to find himself transformed into a monstrous vermin." },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Thriller", publishedYear: 1866, pages: 671, description: "The mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student." },
  { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", category: "Fiction", publishedYear: 1880, pages: 824, description: "A passionate philosophical novel that enters deeply into ethical debates of God, free will, and morality." },
  { title: "War and Peace", author: "Leo Tolstoy", category: "Fiction", publishedYear: 1869, pages: 1225, description: "An epic chronicle of Russian society during the Napoleonic Era." },
  { title: "Anna Karenina", author: "Leo Tolstoy", category: "Fiction", publishedYear: 1877, pages: 864, description: "A complex novel in eight parts, dealing with themes of betrayal, faith, family, and marriage." },
  { title: "Wuthering Heights", author: "Emily Brontë", category: "Fiction", publishedYear: 1847, pages: 400, description: "The intense, almost demonic love between Catherine Earnshaw and Heathcliff." },
  { title: "Jane Eyre", author: "Charlotte Brontë", category: "Fiction", publishedYear: 1847, pages: 500, description: "Follows the emotions and experiences of the titular character, including her growth to adulthood." },
  { title: "Moby-Dick", author: "Herman Melville", category: "Fiction", publishedYear: 1851, pages: 635, description: "Sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod." },
  { title: "Great Expectations", author: "Charles Dickens", category: "Fiction", publishedYear: 1861, pages: 505, description: "The personal growth and development of an orphan nicknamed Pip." },
  { title: "A Tale of Two Cities", author: "Charles Dickens", category: "Fiction", publishedYear: 1859, pages: 448, description: "Set in London and Paris before and during the French Revolution." },
  { title: "The Adventures of Huckleberry Finn", author: "Mark Twain", category: "Fiction", publishedYear: 1884, pages: 366, description: "Noted for its colorful description of people and places along the Mississippi River." },
  { title: "Heart of Darkness", author: "Joseph Conrad", category: "Fiction", publishedYear: 1899, pages: 116, description: "Charles Marlow's story of his obsession with the successful ivory trader Kurtz in the Congo." },
  { title: "The Old Man and the Sea", author: "Ernest Hemingway", category: "Fiction", publishedYear: 1952, pages: 127, description: "An aging Cuban fisherman struggles with a giant marlin far out in the Gulf Stream." },
  { title: "For Whom the Bell Tolls", author: "Ernest Hemingway", category: "Fiction", publishedYear: 1940, pages: 471, description: "The story of Robert Jordan, a young American volunteer attached to a republican guerrilla unit." },
  { title: "Gulliver's Travels", author: "Jonathan Swift", category: "Fiction", publishedYear: 1726, pages: 306, description: "A prose satire by the Irish writer and clergyman Jonathan Swift." },
  { title: "The Count of Monte Cristo", author: "Alexandre Dumas", category: "Thriller", publishedYear: 1844, pages: 1276, description: "An adventure novel centering on a man who is wrongfully imprisoned, escapes, and seeks revenge." },
  { title: "The Three Musketeers", author: "Alexandre Dumas", category: "Fiction", publishedYear: 1844, pages: 704, description: "Set in 1625–1628, it recounts the adventures of a young man named d'Artagnan." },
  { title: "Les Misérables", author: "Victor Hugo", category: "Fiction", publishedYear: 1862, pages: 1462, description: "Examines the lives and interactions of several characters, particularly the struggles of ex-convict Jean Valjean." },
  { title: "Don Quixote", author: "Miguel de Cervantes", category: "Fiction", publishedYear: 1605, pages: 1023, description: "Follows the adventures of a noble who reads too many chivalric romances." },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", category: "Fiction", publishedYear: 1967, pages: 417, description: "The multi-generational story of the Buendía family, whose patriarch founded the town of Macondo." },
  { title: "The Stranger", author: "Albert Camus", category: "Fiction", publishedYear: 1942, pages: 123, description: "The story of Meursault, an indifferent French Algerian who attends his mother's funeral." },
  { title: "The Trial", author: "Franz Kafka", category: "Fiction", publishedYear: 1925, pages: 255, description: "Josef K. is arrested and prosecuted by a remote, inaccessible authority, with the nature of his crime never revealed." },
  { title: "Ulysses", author: "James Joyce", category: "Fiction", publishedYear: 1922, pages: 730, description: "Chronicles the perambulations of Leopold Bloom through Dublin in the course of an ordinary day." },
  { title: "Lolita", author: "Vladimir Nabokov", category: "Fiction", publishedYear: 1955, pages: 336, description: "A controversial masterpiece exploring obsession and memory." },
  { title: "The Master and Margarita", author: "Mikhail Bulgakov", category: "Fantasy", publishedYear: 1967, pages: 372, description: "The devil visits the Soviet Union, creating chaos alongside a beautiful love story." },
  { title: "Doctor Zhivago", author: "Boris Pasternak", category: "Fiction", publishedYear: 1957, pages: 592, description: "A sweeping romantic epic set against the backdrop of the Russian Revolution." },
  { title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", category: "Non-Fiction", publishedYear: 1883, pages: 350, description: "A philosophical novel containing the ideas of the Übermensch and the eternal recurrence." },
  { title: "The Republic", author: "Plato", category: "Non-Fiction", publishedYear: 2004, pages: 416, description: "A Socratic dialogue concerning justice and the order and character of the just city-state." },
  { title: "Meditations", author: "Marcus Aurelius", category: "Non-Fiction", publishedYear: 2002, pages: 160, description: "A series of personal writings by the Roman Emperor, recording his private notes on Stoic philosophy." },
  { title: "The Art of War", author: "Sun Tzu", category: "Non-Fiction", publishedYear: 2005, pages: 120, description: "An ancient Chinese military treatise attributed to Sun Tzu, a high-ranking military general." },
  { title: "The Prince", author: "Niccolò Machiavelli", category: "Non-Fiction", publishedYear: 1532, pages: 140, description: "A political treatise instructing rulers how to acquire and maintain political power." },
  { title: "Homo Deus", author: "Yuval Noah Harari", category: "Non-Fiction", publishedYear: 2015, pages: 448, description: "Explores the projects, dreams, and nightmares that will shape the twenty-first century." },
  { title: "The Silk Roads", author: "Peter Frankopan", category: "History", publishedYear: 2015, pages: 656, description: "A major reassessment of world history, focusing on the region connecting East and West." },
  { title: "A Brief History of Time", author: "Stephen Hawking", category: "Non-Fiction", publishedYear: 1988, pages: 212, description: "An explanation of cosmology, black holes, and the Big Bang for non-scientist readers." },
  { title: "Cosmos", author: "Carl Sagan", category: "Non-Fiction", publishedYear: 1980, pages: 365, description: "Explores the universe, science, and the human condition in a poetic and mind-expanding journey." },
  { title: "The Selfish Gene", author: "Richard Dawkins", category: "Non-Fiction", publishedYear: 1976, pages: 360, description: "A classic work on evolutionary biology, introducing the concept of the gene as the fundamental unit of selection." },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Non-Fiction", publishedYear: 2011, pages: 499, description: "A masterclass in how human minds make choices, discussing two systems of thinking." },
  { title: "Outliers", author: "Malcolm Gladwell", category: "Non-Fiction", publishedYear: 2008, pages: 304, description: "Examines the factors that contribute to high levels of success, from culture to practice." },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", publishedYear: 1997, pages: 480, description: "Explains why Eurasian and North African civilizations survived and conquered others." },
  { title: "The Martian", author: "Andy Weir", category: "Sci-Fi", publishedYear: 2011, pages: 369, description: "An astronaut gets stranded on Mars and must use his scientific wits to survive." },
  { title: "Neuromancer", author: "William Gibson", category: "Sci-Fi", publishedYear: 1984, pages: 271, description: "The archetypal cyberpunk novel, following a washed-up computer hacker hired for one last job." },
  { title: "Foundation", author: "Isaac Asimov", category: "Sci-Fi", publishedYear: 1951, pages: 255, description: "A mathematician calculates the collapse of the Galactic Empire and creates a foundation to save knowledge." },
  { title: "I, Robot", author: "Isaac Asimov", category: "Sci-Fi", publishedYear: 1950, pages: 253, description: "A collection of science fiction short stories exploring the interactions of humans, robots, and morality." },
  { title: "Snow Crash", author: "Neal Stephenson", category: "Sci-Fi", publishedYear: 1992, pages: 470, description: "A fast-paced cyber-thriller exploring virtual reality, linguistics, and ancient Sumerian myth." },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", category: "Sci-Fi", publishedYear: 1969, pages: 286, description: "A human envoy is sent to a planet where the inhabitants have no fixed gender, exploring social structures." },
  { title: "The Time Machine", author: "H.G. Wells", category: "Sci-Fi", publishedYear: 1895, pages: 118, description: "A Victorian scientist travels far into the future, finding the split of humanity into Eloi and Morlocks." },
  { title: "The War of the Worlds", author: "H.G. Wells", category: "Sci-Fi", publishedYear: 1898, pages: 192, description: "A Martian invasion of Earth causes panic and destruction across Victorian England." },
  { title: "Hyperion", author: "Dan Simmons", category: "Sci-Fi", publishedYear: 1989, pages: 482, description: "Seven pilgrims travel to the mysterious Time Tombs on the planet Hyperion on the eve of an interstellar war." },
  { title: "Ender's Game", author: "Orson Scott Card", category: "Sci-Fi", publishedYear: 1985, pages: 324, description: "Young Ender Wiggin is recruited into an orbital battle school to prepare for an alien threat." },
  { title: "Do Androids Dream of Electric Sheep?", author: "Philip K. Dick", category: "Sci-Fi", publishedYear: 1968, pages: 210, description: "A bounty hunter tracks down rogue androids in a post-apocalyptic, technologically decaying world." },
  { title: "Ubik", author: "Philip K. Dick", category: "Sci-Fi", publishedYear: 1969, pages: 202, description: "A mind-bending reality-distortion mystery involving psychic security agents and cryogenic suspension." },
  { title: "The Da Vinci Code", author: "Dan Brown", category: "Thriller", publishedYear: 2003, pages: 454, description: "A murder in the Louvre leads to a quest for a religious secret protected by a secret society." },
  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", category: "Thriller", publishedYear: 2005, pages: 465, description: "A journalist and a brilliant computer hacker team up to solve a decades-old disappearance." },
  { title: "Gone Girl", author: "Gillian Flynn", category: "Thriller", publishedYear: 2012, pages: 415, description: "A dark mystery psychological suspense novel about a toxic marriage and a sudden disappearance." },
  { title: "The Silent Patient", author: "Alex Michaelides", category: "Thriller", publishedYear: 2019, pages: 336, description: "A famous painter shoots her husband and refuses to speak another word; a psychotherapist tries to cure her." },
  { title: "The Daevabad Trilogy", author: "S.A. Chakraborty", category: "Fantasy", publishedYear: 2017, pages: 533, description: "An orphan girl in Cairo accidentally summons a djinn warrior, opening up a magical world of political intrigue." },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", category: "Fantasy", publishedYear: 2007, pages: 662, description: "A legendary wizard and musician recounts his early years and quest for vengeance." },
  { title: "The Way of Kings", author: "Brandon Sanderson", category: "Fantasy", publishedYear: 2010, pages: 1007, description: "An epic high fantasy novel set in a world ravaged by magical storms and warring highprinces." },
  { title: "The Lies of Locke Lamora", author: "Scott Lynch", category: "Fantasy", publishedYear: 2006, pages: 499, description: "A clever thief and his band of Gentlemen Bastards pull off elaborate heists in a Venice-like city." },
  { title: "Assassin's Apprentice", author: "Robin Hobb", category: "Fantasy", publishedYear: 1995, pages: 435, description: "The royal bastard Fitz is trained as an assassin to serve the crown in a world of magic and political intrigue." },
  { title: "Good Omens", author: "Neil Gaiman & Terry Pratchett", category: "Fantasy", publishedYear: 1990, pages: 288, description: "An angel and a demon who have grown quite fond of Earth try to prevent the Apocalypse." },
  { title: "American Gods", author: "Neil Gaiman", category: "Fantasy", publishedYear: 2001, pages: 465, description: "A war is brewing between the old gods of mythology and the new gods of technology and media." },
  { title: "The Ocean at the End of the Lane", author: "Neil Gaiman", category: "Fantasy", publishedYear: 2013, pages: 181, description: "A man remembers his magical, terrifying childhood experiences with his mysterious neighbors." },
  { title: "Scythe", author: "Neal Shusterman", category: "Sci-Fi", publishedYear: 2016, pages: 435, description: "In a world with no hunger, disease, or death, designated Scythes are chosen to control population size." },
  { title: "Ready Player One", author: "Ernest Cline", category: "Sci-Fi", publishedYear: 2011, pages: 374, description: "In a dystopian future, teens compete in a massive virtual reality game to inherit a billionaire's fortune." },
  { title: "Unbroken", author: "Laura Hillenbrand", category: "Biography", publishedYear: 2010, pages: 473, description: "The incredible survival and redemption of Olympic runner and WWII prisoner of war Louis Zamperini." },
  { title: "Steve Jobs", author: "Walter Isaacson", category: "Biography", publishedYear: 2011, pages: 656, description: "The definitive biography of Apple's co-founder, based on hundreds of interviews." },
  { title: "Leonardo da Vinci", author: "Walter Isaacson", category: "Biography", publishedYear: 2017, pages: 600, description: "An intimate portrait of history's most creative and inquisitive genius." },
  { title: "Becoming", author: "Michelle Obama", category: "Biography", publishedYear: 2018, pages: 426, description: "An intimate and powerful memoir by the former First Lady of the United States." },
  { title: "Educated", author: "Tara Westover", category: "Biography", publishedYear: 2018, pages: 334, description: "An unforgettable memoir about a girl who leaves her survivalist family to pursue higher education." },
  { title: "Shoe Dog", author: "Phil Knight", category: "Biography", publishedYear: 2016, pages: 386, description: "A fascinating behind-the-scenes look at the creation and rise of Nike from its founder." },
  { title: "The Diary of a Young Girl", author: "Anne Frank", category: "Biography", publishedYear: 1947, pages: 283, description: "The world-famous diary of a Jewish teenager hiding from the Nazis in Amsterdam." },
  { title: "Elon Musk", author: "Ashlee Vance", category: "Biography", publishedYear: 2015, pages: 400, description: "An investigation into the life and tech-empires of the visionary billionaire." },
  { title: "Zero to One", author: "Peter Thiel", category: "Business", publishedYear: 2014, pages: 195, description: "Notes on startups, future building, and how to create singular new value." },
  { title: "Good to Great", author: "Jim Collins", category: "Business", publishedYear: 2001, pages: 288, description: "Explains how ordinary companies transition to great companies and sustain it." },
  { title: "Deep Work", author: "Cal Newport", category: "Self-Help", publishedYear: 2016, pages: 304, description: "Rules for focused success in a distracted world, promoting intense cognitive concentration." }
];

const EXTRA_ISBNS = [
  "9780743273565", // The Great Gatsby
  "9780261102217", // The Hobbit
  "9780141439518", // Pride and Prejudice
  "9781451673319", // Fahrenheit 451
  "9780451526342", // Animal Farm
  "9780316769174", // The Catcher in the Rye
  "9780618640157", // The Lord of the Rings
  "9780140268867", // The Odyssey
  "9780066238500", // The Chronicles of Narnia
  "9780143039433", // The Grapes of Wrath
  "9780140177398", // Of Mice and Men
  "9781451626650", // Catch-22
  "9780385333849", // Slaughterhouse-Five
  "9780141439570", // The Picture of Dorian Gray
  "9780141439471", // Frankenstein
  "9780141439846", // Dracula
  "9780141199641", // The Metamorphosis
  "9780140449136", // Crime and Punishment
  "9780374528379", // The Brothers Karamazov
  "9781400079988", // War and Peace
  "9780143035008", // Anna Karenina
  "9780141439556", // Wuthering Heights
  "9780141441146", // Jane Eyre
  "9780142437247", // Moby-Dick
  "9780141439563", // Great Expectations
  "9780141439600", // A Tale of Two Cities
  "9780486280615", // The Adventures of Huckleberry Finn
  "9780141441672", // Heart of Darkness
  "9780684801223", // The Old Man and the Sea
  "9780684803356", // For Whom the Bell Tolls
  "9780141439495", // Gulliver's Travels
  "9780140449266", // The Count of Monte Cristo
  "9780140449174", // The Three Musketeers
  "9780451531605", // Les Misérables
  "9780060934347", // Don Quixote
  "9780060883287", // One Hundred Years of Solitude
  "9780679720201", // The Stranger
  "9780805210408", // The Trial
  "9780199535675", // Ulysses
  "9780679723165", // Lolita
  "9780143108276", // The Master and Margarita
  "9780307390950", // Doctor Zhivago
  "9780140441185", // Thus Spoke Zarathustra
  "9780140455113", // The Republic
  "9780812968255", // Meditations
  "9781590302255", // The Art of War
  "9780312602444", // The Prince
  "9780062464316", // Homo Deus
  "9781101912379", // The Silk Roads
  "9780553380163", // A Brief History of Time
  "9780345331359", // Cosmos
  "9780198788607", // The Selfish Gene
  "9780374533557", // Thinking, Fast and Slow
  "9780316017930", // Outliers
  "9780393317558", // Guns, Germs, and Steel
  "9780553418026", // The Martian
  "9780441569595", // Neuromancer
  "9780553293357", // Foundation
  "9780553382563", // I, Robot
  "9780553380958", // Snow Crash
  "9780441478125", // The Left Hand of Darkness
  "9780451530707", // The Time Machine
  "9780141441979", // The War of the Worlds
  "9780553283686", // Hyperion
  "9780312853235", // Ender's Game
  "9780345404473", // Do Androids Dream of Electric Sheep?
  "9780547572291", // Ubik
  "9780307474278", // The Da Vinci Code
  "9780307949486", // The Girl with the Dragon Tattoo
  "9780307588371", // Gone Girl
  "9781250301697", // The Silent Patient
  "9780062678119", // The Daevabad Trilogy
  "9780756404741", // The Name of the Wind
  "9780765365279", // The Way of Kings
  "9780553588941", // The Lies of Locke Lamora
  "9780553573398", // Assassin's Apprentice
  "9780060853969", // Good Omens
  "9780380789030", // American Gods
  "9780062255655", // The Ocean at the End of the Lane
  "9781442472426", // Scythe
  "9780307887443", // Ready Player One
  "9780812974492", // Unbroken
  "9781451648539", // Steve Jobs
  "9781501139154", // Leonardo da Vinci
  "9781524763138", // Becoming
  "9780399590504", // Educated
  "9781501135927", // Shoe Dog
  "9780553296983", // The Diary of a Young Girl
  "9780062301253", // Elon Musk
  "9780804139298", // Zero to One
  "9780066209922", // Good to Great
  "9781455586691"  // Deep Work
];

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300'
];

export const INITIAL_BOOKS: Book[] = [
  ...BASE_BOOKS.map((b) => ({
    ...b,
    coverUrl: `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`
  })),
  ...EXTRA_BOOKS_DATA.map((b, idx) => {
    const id = (11 + idx).toString();
    const isbn = EXTRA_ISBNS[idx] || `97801234${1000 + idx}`;
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    const format = idx % 2 === 0 ? 'Paperback' : 'Hardcover';
    const rating = parseFloat((4.0 + (idx % 10) * 0.1).toFixed(1));
    const reviewsCount = (idx % 15 + 1) * 120;
    const borrowCount = (idx % 20 + 5) * 18;

    return {
      id,
      title: b.title,
      author: b.author,
      coverUrl,
      category: b.category,
      publishedYear: b.publishedYear,
      pages: b.pages,
      format,
      isbn,
      description: b.description,
      rating,
      reviewsCount,
      isAvailable: true,
      borrowCount,
    };
  })
];

export const INITIAL_USER: UserProfile = {
  id: 'user_alex',
  name: 'Alex C.',
  email: 'alex.c@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  role: 'member',
  memberSince: '2021',
  readingStreak: 0,
  booksReadThisYear: 0,
  interests: ['Sci-Fi', 'Biographies', 'History', 'Thriller'],
  achievements: [
    { id: '1', title: 'Night Owl', description: 'Read after midnight', icon: '🌙' },
    { id: '2', title: 'Bookworm', description: 'Read 10+ books', icon: '📚' },
    { id: '3', title: 'Series Finisher', description: 'Complete a full book series', icon: '🏆' },
  ],
};

export const INITIAL_BORROWS: BorrowRecord[] = [
  {
    id: 'b1',
    bookId: '1', // The Midnight Library
    userId: 'user_alex',
    borrowDate: '2026-06-25',
    dueDate: '2026-07-25',
    progress: 65,
    status: 'reading',
  },
  {
    id: 'b2',
    bookId: '2', // Atomic Habits
    userId: 'user_alex',
    borrowDate: '2026-07-01',
    dueDate: '2026-08-01',
    progress: 40,
    status: 'reading',
  },
  {
    id: 'b3',
    bookId: '3', // Project Hail Mary
    userId: 'user_alex',
    borrowDate: '2026-07-05',
    dueDate: '2026-08-05',
    progress: 15,
    status: 'reading',
  },
  {
    id: 'b4',
    bookId: '8', // 1984
    userId: 'user_alex',
    borrowDate: '2026-05-10',
    dueDate: '2026-10-28',
    progress: 100,
    status: 'returned',
  },
  {
    id: 'b5',
    bookId: '9', // To Kill a Mockingbird
    userId: 'user_alex',
    borrowDate: '2026-05-15',
    dueDate: '2026-11-03',
    progress: 100,
    status: 'returned',
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: 'act1', date: '05/07/2026', user: 'Alex C.', action: 'Reading Update', details: 'The Midnight Library to 65%' },
  { id: 'act2', date: '21/09/2026', user: 'Alexander S.', action: 'Recommendation', details: 'AI recommendation query' },
  { id: 'act3', date: '23/09/2026', user: 'Alex C.', action: 'Renewed Book', details: '1984 extended to Oct 28' },
  { id: 'act4', date: '23/09/2026', user: 'Admin', action: 'Database Backup', details: 'System backup succeeded' }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  { id: 'alert1', severity: 'high', title: 'Server Load High', message: 'Check cloud native instances and allocation' },
  { id: 'alert2', severity: 'info', title: 'Database Backup', message: 'Completed successfully to secure region' }
];
