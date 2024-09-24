const { app } = require("indesign");
const fs = require('uxp').storage.localFileSystem;
const { formats } = require('uxp').storage;

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

        // Paso 2: Importar automáticamente los archivos CSV y vincularlos de nuevo a InDesign
        await importCsvFilesAutomatically(doc, exportFolder, tablesData);
    } catch (e) {
        console.error("Error en la función principal:", e);
    }
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
                        tablesData.push({ pageIndex: i, frameIndex: j, tableIndex: k, fileName: csvFileName });
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
                rowData.push(cell.contents.toString().replace(/,/g, '')); // Remover comas para evitar errores de CSV
            }

            csvContent += rowData.join(",") + "\n"; // Formato CSV de la fila
        }

        // Guardar el contenido CSV en un archivo
        await csvFile.write(csvContent, { format: formats.utf8 });

        console.log(`Tabla exportada a: ${csvFile.nativePath}`);
    } catch (e) {
        console.error("Error al exportar la tabla a CSV:", e);
    }
}

// Función para importar automáticamente los archivos CSV en las tablas originales
async function importCsvFilesAutomatically(doc, exportFolder, tablesData) {
    try {
        let importedCount = 0;
        const totalTables = tablesData.length;

        for (let i = 0; i < tablesData.length; i++) {
            try {
                const data = tablesData[i];
                const page = doc.pages.item(data.pageIndex);
                const textFrame = page.textFrames.item(data.frameIndex);

                // Obtener el archivo CSV directamente desde el exportFolder utilizando el nombre guardado
                const csvFile = await exportFolder.getEntry(data.fileName);
                console.log(csvFile)
                // Importar el archivo CSV al mismo lugar de la tabla original
                textFrame.place(csvFile);
                importedCount++;

                // Mostrar progreso en la consola
                console.log(`Importando tabla ${importedCount} de ${totalTables}...`);
            } catch (e) {
                console.error(`Error al importar y vincular el archivo CSV para la tabla ${i + 1}:`, e);
            }
        }

        console.log(`${importedCount} tablas importadas y vinculadas correctamente desde CSV.`);
    } catch (e) {
        console.error("Error en la importación de tablas:", e);
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

// Ejecutar la función principal
exportAndLinkTables();
