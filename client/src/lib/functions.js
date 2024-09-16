import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable'; // Import for table generation in PDF

export const exportAllDaysToExcel = async (timetable) => {
    const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.19.2/package/xlsx.mjs");
  
    // Prepare the workbook
    const workbook = XLSX.utils.book_new();
  
    // Get unique days from the timetable
    const days = [...new Set(timetable.map(entry => entry.day))];
  
    // Loop through each day and prepare the worksheet
    days.forEach(day => {
      const columns = ['Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration'];
      const rows = [];
  
      timetable
        .filter(entry => entry.day === day)
        .forEach(entry => {
          entry.entries.forEach(e => {
            const [startHour, startMinute] = entry.time.split(':').map(Number);
            const endHour = startHour + entry.duration; // Calculate end time based on duration
            const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            rows.push([`${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]);
          });
        });
  
      // Convert rows to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
  
      // Set column widths
      const colWidths = [
        { width: 20 }, // Width for 'Time'
        { width: 20 }, // Width for 'Classroom'
        { width: 15 }, // Width for 'Course Code'
        { width: 30 }, // Width for 'Lecturer'
        { width: 15 }  // Width for 'Duration'
      ];
      worksheet['!cols'] = colWidths;
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, day);
    });
  
    // Write the workbook to a file
    XLSX.writeFile(workbook, 'Timetable_All_Days.xlsx', { compression: true });
  };

  export const exportSelctedDayToExcel = async (timetable, selectedDay) => {
    const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.19.2/package/xlsx.mjs");
  
    // Prepare the data
    const columns = ['Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration'];
    const rows = [];
  
    timetable
      .filter(entry => entry.day === selectedDay)
      .forEach(entry => {
        entry.entries.forEach(e => {
          const [startHour, startMinute] = entry.time.split(':').map(Number);
          const endHour = startHour + entry.duration; // Calculate end time based on duration
          const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
          rows.push([`${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]);
        });
      });
  
    // Convert rows to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
      // Set column widths
  const colWidths = [
    { width: 20 }, // Width for 'Time'
    { width: 20 }, // Width for 'Classroom'
    { width: 15 }, // Width for 'Course Code'
    { width: 30 }, // Width for 'Lecturer'
    { width: 15 }  // Width for 'Duration'
  ];
  worksheet['!cols'] = colWidths;
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedDay);
  
    // Write the workbook to a file
    XLSX.writeFile(workbook, `Timetable_${selectedDay}.xlsx`, { compression: true });
  };

  export const printTimetableForSelectedDay = (timetable, selectedDay) => {
    const doc = new jsPDF();
    const columns = ['Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration']; // Added Duration
    const rows = [];
  
    timetable
      .filter(entry => entry.day === selectedDay)
      .forEach(entry => {
        entry.entries.forEach(e => {
          const [startHour, startMinute] = entry.time.split(':').map(Number);
          const endHour = startHour + entry.duration; // Calculate end time based on duration
          const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
          rows.push([`${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]); // Include duration
        });
      });
  
    doc.autoTable({
      head: [columns],
      body: rows,
    });
  
    doc.save(`Timetable_${selectedDay}.pdf`);
  };
  export const printWholeTimetable = (timetable) => {
    const doc = new jsPDF();
    const columns = ['Day', 'Time', 'Classroom', 'Course Code', 'Lecturer', 'Duration']; // Added Duration
    const rows = [];
  
    timetable.forEach(entry => {
      entry.entries.forEach(e => {
        const [startHour, startMinute] = entry.time.split(':').map(Number);
        const endHour = startHour + entry.duration; // Calculate end time based on duration
        const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        rows.push([entry.day, `${entry.time} - ${endTime}`, e.classroom.name, e.course.code, e.lecturer.name, `${entry.duration} hour(s)`]); // Include duration
      });
    });
  
    doc.autoTable({
      head: [columns],
      body: rows,
    });
  
    doc.save('Full_Timetable.pdf');
  };
  