import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'

const members = [
    {
        name: 'Meet Bhatt',
        role: 'Lead IoT Developer - Project Manager',
        avatar: '/images/team/Meet_Profile_Beach.png',
        socials: {
            github: 'https://github.com/Meet2304',
            linkedin: 'https://www.linkedin.com/in/meet-bhatt-655a89250/',
            x: 'https://x.com/Meet2304',
        }
    },
    {
        name: 'Maitri Patel',
        role: 'Machine Learning Engineer - Data Scientist',
        avatar: '/images/team/Maitri.jpg',
        socials: {
            github: 'https://github.com/maitri0204',
            linkedin: 'https://www.linkedin.com/in/maitri-patel-b42249296/',
            x: 'https://x.com',
        }
    },
]

export default function TeamSection() {
    return (
        <section className="bg-transparent py-16 md:py-32">
            <div className="mt-0 gap-2 sm:grid sm:grid-cols-2 md:mt-0">
                    <h2 className="text-3xl font-bold sm:text-4xl text-slate-900">Our dream team</h2>
                    <p className="mt-4 sm:mt-0 text-slate-700">
                        The Talaria team combines expertise in software development, hardware engineering, 
                        and biomedical systems to create innovative health monitoring solutions.
                    </p>
                </div>
                
                <div className="mt-8 md:mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
                    {members.map((member, index) => (
                        <div key={index} className="group overflow-hidden">
                            <Image 
                                className="h-[50rem] w-full  object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[53rem] group-hover:" 
                                src={member.avatar} 
                                alt={`${member.name} - ${member.role}`} 
                                width={826} 
                                height={1239} 
                            />
                            <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider text-slate-900">
                                            {member.name}
                                        </h3>
                                        <span className="inline-block mt-1 translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-slate-600">
                                            {member.role}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xs text-slate-600">_0{index + 1}</span>
                                        
                                        {/* Social Media Links */}
                                        <div className="flex gap-3 translate-y-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                            <Link 
                                                href={member.socials.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-110"
                                                aria-label={`${member.name}'s GitHub`}
                                            >
                                                <Github className="h-5 w-5" />
                                            </Link>
                                            <Link 
                                                href={member.socials.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-110"
                                                aria-label={`${member.name}'s LinkedIn`}
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </Link>
                                            <Link 
                                                href={member.socials.x}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-110"
                                                aria-label={`${member.name}'s X`}
                                            >
                                                <svg 
                                                    className="h-5 w-5" 
                                                    viewBox="0 0 24 24" 
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </section>
    )
}
