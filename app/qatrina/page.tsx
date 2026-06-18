"use client";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import daeqat1 from "@/assets/daeqat-1.png";
import daeqat2 from "@/assets/daeqat-2.png";
import daeqat3 from "@/assets/daeqat-3.png";
import daeqat4 from "@/assets/daeqat-4.png";
import daeqat5 from "@/assets/daeqat-5.png";
import daeqat6 from "@/assets/daeqat-6.png";
type Heart = {
  left: number;
  top: number;
  fontSize: number;
  delay: number;
  duration: number;
};
export default function ValentinesWebsite() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        fontSize: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
      })),
    );
  }, []);
  const [currentReason, setCurrentReason] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  // Update counter
  useEffect(() => {
    const startDate = new Date("2023-08-8"); // Change to your date!
    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      setTimeElapsed({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const memories = [
    {
      title: "Our First Date",
      date: "January 14, 2023",
      description:
        "The day I knew you were special. Coffee turned into hours of conversation.",
      image: daeqat1,
      emoji: "☕",
    },
    {
      title: "Beach Adventure",
      date: "March 20, 2023",
      description:
        "Sunset walks, sandcastles, and endless laughter by the ocean.",
      image: daeqat2,
      emoji: "🏖️",
    },
    {
      title: "Road Trip",
      date: "June 15, 2023",
      description:
        "Getting lost together and finding the best memories along the way.",
      image: daeqat3,
      emoji: "🚗",
    },
    {
      title: "Cozy Movie Nights",
      date: "Every Weekend",
      description: "Wrapped in blankets, sharing popcorn, and stealing kisses.",
      image: daeqat4,
      emoji: "🎬",
    },
    {
      title: "Dancing in the Rain",
      date: "September 8, 2023",
      description:
        "When the storm caught us, we just danced through it together.",
      image: daeqat5,
      emoji: "💃",
    },
    {
      title: "Stargazing Night",
      date: "November 2, 2023",
      description: "Counting stars and making wishes, all of them about us.",
      image: daeqat6,
      emoji: "⭐",
    },
  ];

  const playlist = [
    {
      id: 269902154,
      title: "Those Eyes",
      artist: "New West",
      image:
        "https://resources.tidal.com/images/cfa2a666/fb0a/4651/a6a9/4781251e05f7/320x320.jpg",
    },
    {
      id: 287019931,
      title: "Always",
      artist: "Daniel Caesar",
      image:
        "https://resources.tidal.com/images/70c4a69c/9a2a/42b4/963e/8741353e2f45/320x320.jpg",
    },
    {
      id: 294850479,
      title: "A Piece of You",
      artist: "Nathaniel Constantin",
      image:
        "https://resources.tidal.com/images/7f83b406/6e87/4044/953a/6b9272bd3b0e/320x320.jpg",
    },
    {
      id: 410763245,
      title: "P.S. I Love You",
      artist: "Paul Partohap",
      image:
        "https://resources.tidal.com/images/c96ad1ad/1c25/4271/9e5b/daf3c6fce6fe/320x320.jpg",
    },
    {
      id: 345584129,
      title: "Yakap",
      artist: "Figvres",
      image:
        "https://resources.tidal.com/images/3db1cfe7/ef02/42c9/8a6d/35f8a96f9c60/320x320.jpg",
    },
    {
      id: 389213357,
      title: "love.",
      artist: "wave to earth",
      image:
        "https://resources.tidal.com/images/9a676071/42e2/4f6e/83c0/46cc097e87b1/320x320.jpg",
    },
    {
      id: 401952134,
      title: "seasons",
      artist: "wave to earth",
      image:
        "https://resources.tidal.com/images/4d630582/62dd/42dd/8725/63d6545f2b55/320x320.jpg",
    },
    {
      id: 71819324,
      title: "Apocalypse",
      artist: "Cigarettes After Sex",
      image:
        "https://resources.tidal.com/images/3207e9c0/198f/467d/aada/9e5c527e6bcd/320x320.jpg",
    },
    {
      id: 396305316,
      title: "Die For You",
      artist: "Joji",
      image:
        "https://resources.tidal.com/images/26ec173b/d134/4fc2/a2a2/45e940f2b204/320x320.jpg",
    },
    {
      id: 338984044,
      title: "Sanctuary",
      artist: "Joji",
      image:
        "https://resources.tidal.com/images/ed75efcc/2b14/44ed/a936/977c66e5c88a/320x320.jpg",
    },
    {
      id: 246282420,
      title: "End Of Beginning",
      artist: "Djo",
      image:
        "https://resources.tidal.com/images/5a783782/d47f/4de7/b241/0d2867c12e5a/320x320.jpg",
    },

    // ---- Sleep Songs ----
    {
      id: 188843702,
      title: "Je Te Laisserai Des Mots",
      artist: "Patrick Watson",
      image:
        "https://resources.tidal.com/images/5d7f7bff/9c51/43ad/9403/711a69e2f41d/320x320.jpg",
    },
    {
      id: 54213357,
      title: "Someone To Stay",
      artist: "Vancouver Sleep Clinic",
      image:
        "https://resources.tidal.com/images/84a97b69/17e5/47d4/91f0/e395f675ae7e/320x320.jpg",
    },
    {
      id: 50163466,
      title: "Space Song",
      artist: "Beach House",
      image:
        "https://resources.tidal.com/images/d5b605bd/33a1/4d97/b48f/fd3b71fbc861/320x320.jpg",
    },
    {
      id: 147476,
      title: "Fade Into You",
      artist: "Mazzy Star",
      image:
        "https://resources.tidal.com/images/0cd12ece/874d/4a15/9d29/38dbc0b7ec8e/320x320.jpg",
    },
    {
      id: 158278,
      title: "Look On Down From The Bridge",
      artist: "Mazzy Star",
      image:
        "https://resources.tidal.com/images/33b0cd36/1d8c/4e1e/b951/8b3ca73eef5c/320x320.jpg",
    },
  ];

  const reasons = [
    "Nabubuo mo lagi ang araw ko sa simpleng presensya mo lang ☀️",
    "Lagi mo ako kinakausap kahit taga oo lang ako 😄",
    "Lagi mo ako sinasamahan sa mga gusto ko, tulad ng games kaya ka nga nag mml ngayon 💝",
    "Maeffort ka sa mga taong mahal mo at mahalaga sayo 🤗",
    "Best mommy ka kay breanna 🤝 ",
    "Strong ka sa kabila ng mga hindi magagandang nangyari sayo 🎊",
    "Sexy mo mag angela laging matigas ang shield ni tigreal dahil sayo ✨",
    "Sobrang lambing mo tipong kaya ako tunawin 🧠💖",
    "Masarap magluto (saksi si breanna soon ako din) 💪",
    "Genuine kang tao 🥰",
    "Pag pinapagalitan ako pag pasaway ako dahil nafefeel kong concern ka 🤗",
    "Hindi moko pinaghihigpitan masyado tulad ng pag nag-aya ang mga kupal🔥",
    "Yung pisngi mo sarap din kagatin mana sayo breanna 🤗",
    "Yung ngiti mo kapag nag-ooncam ka, sarap titigan 💪",
    "Laging nandiyan ka para suportahan ako 🌟",
    "Palaging tapat at totoo sa akin, kahit sa maliliit na bagay 💕",
    "Pag nag-baby talk ka, ang sarap pakinggan at nakaka-smile sa akin 🥰",
    "Ang pagiging vocal mo at kaya mong ipaliwanag ang sarili mo nang malinaw 💬",
    "Iniinform mo ako at tinatanong kung ano ang okay sa’kin, ramdam ko na hindi ako naiiwan 💕",
    "Hindi ko sinasasabi yan dahil mahal kita, sinasabi ko yan base sa mga nakikita ko iloveyousomuch baby! #walangtitibag08💕",
  ];

  const letters = [
    {
      title: "Valentine's Letter",
      locked: false,
      date: "Valentine's Day",
      content: `Hindi ako mahilig sa sulat, pero dahil love kita gusto ko lang malaman mo kung gaano ako ka-thankful na dumating ka sa buhay ko. Kayo ni Breanna, mas naging motivated ako.

Salamat kasi lagi mo akong iniintindi kahit sobrang kupal ko na minsan hahaha, at sobrang naa-appreciate ko ‘yon.

I love you so much, baby ko 😘`,
    },
    {
      title: "Birthday Message",
      locked: false,
      date: "June 2026",
      content: `Happy birthday baby ko! Wala ng intro intro sobrang mahal na mahal kita agad, lagi mong akong napapasaya kahit tingin mo simpleng chat chat natin malaki na impact sakin non, tsaka pag naglalaro tayo kahit nauurat na tayo sa mga kakampi nating mga tolongges,hanga din ako sa pagiging nanay mo kay breanna pwede pang dagdagan ng isa pag okay na ang lahat, wish ko sana is umayon na sayo yung panahon kase ayoko nakikita kitang nahihirapan. Lagi lang ako nandito para sayo, iloveyousomuch baby ko.`,
    },
    {
      title: "Anniversary Message",
      locked: true,
      date: "October 2026",
      content: `Hey Mahal,

Alam kong ordinaryong araw lang ito, pero gusto ko lang ipaalala sa’yo kung gaano ka kahalaga sa akin.

Mahal ko kung paano mo kinukumpas ang ilong kapag nagko-concentrate. Mahal ko kung paano ka sumasayaw sa kusina habang nagluluto. Mahal ko yung kakulitan mo sa pagkanta sa kotse at kung paano mo lagi kinukuha ang kumot sa gabi.

Mahal ko ang bawat maliit at malaking bagay tungkol sa’yo—ang mga perpektong sandali at kahit ang magulo man.

Pinapasaya mo ang bawat araw, parang Araw ng mga Puso.

Salamat sa pagiging ikaw. Salamat sa pagiging akin.

Mahal na mahal kita,
Palagi 💗`,
    },
  ];

  const [expand, setExpand] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 overflow-hidden pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((heart, i) => (
          <div
            key={i}
            className="absolute text-pink-300 opacity-20 animate-float"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.fontSize}px`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10  min-h-screen grid place-items-center"
      >
        <div className=" space-y-6 max-w-4xl text-center">
          <p className="text-lg sm:text-xl md:text-2xl text-rose-700">
            To My Beautiful Girlfriend{" "}
            <strong className="text-rose-800">Sharie Faye.</strong>
          </p>

          <div className="uppercase  space-y-3">
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex-1 h-px bg-rose-400" />
              <h1 className="text-3xl text-pink-700">Happy</h1>
              <div className="flex-1 h-px bg-rose-400" />
            </div>

            <h1 className="text-7xl leading-tight text-rose-800 drop-shadow-[0_4px_15px_rgba(190,24,93,0.3)]">
              Valentine's
            </h1>

            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex-1 h-px bg-rose-400" />
              <h1 className="text-3xl text-pink-700">Day</h1>
              <div className="flex-1 h-px bg-rose-400" />
            </div>
          </div>

          <div className="text-[clamp(2.5rem,8vw,5rem)] drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">
            💕
          </div>

          <p className="text-base sm:text-lg md:text-xl text-rose-600 max-w-xl mx-auto">
            Every moment with you is a treasure. Here's a little something
            special for you.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("love-counter")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 bg-pink-500 hover:bg-pink-600 transition-all  mx-auto px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-full shadow-lg shadow-pink-300/40"
          >
            Explore Our Love Story <ArrowDown size="18" />
          </button>
        </div>
      </motion.div>

      <section id="love-counter" className="relative py-20 px-4 bg-rose-50">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-pink-600 mb-3">
            Our Love Journey
          </h2>
          <p className="text-gray-500 text-lg mb-12">
            Time we've been together
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Days", value: timeElapsed.days },
              { label: "Hours", value: timeElapsed.hours },
              { label: "Minutes", value: timeElapsed.minutes },
              { label: "Seconds", value: timeElapsed.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-pink-100 rounded-2xl p-8 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
              >
                <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-1">
                  {item.value}
                </div>
                <div className="text-pink-700 text-lg font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-lg md:text-xl text-gray-700 font-light italic">
            And every second with you is absolutely perfect 💖
          </p>
        </div>
      </section>
      <section id="love-counter" className="relative py-20 px-4 bg-indigo-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-indigo-600 mb-3 ">
            Our Song Playlist
          </h2>
          <p className="text-gray-500 text-lg mb-12">
            Songs we've been listening together, Select and Play.
          </p>

          <div className="grid md:grid-cols-2 gap-x-3 ">
            {playlist
              .slice(0, expand ? playlist.length : 6)
              .map((song, index) => (
                <div
                  key={index}
                  className="py-4 group space-y-2 cursor-pointer"
                >
                  <div className="flex items-end gap-3 p-2 group-hover:bg-indigo-200 rounded-md">
                    <div className="size-20 rounded-md overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={song.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <h1 className="text-lg font-medium text-background">
                        {song.title}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-indigo-500 w-full"></div>
                </div>
              ))}
          </div>

          <button
            onClick={() => setExpand((prev) => !prev)}
            className="font-medium text-background flex gap-3 items-center mx-auto mt-6"
          >
            {expand ? " See less" : "See more"}
            {expand ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </section>
      <section className="relative py-20 px-4 bg-purple-100 ">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-purple-600 mb-3 text-center">
            Our Beautiful Memories
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Every moment with you is a memory worth keeping
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.map((memory, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={memory.image.src}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl  font-light text-gray-700 italic">
              Here's to a million more memories together 💕
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 bg-red-50">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-pink-600 mb-3 text-center">
            Reasons Why I Love You
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            Here are just {reasons.length} of infinite reasons...
          </p>

          <div className="bg-white rounded-lg shadow-2xl p-12 mb-8 min-h-75 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-pink-400 via-red-400 to-purple-500"></div>
            <div className="text-7xl mb-6 animate-pulse-slow">❤️</div>
            <p className="text-3xl md:text-4xl font-light text-gray-800 leading-relaxed mb-6">
              {reasons[currentReason]}
            </p>
            <p className="text-pink-600 font-semibold text-lg">
              Reason {currentReason + 1} of {reasons.length}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                setCurrentReason(
                  (prev) => (prev - 1 + reasons.length) % reasons.length,
                )
              }
              className="bg-gradient-to-r from-pink-500 to-red-500  px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-red-600 transition-all hover:scale-105 shadow-lg"
            >
              ← Previous
            </button>
            <button
              onClick={() =>
                setCurrentReason((prev) => (prev + 1) % reasons.length)
              }
              className="bg-gradient-to-r from-purple-500 to-pink-500  px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg"
            >
              Next →
            </button>
          </div>

          <p className="mt-12 text-lg md:text-xl text-gray-700 font-light italic">
            And I discover new reasons to love you every single day 💖
          </p>
        </div>
      </section>
      <section className="relative py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-pink-600 mb-3 text-center">
            Love Letters
          </h2>
          <p className="text-center text-gray-600 text-xl mb-16">
            Words from my heart to yours
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {letters.map((letter, index) => (
              <div
                key={index}
                onClick={() => setSelectedLetter(index)}
                className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border-2 border-pink-200   ${letter.locked ? "pointer-events-none hover:cursor-not-allowed" : ""}`}
              >
                <div className="text-5xl mb-4">💌</div>
                <h3 className="text-2xl font-medium text-gray-800 mb-2">
                  {letter.title} {letter.locked ? "(Locked)" : ""}
                </h3>
                <p className="text-pink-600 font-medium mb-4">{letter.date}</p>
                <p className="text-gray-600">Click to read →</p>
              </div>
            ))}
          </div>

          {selectedLetter !== null && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedLetter(null)}
            >
              <div
                className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">
                      {letters[selectedLetter].title}
                    </h3>
                    <p className="text-pink-600 font-medium">
                      {letters[selectedLetter].date}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLetter(null)}
                    className="text-4xl text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {letters[selectedLetter].content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="relative py-15 px-4 bg-gradient-to-br from-pink-400 via-red-400 to-purple-500">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-8xl mb-6 animate-pulse-slow">💖</div>
          <h2 className="text-3xl font-medium  mb-6">
            I Love You More Than Words Can Say
          </h2>
          <p className="text-xl /90 mb-8 leading-relaxed">
            Thank you for being my partner, my best friend, my everything.
            Here's to our forever. ♾️
          </p>
          <p className="text-xl font-light  italic">
            Happy Valentine's Day, my Baby, Best mommy, Darling 💕
          </p>
        </div>
      </section>
    </div>
  );
}

