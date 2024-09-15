import { faChartPie, faChalkboardTeacher, faBook, faClock, faBuilding, faExclamationTriangle, faEnvelopeOpenText, faTable, faSignOutAlt, faCogs } from '@fortawesome/free-solid-svg-icons';

export const componentsData = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        icon: faChartPie
    },
    {
        name: 'courses',
        label: 'Courses',
        icon: faBook
    },
    {
        name: 'lecturers',
        label: 'Lecturers',
        icon: faChalkboardTeacher
    },

    {
        name: 'classrooms',
        label: 'Classrooms',
        icon: faBuilding
    },
    {
        name: 'timetable',
        label: 'Timetable Generation',
        icon: faClock
    },
    {
        name: 'conflictReports',
        label: 'Conflict Reports',
        icon: faExclamationTriangle
    },
    {
        name: 'lecturerPreferences',
        label: 'Lecturer Preferences',
        icon: faEnvelopeOpenText
    },
    {
        name: 'generatedTimetable',
        label: 'Generated Timetable',
        icon: faTable
    },
    {
        name: 'settings',
        label: 'Settings',
        icon: faCogs
    },
    {
        name: 'logout',
        label: 'Logout',
        icon: faSignOutAlt
    },
]