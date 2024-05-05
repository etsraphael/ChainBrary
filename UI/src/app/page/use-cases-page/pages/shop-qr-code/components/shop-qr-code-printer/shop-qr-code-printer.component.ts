import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonButtonText } from './../../../../../../shared/enum';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

interface QRCodeForm {
  name: FormControl<string | null>;
}
@Component({
  selector: 'app-shop-qr-code-printer',
  templateUrl: './shop-qr-code-printer.component.html',
  styleUrls: ['./shop-qr-code-printer.component.scss']
})
export class ShopQrCodePrinterComponent {
  mainForm: FormGroup<QRCodeForm> = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required])
  });
  commonButtonText = CommonButtonText;
  cardTypes: number[] = [0, 1];
  cardSelected: null | number;

  get nameValue(): string {
    return this.mainForm.get('name')?.value || 'Business Name';
  }

  selectCard(index: number): void {
    this.cardSelected = index;
  }

  print(): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const svgElement = document.getElementById('shop-qr-code-visual-0') as HTMLElement;

    // Calculate the scale to fit the SVG in A4
    const pdfWidth = 210;  // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const svgWidth = svgElement.clientWidth;
    const svgHeight = svgElement.clientHeight;

    // Scale to fit either width or height
    const scaleX = pdfWidth / svgWidth;
    const scaleY = pdfHeight / svgHeight;
    const scale = Math.min(scaleX, scaleY);

    // Convert SVG to PDF using svg2pdf
    doc.svg(svgElement, {
      x: 0,
      y: 0,
      width: svgWidth * scale,
      height: svgHeight * scale,
    }).then(() => {
      // Save the PDF
      doc.save('chainbrary-qr-code.pdf');
    }).catch(err => {
      console.error('Error converting SVG to PDF: ', err);
    });
  }
}
