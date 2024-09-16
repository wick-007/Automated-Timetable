import { exportAllDaysToExcel, exportSelctedDayToExcel, printTimetableForSelectedDay, printWholeTimetable } from '../lib/functions'

const TimetableButtons = ( { timetable, selectedDay }) => {
    return (<div className='__btn__container'><div className='__print__btn__container'>
        <button onClick={() => exportSelctedDayToExcel(timetable, selectedDay)} className="__export__btn" style={{ marginRight: 10 }}>Export Timetable For Selected Day</button>
        <button onClick={() => exportAllDaysToExcel(timetable)} className="__export__btn">Export Full Timetable</button>
    </div>
        <div className='__print__btn__container'>
            <button onClick={() => printTimetableForSelectedDay(timetable, selectedDay)} className="print-button" style={{ marginRight: 10 }}>Print Timetable for Selected Day</button>
            <button onClick={() => printWholeTimetable(timetable)} className="print-button">Print Full Timetable</button>
        </div>
    </div>)
}

export default TimetableButtons;