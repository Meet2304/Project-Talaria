import {
	GithubIcon,
	Mail,
	Heart,
	Activity,
	Footprints,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function MinimalFooter() {
	const year = new Date().getFullYear();

	const quickLinks = [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'About',
			href: '/about',
		},
		{
			title: 'Team',
			href: '/team',
		},
		{
			title: 'Gallery',
			href: '/gallery',
		},
		{
			title: 'ML Models',
			href: '/ml-models',
		},
		{
			title: 'Dashboard',
			href: '/dashboard',
		}
	];

	const features = [
		{
			title: 'Heart Rate Monitoring',
			icon: <Heart className="size-3" />,
		},
		{
			title: 'SpO2 Measurement',
			icon: <Activity className="size-3" />,
		},
		{
			title: 'Gait Analysis',
			icon: <Footprints className="size-3" />,
		},
		{
			title: 'Real-time Analytics',
			icon: <Activity className="size-3" />,
		},
	];

	const socialLinks = [
		{
			icon: <GithubIcon className="size-4" />,
			link: 'https://github.com/Meet2304/Project-Talaria',
			label: 'GitHub',
		},
		{
			icon: <Mail className="size-4" />,
			link: 'mailto:meetbhatt2304@gmail.com',
			label: 'Email',
		},
	];
	
	return (
		<footer className="relative">
			<div className="bg-[radial-gradient(35%_80%_at_30%_0%,hsl(var(--foreground)/.1),transparent)] mx-auto max-w-7xl md:border-x md:border-slate-700">
				<div className="bg absolute inset-x-0 h-px w-full" />
				<div className="grid max-w-7xl grid-cols-6 gap-6 p-6 px-4 sm:px-6 lg:px-8 ">
					<div className="col-span-6 flex flex-col gap-5 md:col-span-3">
						<Link href="/" className="flex items-center gap-1 w-max">
							<div className="relative w-5 h-10">
								<Image
									src="/images/Assets/Talaria_Logo_Dark_TR.png"
									alt="Talaria Logo"
									fill
									className="object-contain"
								/>
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
								TALARIA
							</span>
						</Link>
						<p className="text-slate-700 max-w-sm text-sm text-balance font-medium">
							Integrated footwear system for concurrent cardiovascular and gait analysis. 
							Combining MAX30102 and MPU6050 sensors for comprehensive health monitoring.
						</p>
						<div className="flex gap-2">
							{socialLinks.map((item, i) => (
								<a
									key={i}
									className="hover:bg-accent rounded-md border p-1.5 transition-colors duration-200"
									target="_blank"
									rel="noopener noreferrer"
									href={item.link}
									aria-label={item.label}
								>
									{item.icon}
								</a>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-slate-700 font-bold mb-1 text-xs">
							Quick Links
						</span>
						<div className="flex flex-col gap-1">
							{quickLinks.map(({ href, title }, i) => (
								<Link
									key={i}
									className="w-max py-1 text-sm duration-200 hover:underline"
									href={href}
								>
									{title}
								</Link>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-2">
						<span className="text-slate-700 font-bold mb-1 text-xs">
							Key Features
						</span>
						<div className="grid grid-cols-1 gap-1">
							{features.map(({ title, icon }, i) => (
								<div
									key={i}
									className="flex items-center gap-2 py-1 text-sm"
								>
									{icon}
									<span>{title}</span>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="bg-slate-700 absolute inset-x-0 h-px w-full" />
				<div className="flex max-w-7xl flex-col justify-between gap-2 pt-2 pb-5 px-4">
					<p className="text-slate-800 text-center font-medium text-sm">
						Made on Earth, by Humans
					</p>
					<p className="text-slate-800 text-center text-sm">
						© {year} Talaria. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
