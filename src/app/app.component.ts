import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf and other directives
import { MatButtonModule } from '@angular/material/button';
import { Share } from '@capacitor/share';
import { BlinkIdScanningService } from './services/blink-id-scanning.service';
import { BlinkIdMultiSideRecognizerResult } from '@microblink/blinkid-capacitor';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,  // Include CommonModule in the imports array
    MatButtonModule
  ]
})
export class AppComponent {
  title = 'Document Scanner';
  scanResults: string = ''; // To store formatted scan results for display

  constructor(private blinkIdScanningService: BlinkIdScanningService) {
    console.log('AppComponent initialized');
  }

  async onScanClick() {
    this.scanResults = '';  // Clear previous results
    try {
      const results = await this.blinkIdScanningService.scanDocumentMultiSide();
      if (results.length > 0) {
        this.scanResults = this.formatResults(results);
        this.shareData(this.scanResults);  // Share results after formatting
      } else {
        this.scanResults = 'No results or scanning was canceled';
      }
    } catch (error) {
      console.error('Scanning error:', error);
      this.scanResults = 'Error during scanning, check the console for details';
    }
  }

  private formatResults(results: BlinkIdMultiSideRecognizerResult[]): string {
    return results.map(result => JSON.stringify(result, null, 2)).join("\n\n");
  }

  private async shareData(data: string) {
    try {
      await Share.share({
        title: 'Scan Result',
        text: data,
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share Scan Details',
      });
      console.log('Data shared successfully.');
    } catch (error) {
      console.error('Failed to share data:', error);
    }
  }
}
