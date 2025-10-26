import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

export interface DatosRecibo {
  idTransferencia: number;
  fecha: Date;
  cuentaRemitente: string;
  cuentaDestino: string;
  monto: number;
  comision: number;
  montoTotal: number;
  motivo: string;
  nombreCliente?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfReciboService {

  constructor() { }

  /**
   * Genera un PDF con los detalles de la transferencia
   */
  generarRecibo(datos: DatosRecibo): void {
    const doc = new jsPDF();
    
    // Convertir valores a números para evitar errores
    const monto = Number(datos.monto) || 0;
    const comision = Number(datos.comision) || 0;
    const montoTotal = Number(datos.montoTotal) || 0;
    
    // Configuración de colores
    const colorPrimario = [42, 107, 178]; // #2a6bb2
    const colorTexto = [51, 51, 51];
    const colorGris = [128, 128, 128];
    
    // Encabezado
    doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Bank of Liberty', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprobante de Transferencia', 105, 30, { align: 'center' });
    
    // Información de la transferencia
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    let yPos = 55;
    
    // ID y Fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('FOLIO:', 20, yPos);
    doc.text('FECHA:', 120, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text(datos.idTransferencia.toString(), 45, yPos);
    doc.text(this.formatearFecha(datos.fecha), 145, yPos);
    
    // Línea separadora
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    
    // Detalles de las cuentas
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles de la Operación', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Cuenta Origen:', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text(datos.cuentaRemitente, 60, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Cuenta Destino:', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text(datos.cuentaDestino, 60, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Motivo:', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text(datos.motivo || 'Transferencia', 60, yPos);
    
    // Línea separadora
    yPos += 10;
    doc.line(20, yPos, 190, yPos);
    
    // Desglose de montos
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Desglose de Montos', 20, yPos);
    
    // Tabla de montos
    yPos += 10;
    doc.setFontSize(10);
    
    // Monto
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Monto transferido:', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text('$' + monto.toFixed(2), 170, yPos, { align: 'right' });
    
    // Comisión
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Comisión:', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.text('$' + comision.toFixed(2), 170, yPos, { align: 'right' });
    
    // Línea de total
    yPos += 5;
    doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 170, yPos);
    
    // Total
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('Total debitado:', 20, yPos);
    doc.text('$' + montoTotal.toFixed(2), 170, yPos, { align: 'right' });
    
    // Cuadro de información importante
    yPos += 20;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, yPos - 5, 170, 25, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Este comprobante es válido como prueba de la transacción realizada.', 105, yPos + 3, { align: 'center' });
    doc.text('Conserve este documento para futuras aclaraciones.', 105, yPos + 10, { align: 'center' });
    
    // Pie de página
    yPos = 270;
    doc.setFontSize(8);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Bank of Liberty - Sistema de Transferencias', 105, yPos, { align: 'center' });
    doc.text('Generado: ' + this.formatearFechaCompleta(new Date()), 105, yPos + 5, { align: 'center' });
    
    // Guardar el PDF
    const nombreArchivo = `Transferencia_${datos.idTransferencia}_${this.formatearFechaArchivo(datos.fecha)}.pdf`;
    doc.save(nombreArchivo);
  }

  /**
   * Formatea la fecha en formato DD/MM/YYYY HH:mm
   */
  private formatearFecha(fecha: Date): string {
    const f = new Date(fecha);
    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const anio = f.getFullYear();
    const hora = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
  }

  /**
   * Formatea la fecha completa
   */
  private formatearFechaCompleta(fecha: Date): string {
    return fecha.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatea la fecha para nombre de archivo
   */
  private formatearFechaArchivo(fecha: Date): string {
    const f = new Date(fecha);
    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const anio = f.getFullYear();
    return `${dia}${mes}${anio}`;
  }
}
