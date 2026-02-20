import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState("")
    const [ project, setProject ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState('')

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setProject([...project, res.data.project])
                setIsModalOpen(false)
                setProjectName('')
            })
            .catch((error) => {
                console.log(error)
                setError('Failed to create project. Please try again.')
            })
        navigate('/');
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
            setIsLoading(false)

        }).catch(err => {
            console.log(err)
            setError('Failed to load projects')
            setIsLoading(false)
        })

    }, [])

    return (
        <main className='min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden'>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="backdrop-blur-sm bg-white/5 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="animate-fadeIn">
                                <h1 className="text-4xl font-bold text-white mb-2">Your Projects</h1>
                                <p className="text-slate-400">Manage and collaborate on your projects</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                        {user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white font-medium">{user?.email || 'User'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Error message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 animate-shake">
                                <p className="text-red-200 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Projects grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Create new project card */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group relative h-48 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 flex flex-col items-center justify-center gap-4 p-6 overflow-hidden"
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                                
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-white">New Project</h3>
                                        <p className="text-sm text-slate-400 mt-1">Create a new project</p>
                                    </div>
                                </div>
                            </button>

                            {/* Projects */}
                            {isLoading ? (
                                // Loading skeleton
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="h-48 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 animate-pulse">
                                        <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
                                        <div className="h-3 bg-white/10 rounded w-1/3 mb-8"></div>
                                        <div className="h-4 bg-white/20 rounded w-2/3"></div>
                                    </div>
                                ))
                            ) : project.length > 0 ? (
                                project.map((proj) => (
                                    <div
                                        key={proj._id}
                                        onClick={() => {
                                            navigate(`/project`, {
                                                state: { project: proj }
                                            })
                                        }}
                                        className="group relative h-48 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer p-6 overflow-hidden flex flex-col justify-between"
                                    >
                                        {/* Gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>

                                        {/* Content */}
                                        <div className="relative z-10 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300 truncate">
                                                    {proj.name}
                                                </h2>
                                                <p className="text-sm text-slate-400 line-clamp-2">
                                                    A collaborative project for your team
                                                </p>
                                            </div>

                                            {/* Collaborators */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center -space-x-2">
                                                    {proj.users && proj.users.slice(0, 3).map((collab, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold border border-slate-800"
                                                            title={collab.email}
                                                        >
                                                            {collab.email?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
                                                        </div>
                                                    ))}
                                                    {proj.users && proj.users.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold border border-slate-600">
                                                            +{proj.users.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-slate-400">
                                                        <span className="text-white font-semibold">{proj.users?.length || 0}</span> collaborators
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow icon on hover */}
                                        <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Empty state
                                <div className="col-span-full flex flex-col items-center justify-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                                    <p className="text-slate-400 mb-6">Create your first project to get started</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
                                    >
                                        Create Project
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fadeIn">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slideUp">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                                <p className="text-sm text-slate-400 mt-1">Start a new collaborative project</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors duration-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={createProject} className="space-y-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-white mb-3">Project Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        onChange={(e) => setProjectName(e.target.value)}
                                        value={projectName}
                                        type="text"
                                        required
                                        placeholder="Enter project name"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:border-white/30"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setProjectName('')
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-300 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CSS animations */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-10px);
                    }
                    75% {
                        transform: translateX(10px);
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.8s ease-out 0.2s both;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </main>
    )
}

export default Home