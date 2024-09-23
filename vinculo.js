const { app } = require("indesign");
const fs = require('uxp').storage.localFileSystem;
const { formats } = require('uxp').storage; // Importar los formatos de escritura correctamente

// Función principal para exportar e importar todas las tablas de un documento InDesign
async function exportAndLinkTables() {
    try {
        const doc = app.activeDocument;
        const tablesData = []; // Array para almacenar los datos de las tablas y sus ubicaciones

        // Seleccionar la carpeta para exportar
        const exportFolder = await fs.getFolder();
        if (!exportFolder) {
            console.log("No se seleccionó una carpeta. Operación cancelada.");
            return;
        }

        // Paso 1: Exportar todas las tablas a CSV
        await exportAllTablesToCSV(doc, exportFolder, tablesData);

        // Solicitar al usuario que convierta manualmente los CSV a Excel
        console.log("Por favor, abre los archivos CSV en Excel, guárdalos como .xlsx y cierra Excel antes de continuar.");

        // Paso 2: Importar los archivos Excel y vincularlos de nuevo a InDesign
        await importAndLinkExcelFiles(doc, tablesData, exportFolder);
    } catch (e) {
        console.error("Error en la función principal:", e);
    }
}

// Función para contar todas las tablas en un documento
function countTotalTables(doc) {
    let totalTables = 0;
    for (let i = 0; i < doc.pages.length; i++) {
        const page = doc.pages.item(i);
        for (let j = 0; j < page.textFrames.length; j++) {
            const textFrame = page.textFrames.item(j);
            totalTables += textFrame.tables.length;
        }
    }
    return totalTables;
}

// Función para exportar todas las tablas del documento a archivos CSV
async function exportAllTablesToCSV(doc, exportFolder, tablesData) {
    try {
        let tableIndex = 0;
        const totalTables = countTotalTables(doc); // Contar el total de tablas

        for (let i = 0; i < doc.pages.length; i++) {
            const page = doc.pages.item(i);

            // Recorrer todos los TextFrames de la página
            for (let j = 0; j < page.textFrames.length; j++) {
                const textFrame = page.textFrames.item(j);

                // Exportar cada tabla encontrada en el TextFrame
                for (let k = 0; k < textFrame.tables.length; k++) {
                    try {
                        const table = textFrame.tables.item(k);
                        const csvFileName = `tabla_${tableIndex + 1}.csv`;
                        const csvFile = await exportFolder.createFile(csvFileName, { overwrite: true });

                        await exportTableToCSV(table, csvFile);
                        tablesData.push({ pageIndex: i, frameIndex: j, tableIndex: k, filePath: csvFile.nativePath });
                        tableIndex++;

                        // Mostrar progreso en la consola
                        console.log(`Exportando tabla ${tableIndex} de ${totalTables}...`);
                    } catch (e) {
                        console.error(`Error al exportar la tabla ${tableIndex + 1}:`, e);
                    }
                }
            }
        }

        console.log(`${tableIndex} tablas exportadas a CSV en la carpeta seleccionada.`);
    } catch (e) {
        console.error("Error en la exportación de tablas:", e);
    }
}

// Función para exportar una tabla a un archivo CSV
async function exportTableToCSV(table, csvFile) {
    try {
        let csvContent = "";

        // Recorrer las filas y celdas de la tabla para generar el contenido CSV
        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows.item(i);
            let rowData = [];

            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells.item(j);
                rowData.push(cell.contents.toString().replace(/,/g, '')); // Remover comas para evitar errores CSV
            }

            csvContent += rowData.join(",") + "\n"; // Formato CSV de la fila
        }

        // Guardar el contenido CSV en un archivo con el formato correcto
        await csvFile.write(csvContent, { format: formats.utf8 }); // Especificar formato UTF-8

        console.log(`Tabla exportada a: ${csvFile.nativePath}`);
    } catch (e) {
        console.error("Error al exportar la tabla a CSV:", e);
    }
}

// Función para importar y vincular los archivos Excel en las tablas originales
async function importAndLinkExcelFiles(doc, tablesData, exportFolder) {
    try {
        let importedCount = 0;
        const totalTables = tablesData.length;

        for (let i = 0; i < tablesData.length; i++) {
            try {
                const data = tablesData[i];
                const page = doc.pages.item(data.pageIndex);
                const textFrame = page.textFrames.item(data.frameIndex);

                // Seleccionar el archivo Excel correspondiente
                const excelFile = await fs.getFileForOpening({ types: ["xlsx"] });
                if (!excelFile) {
                    console.log(`No se seleccionó el archivo Excel para la tabla ${i + 1}. Operación cancelada.`);
                    continue;
                }

                // Importar el archivo Excel al mismo lugar de la tabla original
                textFrame.place(excelFile.nativePath);
                importedCount++;

                // Mostrar progreso en la consola
                console.log(`Importando tabla ${importedCount} de ${totalTables}...`);
            } catch (e) {
                console.error(`Error al importar y vincular el archivo Excel para la tabla ${i + 1}:`, e);
            }
        }

        console.log(`${importedCount} tablas importadas y vinculadas correctamente desde Excel.`);
    } catch (e) {
        console.error("Error en la importación de tablas:", e);
    }
}

// Ejecutar la función principal
exportAndLinkTables();
