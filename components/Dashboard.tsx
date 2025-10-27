import React from 'react';
import Card from './Card';
import { useData } from '../hooks/useDataContext';
import { TaskStatus } from '../types';
import { isThisWeek } from 'date-fns';
import { Link } from 'react-router-dom';
import { MapPinIcon } from './icons/Icons';

const Dashboard: React.FC = () => {
    const { projects, tasks, users, currentUser, timeLogs, currentLocation } = useData();

    if (!currentUser && users.length === 0) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-gray-800">Welcome to ConstructTrack Pro</h1>
                <p className="mt-2 text-gray-600">Get started by adding your first team member.</p>
            </div>
        )
    }

    const activeProjects = projects.filter(p => p.status === 'In Progress').length;
    
    // Time tracking data
    const userTimeLogsThisWeek = timeLogs.filter(log => 
        log.userId === currentUser?.id && 
        log.clockOut && 
        isThisWeek(new Date(log.clockIn), { weekStartsOn: 1 })
    );
    const totalMsThisWeek = userTimeLogsThisWeek.reduce((acc, log) => acc + (log.durationMs || 0), 0);
    const hoursThisWeek = (totalMsThisWeek / (1000 * 60 * 60)).toFixed(1);
    const weeklyCost = userTimeLogsThisWeek.reduce((acc, log) => acc + (log.cost || 0), 0);
    
    // Task status counts
    const todoTasks = tasks.filter(t => t.status === TaskStatus.ToDo).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.InProgress).length;
    const doneTasks = tasks.filter(t => t.status === TaskStatus.Done).length;

    // Team status
    const teamClockedIn = users.filter(u => u.isClockedIn).length;
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">
                {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : "Dashboard"}
            </h1>
            
            {/* Main stats at the top */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Link to="/time-tracking" className="block hover:shadow-lg transition-shadow duration-200 rounded-xl">
                    <Card className="h-full">
                        <h3 className="text-lg font-bold text-gray-800">Hours This Week</h3>
                        <p className="mt-2 text-4xl font-semibold text-blue-600">{hoursThisWeek}</p>
                        <p className="text-sm font-medium text-gray-500">Total Cost: ${weeklyCost.toFixed(2)}</p>
                    </Card>
                </Link>
                 <Link to="/tasks" className="block hover:shadow-lg transition-shadow duration-200 rounded-xl">
                    <Card className="h-full">
                        <h3 className="text-lg font-bold text-gray-800">Task Status</h3>
                        <div className="mt-2 space-y-2">
                           <div className="flex justify-between items-center">
                                <span className="flex items-center text-sm font-medium text-gray-600">
                                    <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span> To Do
                                </span>
                                <span className="font-semibold text-gray-800">{todoTasks}</span>
                           </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center text-sm font-medium text-amber-600">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span> In Progress
                                </span>
                                <span className="font-semibold text-gray-800">{inProgressTasks}</span>
                           </div>
                           <div className="flex justify-between items-center">
                                <span className="flex items-center text-sm font-medium text-green-600">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Done
                                </span>
                                <span className="font-semibold text-gray-800">{doneTasks}</span>
                           </div>
                        </div>
                    </Card>
                </Link>
                <Link to="/team" className="block hover:shadow-lg transition-shadow duration-200 rounded-xl">
                    <Card className="h-full">
                        <h3 className="text-lg font-bold text-gray-800">Active Team</h3>
                        <p className="mt-2 text-4xl font-semibold text-blue-600">
                            {teamClockedIn} <span className="text-2xl text-gray-500">/ {users.length}</span>
                        </p>
                        <p className={`text-sm font-semibold ${currentUser?.isClockedIn ? 'text-green-600' : 'text-gray-500'}`}>
                           You are {currentUser?.isClockedIn ? 'Clocked In' : 'Clocked Out'}
                        </p>
                    </Card>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Projects Overview ({activeProjects})</h2>
                    {projects.length > 0 ? (
                        <ul className="space-y-3">
                            {projects.slice(0,5).map(project => (
                                <li key={project.id}>
                                    <Link to={`/projects/${project.id}`} className="block p-2 -m-2 rounded-lg hover:bg-gray-50">
                                        <p className="font-medium flex justify-between">
                                            <span>{project.name}</span>
                                            <span className="text-gray-500">{project.status}</span>
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: project.status === 'Completed' ? '100%' : '65%' }}></div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     ) : <p className="text-gray-500">No projects have been added yet.</p>}
                </Card>

                {currentUser?.isClockedIn && (
                    <Card>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-blue-600"/> Live Location
                        </h2>
                        {currentLocation ? (
                            <div>
                                <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-200">
                                     <iframe
                                        src={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Live Location Map"
                                    ></iframe>
                                </div>
                                <a
                                    href={`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                                >
                                    View on Google Maps
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-500">Acquiring GPS signal...</p>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}

export default Dashboard;