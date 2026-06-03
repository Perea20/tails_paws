import { Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { useState } from 'react';

export default function Home() {
    // Obtenemos los datos de auth desde las props compartidas
    const { auth } = usePage().props as any;
    const user = auth.user;
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 relative z-50">
                <AppLogo />

                <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    <li><a href="#servicios" className="hover:text-emerald-700 transition-colors">Servicios</a></li>
                    <li><a href="#nosotros" className="hover:text-emerald-700 transition-colors">Nuestro Equipo</a></li>
                    <li><a href="#contacto" className="hover:text-emerald-700 transition-colors">Contacto</a></li>
                </ul>

                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/login" 
                        className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-700 transition-all"
                    >
                        Acceso staff
                    </Link>

                    {/* Lógica de Cliente */}
                    {user ? (
                        <div className="relative">
                            <button 
                                onClick={() => setMenuAbierto(!menuAbierto)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-all focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-bold text-gray-700">{user.name}</span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`w-4 h-4 text-gray-400 transition-transform ${menuAbierto ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {menuAbierto && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                        <div className="px-4 py-2 text-xs text-gray-400 font-bold uppercase">Mi Cuenta</div>
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium">
                                            Ver mi perfil
                                        </Link>
                                        <Link href="/my-appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium">
                                            Mis citas
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link 
                                            href="/logout" 
                                            method="post" 
                                            as="button" 
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                                        >
                                            Cerrar Sesión
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link 
                            href="/login"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-emerald-700 hover:text-white transition-all border border-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </Link>
                    )}
                </div>
            </nav>

            <main className="relative flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-4 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0 scale-110"
                    style={{ 
                        backgroundImage: "url('https://plus.unsplash.com/premium_photo-1663039950073-187c977da2e9?q=80&w=1470&auto=format&fit=crop')",
                        filter: "blur(6px)" 
                    }}
                />
                <div className="absolute inset-0 bg-white/60 z-10" />

                <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Cuidamos de los que <br /> <span className="text-emerald-700">más quieres.</span>
                    </h1>
                    <p className="text-gray-700 text-xl max-w-2xl mb-10 font-medium">
                        Gestión integral de pacientes, historiales clínicos y citas en tu clínica veterinaria de confianza.
                    </p>
                    <Link 
                        href={user ? "/appointments/create" : "/register"} 
                        className="bg-emerald-700 text-white font-bold px-10 py-4 rounded-2xl hover:bg-emerald-800 transition-all hover:scale-105 mb-8 text-lg"
                    >
                        Pedir cita online
                    </Link>
                    <div className="animate-bounce mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-emerald-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
            </main>

            <section id="servicios" className="py-24 px-8 bg-white relative z-30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Nuestros Servicios</h2>
                        <div className="h-1.5 w-16 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 border border-gray-100 rounded-2xl transition-all bg-gray-50 group">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-700 group-hover:rotate-6 transition-all">🩺</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Medicina General</h3>
                            <p className="text-gray-700 leading-relaxed">Revisiones preventivas y diagnósticos precisos para mantener la salud al día.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl transition-all bg-gray-50 group">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-700 group-hover:rotate-6 transition-all">💉</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Vacunación</h3>
                            <p className="text-gray-700 leading-relaxed">Planes personalizados y desparasitación para protegerlos contra enfermedades.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl transition-all bg-gray-50 group">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-700 group-hover:rotate-6 transition-all">🔬</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Análisis Clínicos</h3>
                            <p className="text-gray-700 leading-relaxed">Laboratorio propio para obtener resultados rápidos en situaciones de urgencia.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="nosotros" className="py-16 px-8 bg-white relative z-30 border-y border-gray-100">
                <div className="max-w-5xl mx-auto bg-emerald-700 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Utiliza tu seguro de Barkibu aquí
                        </h2>
                        <p className="text-emerald-50 text-lg mb-6 leading-relaxed">
                            ¿Sabías que Barkibu te devuelve el dinero de tus visitas? Al ser un sistema de libre elección, puedes traernos a tu mascota y Barkibu se encarga de abonarte el reembolso directamente en tu cuenta. 
                        </p>
                        <a 
                            href="https://www.barkibu.com/es/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 text-center"
                        >
                            Infórmate sobre Barkibu
                        </a>
                    </div>
                    <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-full flex items-center justify-center p-8 flex-shrink-0">
                        <img 
                            src="https://www.barkibu.com/images/logo/barkibu.svg" 
                            alt="Barkibu" 
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            <section className="py-24 px-8 bg-emerald-50 relative z-30">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=800&auto=format&fit=crop" 
                                alt="Veterinaria" 
                                className="relative rounded-[2.5rem] object-cover h-[450px] w-full"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <span className="text-emerald-700 font-bold uppercase tracking-[0.2em] text-xs">Excelencia Médica</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight">Pasión por el bienestar animal</h2>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                            En Tails & Paws, entendemos que tu mascota es un miembro más de la familia. Llevamos años dedicados a ofrecer una atención médica de alta calidad humana.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-4xl font-black text-emerald-700">10k+</p>
                                <p className="text-xs text-gray-400 uppercase font-bold mt-1">Pacientes</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-emerald-700">15+</p>
                                <p className="text-xs text-gray-400 uppercase font-bold mt-1">Especialistas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contacto" className="py-12 px-8 bg-white relative z-30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Contacta con nosotros</h2>
                            <p className="text-gray-700 mb-8 text-lg">¿Tienes alguna duda o necesitas programar una cirugía? Nuestro equipo te responderá en menos de 24 horas.</p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">📍</div>
                                    <p className="text-gray-700 font-medium">Gremi des Fusters, 33, Palma de Mallorca</p>
                                </div>
                                <div className="my-6 mx-auto max-w-5xl px-4">
                                    <div className="w-full h-60 max-w-md overflow-hidden rounded-xl shadow-sm border border-gray-100">
                                        <iframe 
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3073.9192834756095!2d2.6670144765129784!3d39.60650070455297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297933b44e65139%3A0x37fdb67139582520!2sGremi%20des%20Fusters%2C%2033%2C%20Nord%2C%2007009%20Palma%2C%20Illes%20Balears!5e0!3m2!1ses!2ses!4v1778444643145!5m2!1ses!2ses" 
                                            className="w-full aspect-video sm:aspect-[21/9] lg:h-[500px]" 
                                            style={{border:0}} 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade">
                                        </iframe>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">📞</div>
                                    <p className="text-gray-700 font-medium">+34 900 123 456</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">⏰</div>
                                    <ul className="text-gray-700 font-medium">
                                        <li>Lunes a viernes: 9:00 - 14:00 / 16:00 - 21:00</li>
                                        <li>Sábados: 9:00 - 16:00</li>
                                        <li>Domingos: Cerrado</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                       <form className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-gray-900 placeholder:text-gray-400" 
                                        placeholder="Tu nombre..." 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email de contacto</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-white border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-gray-900 placeholder:text-gray-400" 
                                        placeholder="tu@email.com" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mensaje</label>
                                    <textarea 
                                        rows={4} 
                                        className="w-full bg-white border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-gray-900 placeholder:text-gray-400" 
                                        placeholder="¿En qué podemos ayudarte?"
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-emerald-700 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all">
                                    Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="bg-emerald-700 border-t border-gray-100 py-8 px-8 relative z-30">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <img 
                        src="/img/tplogotxtwhite.png" 
                        alt="Veterinaria" 
                        className="relative object-cover h-24 w-auto"
                    />
                    <div className="flex gap-8 text-white text-sm font-medium">
                        <Link href="#" className="hover:text-emerald-200 transition-colors">Privacidad</Link>
                        <Link href="#" className="hover:text-emerald-200 transition-colors">Términos</Link>
                        <Link href="#contacto" className="hover:text-emerald-200 transition-colors">Contacto</Link>
                    </div>
                    <p className="text-gray-200 text-xs italic">© 2026 Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}