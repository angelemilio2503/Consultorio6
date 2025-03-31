import log from 'loglevel';

// Configurar nivel de logs
const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'warn';
log.setLevel(logLevel);

// Almacén de logs de errores
const errorLogs: string[] = [];

// Formato personalizado para logs
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = log.methodFactory(methodName, logLevel, loggerName);
  return function (...args) {
    const time = new Date().toISOString();
    const logMessage = `[${time}] [${methodName.toUpperCase()}] ${args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')}`;

    rawMethod(logMessage);

    if (methodName === 'error') {
      errorLogs.push(logMessage);
    }
  };
};

// Función para exportar los logs como un archivo
export const downloadErrorLogs = () => {
  if (errorLogs.length === 0) {
    alert('No hay errores para descargar.');
    return;
  }

  const blob = new Blob([errorLogs.join('\n')], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `error_logs_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default log;
