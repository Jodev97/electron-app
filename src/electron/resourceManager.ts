import osUtils from 'os-utils';
import { execSync } from 'child_process';
import os from 'os';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

const POLLING_INTERVAL = 1000;

export function pollResource(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const storageData = await getStorageData();
        ipcWebContentsSend('statistics', mainWindow.webContents, {
            cpuUsage,
            ramUsage,
            storageUse: storageData?.used ?? 0
        })

    }, POLLING_INTERVAL);
}

export async function getStaticData() {
    const totalStorage = (await getStorageData())?.total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

    return { totalStorage, cpuModel, totalMemoryGB };
}

function getCpuUsage(): Promise<number> {
    return new Promise(resolve => osUtils.cpuUsage(resolve));
}

function getRamUsage() {
    return 1 - osUtils.freememPercentage();
}

async function getStorageData() {
    const path = process.platform === 'win32' ? 'C:\\' : '/';
    try {
        if (process.platform === 'win32') {
            // Comando para Windows
            const output = execSync(`wmic logicaldisk where "DeviceID='C:'" get size,freespace /format:list`).toString();
            const lines = output.split('\n');
            const sizeLine = lines.find((line: string) => line.startsWith('Size='));
            const freeLine = lines.find((line: string) => line.startsWith('FreeSpace='));

            const total = parseInt(sizeLine?.split('=')[1] ?? '', 10);
            const free = parseInt(freeLine?.split('=')[1] ?? '', 10);
            const used = total - free;

            return {
                total: Math.floor(total / 1_000_000_000), // Total en GB
                free: Math.floor(free / 1_000_000_000), // Libre en GB
                used: Math.floor(used / 1_000_000_000), // Usado en GB
                usedPercentage: ((used / total) * 100).toFixed(2) // Porcentaje usado
            };
        } else {
            // Comando para Unix/Linux/macOS
            const output = execSync(`df -k ${path}`).toString();
            const lines = output.split('\n');
            const data = lines[1].split(/\s+/); // Segunda línea con datos relevantes

            const total = parseInt(data[1], 10) * 1024; // Total en bytes
            const free = parseInt(data[3], 10) * 1024; // Libre en bytes
            const used = total - free;

            return {
                total: Math.floor(total / 1_000_000_000), // Total en GB
                free: Math.floor(free / 1_000_000_000), // Libre en GB
                used: Math.floor(used / 1_000_000_000), // Usado en GB
                usedPercentage: ((used / total) * 100).toFixed(2) // Porcentaje usado
            };
        }
    } catch (err) {
        console.error('Error al obtener los datos del almacenamiento:', err);
        return null;
    }
}
