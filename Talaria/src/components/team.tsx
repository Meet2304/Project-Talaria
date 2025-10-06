import Link from 'next/link'
import Image from 'next/image'

const members = [
    {
        name: 'Meet Bhatt',
        role: 'Lead Developer - Project Manager',
        avatar: '/images/team/meet.jpg',
        link: '#',
    },
    {
        name: 'Maitri Patel',
        role: 'Machine Learning Engineer - Data Scientist',
        avatar: '/images/team/Maitri.jpg',
        link: '#',
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
                                className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" 
                                src={member.avatar} 
                                alt={`${member.name} - ${member.role}`} 
                                width={826} 
                                height={1239} 
                            />
                            <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                <div className="flex justify-between">
                                    <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider text-slate-900">
                                        {member.name}
                                    </h3>
                                    <span className="text-xs text-slate-600">_0{index + 1}</span>
                                </div>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-slate-600">
                                        {member.role}
                                    </span>
                                    <Link 
                                        href={member.link} 
                                        className="inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100 text-slate-700 hover:text-slate-900"
                                    >
                                        Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </section>
    )
}