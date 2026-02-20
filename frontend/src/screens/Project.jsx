import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set())
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([])
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }

    async function addCollaborators() {

        await axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ])
        setMessage("")

    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950/80 text-white rounded-lg p-3 text-sm border border-white/10'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {

        if (!project._id) return;
        initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }


        receiveMessage('project-message', data => {

            console.log(data)
            
            if (data.sender._id == 'ai') {


                const message = JSON.parse(data.message)

                console.log(message)

                webContainer?.mount(message.fileTree)

                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [ ...prevMessages, data ])
            } else {


                setMessages(prevMessages => [ ...prevMessages, data ])
            }
        })


        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            console.log(res.data.project)

            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden'>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Left Section - Chat */}
            <section className="left relative flex flex-col h-screen w-96 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 z-20">
                {/* Header */}
                <header className='flex justify-between items-center p-4 bg-slate-900/60 backdrop-blur-xl border-b border-white/10'>
                    <button 
                        className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 text-white text-sm font-medium'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add collaborator
                    </button>
                    <button 
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className='p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 text-white'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a6 6 0 1112 0v-2H6v2z" />
                        </svg>
                    </button>
                </header>

                {/* Chat Area */}
                <div className="conversation-area flex-grow flex flex-col h-full relative">

                    <div
                        ref={messageBox}
                        className="message-box flex-grow flex flex-col gap-3 overflow-y-auto px-4 py-4 scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender._id == user._id.toString() ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                                <div className={`flex gap-2 max-w-xs ${msg.sender._id === 'ai' ? 'max-w-md' : ''}`}>
                                    {msg.sender._id !== user._id.toString() && (
                                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1'>
                                            {msg.sender.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className='flex flex-col gap-1'>
                                        <small className='text-xs text-slate-400 px-2'>{msg.sender.email}</small>
                                        <div className={`p-3 rounded-lg ${
                                            msg.sender._id === 'ai' 
                                                ? 'bg-slate-950/60 border border-blue-500/30' 
                                                : msg.sender._id == user._id.toString()
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                                                : 'bg-slate-800/60 border border-white/10'
                                        }`}>
                                            <div className='text-white text-sm'>
                                                {msg.sender._id === 'ai' ?
                                                    WriteAiMessage(msg.message)
                                                    : <p>{msg.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Field */}
                    <div className="inputField w-full flex gap-2 p-4 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && send()}
                            className='flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:border-white/30'
                            type="text"
                            placeholder='Type a message...'
                        />
                        <button
                            onClick={send}
                            className='px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 font-medium flex items-center gap-2'
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send
                        </button>
                    </div>
                </div>

                {/* Side Panel - Collaborators */}
                <div 
                    className={`sidePanel w-full h-full flex flex-col gap-0 bg-slate-900/80 backdrop-blur-xl absolute top-0 left-0 transition-transform duration-300 border-r border-white/10 ${
                        isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
                    } z-30`}
                >
                    <header className='flex justify-between items-center px-4 py-4 bg-slate-950/60 border-b border-white/10'>
                        <h1 className='font-bold text-lg text-white'>Collaborators</h1>
                        <button 
                            onClick={() => setIsSidePanelOpen(false)}
                            classNaame='p-2 hover:bg-white/10 rounded-lg transition-colors duration-300'
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-2 px-4 py-4">

                        {project.users && project.users.map((u, idx) => (

                            <div key={idx} className="user hover:bg-white/10 p-3 flex gap-3 items-center rounded-lg transition-colors duration-300">
                                <div className='w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-sm flex-shrink-0'>
                                    {u.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h1 className='font-semibold text-white text-sm truncate'>{u.email}</h1>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </section>

            {/* Right Section - Code Editor */}
            <section className="right flex-grow h-full flex flex-col lg:flex-row relative z-10">

                {/* File Explorer */}
                <div className="explorer h-full w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">Files</h3>
                    </div>
                    <div className="file-tree w-full flex-1">
                        {Object.keys(fileTree).length > 0 ? (
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className={`tree-element cursor-pointer p-3 px-4 flex items-center gap-3 w-full text-left transition-all duration-300 hover:bg-white/10 ${
                                        currentFile === file ? 'bg-blue-500/30 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
                                    }`}>
                                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className='font-medium text-white text-sm truncate'>{file}</p>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-slate-400 text-sm">No files yet</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full">

                    {/* Tabs and Actions */}
                    <div className="top flex justify-between items-center w-full border-b border-white/10 bg-slate-900/40 backdrop-blur-xl p-4 gap-4">

                        <div className="files flex gap-2 overflow-x-auto flex-1">
                            {openFiles.length > 0 ? (
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                                            currentFile === file 
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30' 
                                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                        }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className='text-sm font-medium'>{file}</p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm">No files open</p>
                            )}
                        </div>

                        <button
                            onClick={async () => {
                                await webContainer.mount({
                                    "package.json": {
                                        file: {
                                            contents: `
                                            {
                                                "name": "project",
                                                "version": "1.0.0",
                                                "dependencies": {}
                                            }
                                            `
                                        }
                                    }
                                });

                                const installProcess = await webContainer.spawn("npm", [ "install" ])

                                installProcess.output.pipeTo(new WritableStream({
                                    write(chunk) {
                                        console.log(chunk)
                                    }
                                }))

                                if (runProcess) {
                                    runProcess.kill()
                                }

                                let tempRunProcess = await webContainer.spawn("npm", [ "start" ]);

                                tempRunProcess.output.pipeTo(new WritableStream({
                                    write(chunk) {
                                        console.log(chunk)
                                    }
                                }))

                                setRunProcess(tempRunProcess)

                                webContainer.on('server-ready', (port, url) => {
                                    console.log(port, url)
                                    setIframeUrl(url)
                                })

                            }}
                            className='px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 font-medium flex items-center gap-2 whitespace-nowrap'
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Run
                        </button>
                    </div>

                    {/* Code Area */}
                    <div className="bottom flex flex-grow overflow-auto">
                        {
                            currentFile && fileTree[ currentFile ] ? (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-950/60 backdrop-blur-xl">
                                    <pre className="hljs h-full m-0">
                                        <code
                                            className="hljs h-full outline-none text-sm"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [ currentFile ]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                                color: '#e2e8f0'
                                            }}
                                        />
                                    </pre>
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center text-slate-400">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p>Select a file to start editing</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                </div>

                {/* Live Preview */}
                {iframeUrl && webContainer &&
                    (<div className="flex flex-col h-full w-96 border-l border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
                        <div className="address-bar p-3 border-b border-white/10 bg-slate-950/60">
                            <input 
                                type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full p-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full"></iframe>
                    </div>)
                }


            </section>

            {/* Add Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slideUp">
                        <header className='flex justify-between items-center mb-6'>
                            <div>
                                <h2 className='text-2xl font-bold text-white'>Add Collaborators</h2>
                                <p className='text-sm text-slate-400 mt-1'>Select users to add to your project</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className='p-2 hover:bg-white/10 rounded-lg transition-colors duration-300'
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-20 max-h-72 overflow-y-auto">
                            {users.map(u => (
                                <div 
                                    key={u._id}
                                    className={`user cursor-pointer p-3 flex gap-3 items-center rounded-lg transition-all duration-300 ${
                                        Array.from(selectedUserId).indexOf(u._id) !== -1 
                                            ? 'bg-blue-500/30 border border-blue-500/50' 
                                            : 'hover:bg-white/10 border border-transparent'
                                    }`}
                                    onClick={() => handleUserClick(u._id)}
                                >
                                    <div className='w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-sm flex-shrink-0'>
                                        {u.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <h1 className='font-medium text-white text-sm flex-1'>{u.email}</h1>
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                                        Array.from(selectedUserId).indexOf(u._id) !== -1 
                                            ? 'bg-blue-500 border-blue-500' 
                                            : 'border-white/30'
                                    }`}>
                                        {Array.from(selectedUserId).indexOf(u._id) !== -1 && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className='flex-1 px-4 py-3 rounded-lg font-semibold text-slate-300 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addCollaborators}
                                className='flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add
                            </button>
                        </div>
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
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    )
}

export default Project