//  <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 overflow-hidden">
//       {/* Background Glow */}
//       <div
//         className="fixed inset-0 z-0"
//         style={{
//           background: `linear-gradient(315deg, #E1BEE7 0%, #F3E5F5 20%, #FCE4EC 40%, #FFF0F5 60%, #F8BBD9 80%, #E1BEE7 100%)`,
//         }}
//       />

//       {/* Floating Hearts */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute text-pink-300 opacity-20 animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               fontSize: `${Math.random() * 20 + 15}px`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${Math.random() * 4 + 4}s`,
//             }}
//           >
//             ❤️
//           </div>
//         ))}
//       </div>

//       <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//           className="relative z-10 text-center space-y-6 max-w-4xl mx-auto"
//         >
//           <p className="text-lg sm:text-xl md:text-2xl text-rose-700">
//             To My Beautiful Girlfriend{" "}
//             <strong className="text-rose-800">Sharie Faye.</strong>
//           </p>

//           <div className="uppercase space-y-4 sm:space-y-6">
//             <div className="flex items-center gap-4 sm:gap-8">
//               <div className="flex-1 h-px bg-rose-400" />
//               <h1 className="text-3xl text-pink-700">Happy</h1>
//               <div className="flex-1 h-px bg-rose-400" />
//             </div>

//             <h1 className="text-6xl leading-tight text-rose-800 drop-shadow-[0_4px_15px_rgba(190,24,93,0.3)]">
//               Valentine's
//             </h1>

//             <div className="flex items-center gap-4 sm:gap-8">
//               <div className="flex-1 h-px bg-rose-400" />
//               <h1 className="text-3xl text-pink-700">Day</h1>
//               <div className="flex-1 h-px bg-rose-400" />
//             </div>
//           </div>

//           <div className="text-[clamp(2.5rem,8vw,5rem)] drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">
//             💕
//           </div>

//           <p className="text-base sm:text-lg md:text-xl text-rose-600 max-w-xl mx-auto">
//             Every moment with you is a treasure. Here's a little something
//             special for you.
//           </p>

//           <button
//             onClick={() =>
//               document
//                 .getElementById("love-counter")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 bg-pink-500 hover:bg-pink-600 transition-all  mx-auto px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-full shadow-lg shadow-pink-300/40"
//           >
//             Explore Our Love Story <ArrowDown size="18" />
//           </button>
//         </motion.div>
//       </section>
//     </div>
