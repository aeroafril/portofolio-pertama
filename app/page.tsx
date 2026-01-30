"use client"

import React, { useRef, useState, useEffect} from 'react';
import WeatherWidget from '@/components/WeatherWidget';
import Link from 'next/link';

interface Project {
  title: string;
  desc: string;
  link: string;
  tech: string[];
  color: string;
  icon: string;
}

interface SubSkill {
  name: string;
  icon: string;
  level: number;
}

interface Skill {
  name: string;
  icon: string;
  level: number;
  subSkills?: SubSkill[];
}

// Component untuk Project Card
function ProjectCard({ project, isActive }: { project: Project; isActive?: boolean }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative flex-shrink-0 snap-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        w-[63vw] sm:w-[350px] md:w-[370px] lg:w-[400px]
        ${isActive ? "scale-100 opacity-100" : "scale-[0.85] opacity-30 blur-[1px] translate-y-4"}
      `}
    >
      <div className={`bg-white rounded-2xl p-4 md:p-6 border transition-all duration-500 ${
        isActive 
          ? "border-cyan-200 shadow-[0_20px_50px_rgba(8,112,184,0.12)]" 
          : "border-transparent shadow-none"
      }`}>
        
        {/* Visual Container */}
        <div className={`relative aspect-[16/9] rounded-2xl bg-gradient-to-br ${project.color} mb-4 flex items-center justify-center overflow-hidden group shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]`}>
          <img
            src={project.icon}
            alt={project.title}
            onClick={() => setIsZoomed(!isZoomed)}
            className={`object-contain transition-all duration-700 cursor-pointer drop-shadow-[0_15px_15px_rgba(0,0,0,0.2)] ${
              isZoomed ? "scale-[1.6] rotate-3" : "scale-100 group-hover:scale-110 group-hover:-rotate-2"
            } w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64`}
          />
          {/* Glassmorphism Badge */}
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/30">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-2 md:space-y-3">
          {/* Title as Link Button */}
          <Link 
            href={project.link} 
            target='_blank'
            className="block"
          >
            <h4 className="text-lg md:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight hover:text-cyan-600 transition-colors cursor-pointer">
              {project.title}
            </h4>
          </Link>
          
          {/* Description with Expand/Collapse */}
          <div>
            <p className={`text-slate-500 text-xs md:text-sm lg:text-base leading-relaxed font-medium ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {project.desc}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cyan-600 hover:text-cyan-800 text-xs md:text-sm font-semibold mt-1 transition-colors"
            >
              {isExpanded ? 'Sembunyikan' : 'Selengkapnya'}
            </button>
          </div>
          
          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tech.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs md:text-sm font-bold border border-slate-100 hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileProjectScroll({ projects }: { projects: Project[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll state
  const updateScrollState = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 50);

    const cards = container.querySelectorAll('.snap-center');
    if (cards.length === 0) return;

    const containerCenter = scrollLeft + clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      const cardLeft = cardElement.offsetLeft;
      const cardWidth = cardElement.offsetWidth;
      const cardCenter = cardLeft + cardWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (scrollLeft >= scrollWidth - clientWidth - 50) {
      closestIndex = cards.length - 1;
    }

    setActiveIndex(closestIndex);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollState();
    }, 150);
    
    window.addEventListener("resize", updateScrollState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateScrollState();
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToCard = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.snap-center');
    if (cards.length === 0) return;

    const targetIndex = direction === "left" 
      ? Math.max(0, activeIndex - 1)
      : Math.min(cards.length - 1, activeIndex + 1);

    const targetCard = cards[targetIndex] as HTMLElement;
    const cardLeft = targetCard.offsetLeft;
    const cardWidth = targetCard.offsetWidth;
    const containerWidth = container.clientWidth;
    
    let scrollTo = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    const maxScroll = container.scrollWidth - containerWidth;
    scrollTo = Math.max(0, Math.min(scrollTo, maxScroll));

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scrollToCard("left")}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 hover:bg-gray-900/40 p-3 md:p-4 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
          aria-label="Previous project"
        >
          <img
            src="/fast-forward-double-right-arrows-symbol.png"
            alt="previous"
            className="w-3 h-3 md:w-4 md:h-4 brightness-0 invert rotate-180"
          />
        </button>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex gap-6
          pl-[calc(50vw-37.5vw)] pr-[calc(500vw-37.5vw)]
          sm:pl-[calc(50vw-188.5px)] sm:pr-[calc(400vw-188.5px)]
          md:pl-[calc(50vw-223.5px)] md:pr-[calc(400vw-223.5px)]
          lg:pl-[calc(50vw-273.5px)] lg:pr-[calc(400vw-273.5px)]">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} isActive={activeIndex === idx} />
          ))}
        </div>
      </div>

      {canScrollRight && (
        <button
          onClick={() => scrollToCard("right")}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 hover:bg-gray-900/40 p-3 md:p-4 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
          aria-label="Next project"
        >
          <img
            src="/fast-forward-double-right-arrows-symbol.png"
            alt="next"
            className="w-3 h-3 md:w-4 md:h-4 brightness-0 invert"
          />
        </button>
      )}

      <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const container = scrollRef.current;
              if (!container) return;
              
              const cards = container.querySelectorAll('.snap-center');
              const targetCard = cards[idx] as HTMLElement;
              if (!targetCard) return;

              const cardLeft = targetCard.offsetLeft;
              const cardWidth = targetCard.offsetWidth;
              const containerWidth = container.clientWidth;
              
              let scrollTo = cardLeft - (containerWidth / 2) + (cardWidth / 2);
              const maxScroll = container.scrollWidth - containerWidth;
              scrollTo = Math.max(0, Math.min(scrollTo, maxScroll));

              container.scrollTo({
                left: scrollTo,
                behavior: "smooth",
              });
            }}
            className={`h-2 md:h-3 rounded-full transition-all ${
              activeIndex === idx
                ? "w-8 md:w-10 bg-cyan-400"
                : "w-2 md:w-3 bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to project ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // loading
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if(prev >= 90){
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll untuk navbar hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle scroll untuk auto highlight section
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['home','about me', 'projects', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const projects: Project[] = [
  {
    title: "Cari Barang",
    desc: "Aplikasi pencarian produk real-time yang mengintegrasikan API Tokopedia untuk membandingkan harga dan detail barang secara efisien.",
    link: "https://github.com/aeroafril/cari_barang.git",
    tech: ["Python", "Flask", "HTML5", "CSS3"],
    color: "blue-950",
    icon: "/web_cariBarang.png"
  },
  {
    title: "Data Visualization",
    desc: "Transformasi data mentah menjadi wawasan visual yang interaktif menggunakan teknik pemetaan data modern dan analisis statistik.",
    link: "https://github.com/aeroafril/copy_of_data_visualization.git",
    tech: ["Python", "Pandas", "Numpy", "Seaborn", "Matplotlib"],
    color: "blue-950",
    icon: "/copy_of_data_visualization.png"
  },
  {
    title: "Create Password",
    desc: "Generator kata sandi kustom dengan tingkat keamanan tinggi, dirancang dengan antarmuka pengguna yang responsif dan elegan.",
    link: "https://github.com/aeroafril/createPassword.git",
    tech: ["HTML5", "CSS3", "JavaScript"],
    color: "blue-950",
    icon: "/createPassword.png"
  },
  {
    title: "Olah Data Dengan Pandas",
    desc: "Implementasi pemrosesan data otomatis untuk manipulasi, pembersihan, dan analisis dataset skala besar secara sistematis.",
    link: "https://github.com/aeroafril/projectdatabullying.git",
    tech: ["Python", "Pandas"],
    color: "blue-950",
    icon: "/olahDataDenganPandas.png"
  },
  {
    title: "Menampilkan Provinsi Indonesia dengan React dan Tailwind CSS",
    desc: "Eksplorasi data wilayah Indonesia yang dibangun dengan arsitektur Next.js dan TypeScript, mengutamakan keamanan tipe data (type-safety) dan desain modern menggunakan Tailwind CSS.",
    link: "https://frontend-workshop-lake.vercel.app/",
    tech: ["JavaScript", "Next.js", "TypeScript", "React", "Tailwind CSS"],
    color: "blue-950",
    icon: "/provinces.png"
  }
];

const skills: Skill[] = [
    { 
      name: "Python", 
      icon: "/python.png", 
      level: 90,
      subSkills: [
        { name: "Pandas", icon: "/pandas.png", level: 20 },
        { name: "Numpy", icon: "/numpy.png", level: 20 },
        { name: "TensorFlow", icon: "/tensorflow.png", level: 15 },
        { name: "Flask", icon: "/flask.png", level: 25 },
        { name: "Matplotlib", icon: "/matplotlib.png", level: 20 },
        { name: "Seaborn", icon: "/seaborn.svg", level: 20 },
        { name: "sklearn", icon: "/scikit-learn.png", level: 25 },
      ]
    },
    { 
      name: "JavaScript", 
      icon: "/js.png", 
      level: 50,
      subSkills: [
        { name: "React", icon: "/react.png", level: 15 },
        { name: "Node.js", icon: "/nodejs.png", level: 15 },
        { name: "Next.js", icon: "/nextJs.png", level: 15},
      ]
    },
    { 
      name: "C++", 
      icon: "/cpp.png", 
      level: 80,
    },
    { 
      name: "Java", 
      icon: "/java.png", 
      level: 40,
    },
    { 
      name: "SQL", 
      icon: "/mysql.png", 
      level: 80,
      subSkills: [
        { name: "MySQL", icon: "/mysql.png", level: 80 },
      ]
    },
    {
      name: "Web Development",
      icon: "/html-5.png",
      level: 40,
      subSkills: [
        { name: "HTML5", icon: "/html-5.png", level: 40 },
        { name: "CSS3", icon: "/css-3.png", level: 35 },
        { name: "Tailwind CSS", icon: "/tailwind.png", level: 20 },
      ]
    }
  ];

  const toggleSkill = (skillName: string) => {
    setExpandedSkill(expandedSkill === skillName ? null : skillName);
  };

// loading
  if(loading){
    return(
      <div className='fixed inset-0 bg-blue-950 flex flex-col items-center justify-center z-50 gap-8'>
        <h3 className='text-4xl font-bold text-white-500 items-center justify-center'>Loading...</h3>
        
        <div className='w-100 flex flex-col items-center'>
          <div className='w-full h-2 bg-gray-500 rounded-full overflow-hidden'>
            <div className='h-full bg-white transition-all duration-1000 ease-out' style={{width: `${progress}%`}}></div>
          </div>
          <p className='mt-4 text-white-500 font-medium'>{progress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white libre-franklin-regular">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/75 backdrop-blur-sm shadow-lg`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <h1 
            onClick={() => scrollToSection('home')}
            className="lilita-one-regular text-xl md:text-2xl font-bold text-white cursor-pointer hover:scale-110 transition-transform"
          >
            A<span className="text-cyan-400">R</span>
          </h1>
          <div className="flex gap-3 md:gap-6">
            {['Home', 'About Me', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-xs md:text-sm font-medium cursor-pointer transition-colors ${
                  activeSection === item.toLowerCase()
                    ? 'text-cyan-400'
                    : 'text-white hover:text-cyan-400'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section - Banner */}
      <section id="home" className="pt-32 pb-19 px-6 bg-gradient-to-b from-blue-950 via-gray-800 to-blue-950 relative overflow-hidden min-h-screen flex items-center">
        {/* Blur Bloom Background - tetap sama */}
        <div className='absolute top-0 left-0 w-[500px] h-[400px] bg-blue-600 rounded-full blur-3xl opacity-20'></div>
        <div className='absolute bottom-0 right-0 w-[500px] h-[600px] bg-gray-500 rounded-full blur-3xl opacity-30'></div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-700 rounded-full blur-3xl opacity-15'></div>
        
        {/* Content - Banner Text & Buttons */}
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="bungee-regular text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
            WELCOME TO MY <br/>
            <span className='text-transparent bg-clip-text bg-cyan-400'>
              PORTO<span className='text-transparent bg-clip-text bg-orange-500'>FOLIO</span>
            </span>
          </h1>
          <p className='text-base md:text-xl text-white-500'>Webside portofolio ini dibuat menggunakan
            <Link href="https://react.dev/" target='_blank' className='text-cyan-400 font-bold'> React</Link> dan 
            <Link href="https://tailwindcss.com/" target='_blank' className='text-cyan-400 font-bold'> Tailwind CSS</Link>,
            <br /> sesuai dengan ketentuan tugas workshop serta menampilkan 
            <Link href="/cuaca" className='text-cyan-400 font-bold'> perkiraan cuaca.</Link>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button 
              onClick={() => scrollToSection('about me')}
              className="px-8 py-4 bg-orange-500 text-white-500 cursor-pointer rounded-2xl font-bold text-lg hover:bg-white/60 hover:text-blue-950 transition-all hover:scale-105 shadow-lg">
              About Me
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 border-2 border-orange-500 text-white-500 cursor-pointer rounded-2xl font-bold text-lg hover:bg-white/60 hover:text-blue-950 transition-all hover:scale-105">
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about me" className="py-20 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="bungee-regular text-4xl font-bold text-cyan-400 mb-4 text-center">
          About <span className="text-transparent bg-clip-text bg-white">Me</span>
        </h2>
        <div className="w-24 h-1 bg-cyan-400 mx-auto mb-12"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0">
              <img 
                src="/fotoProfil.jpg" 
                alt="foto profil Aero Afril Drasando" 
                className="w-48 h-48 md:w-80 md:h-80 rounded-2xl shadow-2xl object-cover" 
              />
            </div>
            <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white-500 leading-tight">
                Hello World,<br />Saya Aero Afril Drasando
              </h3>
              <p className="text-base md:text-xl text-white-500">
                Programmer semester 4 yang sedang mendalami AI dan membangun aplikasi/webside modular yang cerdas.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="bungee-regular text-4xl font-bold text-white mb-4 text-center">
            My <span className="text-transparent bg-clip-text bg-cyan-400">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-12"></div>
          
          {/* Carousel untuk semua ukuran layar */}
          <MobileProjectScroll projects={projects} />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gradient-to-b from-blue-950 to-gray-900 relative overflow-hidden">
      {/* Blur Bloom */}
      <div className='absolute top-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10'></div>
      <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10'></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="bungee-regular text-4xl font-bold text-white mb-4 text-center">
          My <span className="text-transparent bg-clip-text bg-cyan-400">Skills</span>
        </h2>
        <div className="w-24 h-1 bg-cyan-400 mx-auto mb-12"></div>
        
        <div className="space-y-4">
          {skills.map((skill, idx) => {
            const isExpanded = expandedSkill === skill.name;
            const hasSubSkills = skill.subSkills && skill.subSkills.length > 0;
            
            const getColorClasses = (level: number) => {
              if (level > 65) {
                return {
                  text: 'text-green-400',
                  bar: 'bg-green-500',
                  glow: 'shadow-green-500/20'
                };
              } else if (level >= 45) {
                return {
                  text: 'text-yellow-400',
                  bar: 'bg-yellow-500',
                  glow: 'shadow-yellow-500/20'
                };
              } else {
                return {
                  text: 'text-red-400',
                  bar: 'bg-red-500',
                  glow: 'shadow-red-500/20'
                };
              }
            };
            
            const colors = getColorClasses(skill.level);
            
            return (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400 transition-all">
                {/* Main Skill */}
                <div 
                  onClick={() => hasSubSkills && toggleSkill(skill.name)}
                  className={`p-6 ${hasSubSkills ? 'cursor-pointer hover:bg-white/5' : ''} transition-all`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className="w-12 h-12 object-contain"
                    />
                    <h4 className="text-xl font-semibold text-white flex-1">{skill.name}</h4>
                    
                    {hasSubSkills && (
                      <div className="text-gray-400 text-sm mr-4">
                        {skill.subSkills!.length} {skill.subSkills!.length > 1 ? 'frameworks' : 'framework'}
                      </div>
                    )}
                    
                    <span className={`font-bold ${colors.text}`}>
                      {skill.level}%
                    </span>
                    
                    {hasSubSkills && (
                      <div className={`text-white transition-transform ${isExpanded ? 'rotate-270' : 'rotate-90'}`}>
                        <img
                          src= '/fast-forward-double-right-arrows-symbol.png'
                          alt= 'arrow'
                          className='w-4 h-4 brightness-0 invert'
                        /> 
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${colors.bar} shadow-lg ${colors.glow}`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
                
                {/* Sub-Skills (Expandable) */}
                {hasSubSkills && isExpanded && (
                  <div className="border-t border-white/10 bg-white/5 p-6 space-y-4 animate-fade-in">
                    <p className="text-gray-400 text-sm mb-4">Frameworks & Libraries:</p>
                    {skill.subSkills!.map((subSkill, subIdx) => {
                      const subColors = getColorClasses(subSkill.level);
                      
                      return (
                        <div key={subIdx} className="pl-4 border-l-2 border-cyan-500/30">
                          <div className="flex items-center gap-3 mb-2">
                            <img 
                              src={subSkill.icon} 
                              alt={subSkill.name} 
                              className="w-8 h-8 object-contain opacity-80"
                            />
                            <h5 className="text-base font-medium text-gray-300 flex-1">{subSkill.name}</h5>
                            <span className={`text-sm font-semibold ${subColors.text}`}>
                              {subSkill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden ml-11">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${subColors.bar}`}
                              style={{ width: `${subSkill.level}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="bungee-regular text-4xl font-bold text-white-500 mb-6">Contact Me</h2>
          <p className="text-white-500 mb-12 text-lg">
            Punya project atau mau kolaborasi? Hubungi saya di bawah ini yaa hehe!<br />
            <Link href="mailto:aeroafril@gmail.com" className='text-cyan-400 hover:text-orange-500 transition-colors font-semibold underline'>aeroafril@gmail.com</Link>
          </p>
          <p className="text-white-500 mb-12 text-lg">Serta Media Sosial saya Lainnya!</p>
          <div className="flex gap-6 justify-center">
            <Link
              href="https://www.instagram.com/ar_frildo/" target='_blank'
              className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center text-2xl hover:bg-white transition-all hover:scale-110"
            >
              <img src="instagram.svg" alt="instagram" />
            </Link>
            <Link
              href="https://github.com/aeroafril" target='_blank'
              className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center text-2xl hover:bg-white transition-all hover:scale-110"
            >
              <img src="github.svg" alt="github" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/aeroafril" target='_blank'
              className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center text-2xl hover:bg-white transition-all hover:scale-110"
            >
              <img src="LinkedIn.svg" alt="LinkedIn" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t-2 border-white-500 bg-gray-800">
        <p className="text-center text-white-500">
          Copyrigth © 2026 - <Link href='https://www.instagram.com/ar_frildo/' target='_blank' className='font-bold'>Aero Afril.</Link>
        </p>
      </footer>

      <WeatherWidget/>
    </div>
  );
}