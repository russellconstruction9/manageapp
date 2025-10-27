import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { useData } from '../hooks/useDataContext';
import { format, formatDistanceStrict } from 'date-fns';
import { Location } from '../types';
import { MapPinIcon } from './icons/Icons';

export const LocationLink: React.FC<{ location?: Location }> = ({ location }) => {
    if (!location) {
        return <span className="text-gray-400">N/A</span>;
    }

    return (
        <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
            title={`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`}
        >
            <MapPinIcon className="w-4 h-4 mr-1" />
            View Map
        </a>
    );
}

const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
};


const TimeTracking: React.FC = () => {
    const { currentUser, timeLogs, projects, toggleClockInOut } = useData();
    const [elapsedTime, setElapsedTime] = useState('0s');
    const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
    
    useEffect(() => {
        let interval: number;
        if (currentUser?.isClockedIn && currentUser?.clockInTime) {
            interval = window.setInterval(() => {
                setElapsedTime(formatDistanceStrict(new Date(), currentUser.clockInTime!));
            }, 1000);
        } else {
            setElapsedTime('0s');
        }
        return () => window.clearInterval(interval);
    }, [currentUser?.isClockedIn, currentUser?.clockInTime]);

    if (!currentUser) {
        return (
             <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Time Tracking</h1>
                <Card className="text-center">
                    <h2 className="text-xl font-bold">No User Selected</h2>
                    <p className="mt-2 text-gray-600">Please add a team member and/or select a user from the top right to start tracking time.</p>
                </Card>
            </div>
        )
    }
    
    const activeProject = projects.find(p => p.id === currentUser?.currentProjectId);
    const completedLogs = timeLogs.filter(log => log.userId === currentUser.id && log.clockOut);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Time Tracking for {currentUser.name}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card className="text-center">
                        <h2 className="text-xl font-bold">Your Status</h2>
                        <p className={`mt-2 text-lg font-semibold ${currentUser.isClockedIn ? 'text-green-600' : 'text-gray-500'}`}>
                            {currentUser.isClockedIn ? 'Clocked In' : 'Clocked Out'}
                        </p>
                        
                        {!currentUser.isClockedIn && (
                            <div className="mt-4 space-y-4">
                                <select 
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    disabled={projects.length === 0}
                                >
                                    <option value="" disabled>{projects.length > 0 ? 'Select a project...' : 'Add a project first'}</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <Button
                                    onClick={() => toggleClockInOut(Number(selectedProjectId))}
                                    className='w-full'
                                    disabled={!selectedProjectId}
                                >
                                    Clock In
                                </Button>
                            </div>
                        )}

                        {currentUser.isClockedIn && currentUser.clockInTime && (
                            <div className="my-4">
                                {activeProject && <p className="font-semibold text-gray-700">Project: {activeProject.name}</p>}
                                <p className="text-4xl font-mono font-bold mt-2">{elapsedTime}</p>
                                <p className="text-sm text-gray-500">
                                    Clocked in at {format(currentUser.clockInTime, 'p')}
                                </p>
                                <Button
                                    onClick={() => toggleClockInOut()}
                                    className="w-full mt-6 bg-red-600 hover:bg-red-700"
                                >
                                    Clock Out
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Your Recent Logs</h2>
                         {completedLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Date</th>
                                            <th scope="col" className="px-4 py-3">Project</th>
                                            <th scope="col" className="px-4 py-3">Clock In</th>
                                            <th scope="col" className="px-4 py-3">Clock Out</th>
                                            <th scope="col" className="px-4 py-3">Duration</th>
                                            <th scope="col" className="px-4 py-3">Cost</th>
                                            <th scope="col" className="px-4 py-3">In Location</th>
                                            <th scope="col" className="px-4 py-3">Out Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completedLogs.map(log => {
                                            const project = projects.find(p => p.id === log.projectId);
                                            return (
                                                <tr key={log.id} className="bg-white border-b">
                                                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{format(log.clockIn, 'MMM d, yyyy')}</td>
                                                    <td className="px-4 py-4 font-medium text-gray-900">{project?.name || 'N/A'}</td>
                                                    <td className="px-4 py-4">{format(log.clockIn, 'p')}</td>
                                                    <td className="px-4 py-4">{log.clockOut ? format(log.clockOut, 'p') : '-'}</td>
                                                    <td className="px-4 py-4">{log.durationMs ? formatDuration(log.durationMs) : '-'}</td>
                                                    <td className="px-4 py-4 font-medium text-gray-800">{log.cost ? `$${log.cost.toFixed(2)}` : '-'}</td>
                                                    <td className="px-4 py-4"><LocationLink location={log.clockInLocation} /></td>
                                                    <td className="px-4 py-4"><LocationLink location={log.clockOutLocation} /></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No time logs recorded for this user yet.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TimeTracking;