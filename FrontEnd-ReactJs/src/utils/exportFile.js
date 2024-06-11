import * as XLSX from 'xlsx';

const exportToExcel = (data, nameSheet, nameFile) => {
    try {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, nameSheet);
        XLSX.writeFile(wb, `${nameFile}.xlsx`);
        return "ok";
    }
    catch (error) {
        return error;
    }
}

export {
    exportToExcel,
}

